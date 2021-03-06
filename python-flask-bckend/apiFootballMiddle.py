import pandas as pd
import requests
import threading
from datetime import datetime, timedelta
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import numpy as np
import config
import json


app = Flask(__name__)
CORS(app)


class DiskConnection:
    """
    manages the disk read and writes and inital setup from disk
    """

    def __init__(self, lock, config):
        self.lock = lock
        self.config = config
        self.leagues_db = pd.DataFrame(columns=['country_id', 'country_name', 'league_id', 'league_name']).astype({'country_id': 'int32', 'league_id':'int32'})
        self.events_db = pd.DataFrame()
        self.league_db_standings = {}
        self.setup_all_league_standings_from_disk()

    def get_dbs(self):
        return(self.leagues_db, self.events_db, self.league_db_standings)

    def write_db_to_disk(self, path, db):
        """
        write pandas df to a csv
        """
        logging.info('writing db to fisk at {}'.format(path))
        try:
            with self.lock:
                db.to_csv(path, index=False)
            return True
        except Exception as e:
            logging.error('error in write_db_to_disk {}'.format(e))
        return False

    def _str_to_dict_for_col(self, df, col_name):
        df[col_name] = [json.loads(s) for s in df[col_name]]
        return df

    def _dict_to_str_for_col(self, df, col_name):
        df[col_name] = [json.dumps(d) for d in df[col_name]]
        return df

    def read_db_from_disk(self, path, index=None):
        """
        return df from disk via path
        """
        logging.info('getting db at {} from disk'.format(path))
        try:
            with self.lock:
                df = pd.read_csv(path, index_col=index, keep_default_na=False)
            return df
        except Exception as e:
            logging.error('error in getting db at {} error is {}'.format(path, e))
            return pd.DataFrame()

    def setup_all_league_standings_from_disk(self):
        if self.setup_leagues_db_from_disk() and self.setup_events_db_from_disk():
            for league_id in self.leagues_db.league_id:
                self.setup_league_standings_db_from_disk(league_id)
            return True
        return False

    def setup_leagues_db_from_disk(self):
        df = self.read_db_from_disk(self.config.path_leagues_db, index=None)
        if df.empty:
            return False
        self.leagues_db = df.astype({'country_id': 'int32', 'league_id':'int32'})
        return True

    def setup_events_db_from_disk(self):
        df = self.read_db_from_disk(self.config.path_events_db, index=None)
        if df.empty:
            return False
        df = df.astype({'match_id': 'int32', 'country_id': 'int32', 'league_id':'int32'}).set_index('match_id', drop=False)
        df['match_id'] = df['match_id'].astype('int64')
        df['match_date'] = [datetime.strptime(d, '%Y-%m-%d') for d in df['match_date']]

        # convert x columns to dicts
        df = self._str_to_dict_for_col(df, 'cards')
        df = self._str_to_dict_for_col(df, 'goalscorer')
        df = self._str_to_dict_for_col(df, 'lineup')
        df = self._str_to_dict_for_col(df, 'statistics')
        df = self._str_to_dict_for_col(df, 'substitutions')

        self.events_db = df
        return True

    def setup_league_standings_db_from_disk(self, league_id):
        path = self.config.path_league_standings_stem + str(league_id) + ".csv"
        df = self.read_db_from_disk(path, index=None)
        if df.empty:
            return False
        self.league_db_standings[league_id] = df
        return True




class HostConnection:
    """
    manages the fetches from host
    """

    def __init__(self, config, disk_connection):
        self.config = config
        self.last_refresh_times = {}
        self.disk_connection = disk_connection


    def refresh_all_leagues_from_fetch(self, leagues_db, league_db_standings):
        for league_id in leagues_db.league_id:
            league_db_standings[league_id] = self.update_league_db_standings_from_fetch(league_id, league_db_standings)
        return league_db_standings


    def update_last_refresh_times(self, id):
        self.last_refresh_times[id] = datetime.now()


    def is_data_fresh(self, id):
        if not id in self.last_refresh_times:
            return False
        time_since_update_mins = (datetime.now() - self.last_refresh_times[id]).seconds / 60
        if time_since_update_mins > self.config.refresh_time_mins:
            return False
        return True


    def update_leagues_db_from_fetch(self, leagues_db):
        # check if data is already fresh
        if self.is_data_fresh(0):
            logging.info('in update_leagues_db_from_fetch and data is fresh')
            return leagues_db
        logging.info('in update_leagues_db_from_fetch data is stale')

        # fetch data from webservice
        path = self.config.apifootball_host + '/?action=get_leagues&APIkey=' + self.config.apifootball_key
        try:
            response = requests.get(path)
            df = pd.DataFrame(response.json())
            leagues_db = df.combine_first(leagues_db)
            self.disk_connection.write_db_to_disk(self.config.path_leagues_db, leagues_db)
            self.update_last_refresh_times(0)
            leagues_db = leagues_db.astype({'country_id': 'int32', 'league_id':'int32'})
            return leagues_db
        except Exception as e:
            logging.error('error in update_leagues_db_from_fetch {}'.format(e))
        return leagues_db


    def update_events_from_fetch(self, date_from, date_to, events_db):
        # check if data is already fresh
        if self.is_data_fresh(1):
            logging.info('in update_events_from_fetch and data is fresh')
            return True
        logging.info('in update_events_from_fetch data is stale')

        # fetch data from webservice
        date_from = self._date_to_string(date_from)
        date_to = self._date_to_string(date_to)
        path = self.config.apifootball_host + '/?action=get_events&from=' + date_from + '&to=' + date_to + '&APIkey=' + self.config.apifootball_key
        try:
            logging.info('fetch for {}'.format(path))
            response = requests.get(path)
            df = pd.DataFrame(response.json()).astype({'match_id': 'int32', 'country_id': 'int32', 'league_id':'int32'}).set_index('match_id', drop=False)
            df['match_date'] = [datetime.strptime(d, '%Y-%m-%d') for d in df['match_date']]
            events_db = df.combine_first(events_db)

            df = events_db.copy()
            # convert x columns to strings for writing to disk
            df = self.disk_connection._dict_to_str_for_col(df, 'cards')
            df = self.disk_connection._dict_to_str_for_col(df, 'goalscorer')
            df = self.disk_connection._dict_to_str_for_col(df, 'lineup')
            df = self.disk_connection._dict_to_str_for_col(df, 'statistics')
            df = self.disk_connection._dict_to_str_for_col(df, 'substitutions')

            self.disk_connection.write_db_to_disk(self.config.path_events_db, df)
            self.update_last_refresh_times(1)
        except Exception as e:
            logging.error('error in update_events_from_fetch {}'.format(e))
        return events_db


    def update_league_db_standings_from_fetch(self, league_id, league_db_standings):
        # check if data is already fresh
        logging.info('updating league {} from fetch'.format(league_id))
        if self.is_data_fresh(league_id):
            logging.info('in update_league_db_standings_from_fetch and data is fresh')
            return league_db_standings[league_id]
        logging.info('in update_league_db_standings_from_fetch data is stale')

        # fetch data from webservice
        path = self.config.apifootball_host + '/?action=get_standings&league_id=' + str(
            league_id) + '&APIkey=' + self.config.apifootball_key
        logging.info('fetching from path: {}'.format(path))
        try:
            response = requests.get(path)
            res = response.json()
            league_db_standings[league_id] = pd.DataFrame(res)
            logging.info('changed league_db_standings from the fetch for {}'.format(league_id))
            self.disk_connection.write_db_to_disk(self.config.path_league_standings_stem + str(league_id) + '.csv', league_db_standings[league_id])
            self.update_last_refresh_times(league_id)
        except Exception as e:
            logging.error('error in update_league_db_standings_from_fetch {}'.format(e))
        return league_db_standings[league_id]

    def _date_to_string(self, date):
        yyyy = str(date.year)
        mm = str(date.month)
        dd = str(date.day)
        if len(mm) == 1:
            mm = '0' + mm
        if len(dd) == 1:
            dd = '0' + dd
        return yyyy + '-' + mm + '-' + dd



class DatabaseConnection:
    """
    uses DiskConnection to setup dbs and write update
    uses HostConnection to refresh the dbs
    """

    def __init__(self, config):
        self.config = config
        self.lock = threading.Lock()
        self.disk_connection = DiskConnection(self.lock, self.config)
        self.leagues_db, self.events_db, self.league_db_standings = self.disk_connection.get_dbs()
        self.host_connection = HostConnection(self.config, self.disk_connection)

        # inital updates
        date_from = datetime.now() - timedelta(days=14)
        date_to = datetime.now() + timedelta(days=14)
        self.events_db = self.host_connection.update_events_from_fetch(date_from, date_to, self.events_db)
        self.leagues_db = self.host_connection.update_leagues_db_from_fetch(self.leagues_db)
        self.league_db_standings = self.host_connection.refresh_all_leagues_from_fetch(self.leagues_db, self.league_db_standings)


    def get_events(self, league_id=None, date_from=None, date_to=None, match_id=None, team_name=None):
        df = self.events_db.copy()
        trues = np.array([True]*len(df))

        # apply filters
        match_id_filter = df.index == match_id if match_id else trues
        team_name_filter = ((df['match_hometeam_name'] == team_name) | (df['match_awayteam_name'] == team_name)) if team_name else trues
        league_id_filter = df['league_id'] == league_id if league_id else trues
        date_from_filter = df['match_date'] > date_from.replace(hour=0, minute=0, second=0) if date_from else trues
        date_to_filter = df['match_date'] < date_to.replace(hour=23, minute=59, second=0) if date_to else trues

        # format the dataframe correctly
        df = df.replace(np.nan, '', regex=True)
        df = df.loc[match_id_filter & league_id_filter & date_from_filter & date_to_filter & team_name_filter]
        df['match_date'] = [d.timestamp() for d in df['match_date']]

        return df.to_dict('index')


    def df_to_strings(self, df):
        for col in df.columns:
            df[col] = df[col].astype(str)
        return df


    def get_league_db(self):
        self.leagues_db = self.host_connection.update_leagues_db_from_fetch(self.leagues_db)
        return self.leagues_db.astype({'country_id': 'int32', 'league_id':'int32'})


    def get_league_db_standings(self, league_id):
        self.league_db_standings[league_id] = self.host_connection.update_league_db_standings_from_fetch(league_id, self.league_db_standings)
        return self.league_db_standings.get(league_id, pd.DataFrame())


    def get_leagues(self):
        """
        returns the league and country info in a dictionary form
        """
        logging.info('inside get_leagues')
        df = self.df_to_strings(self.get_league_db())
        leagues_dict = {}
        cids = list(set(df['country_id']))
        df = df.set_index('country_id')
        for cid in cids:
            if sum(df.index == cid) > 1:
                league_names = list(df.loc[cid]['league_name'])
                league_ids = list(df.loc[cid]['league_id'])
                country_name = list(df.loc[cid]['country_name'])[0]
            else:
                league_names = [df.loc[cid]['league_name']]
                league_ids = [df.loc[cid]['league_id']]
                country_name = df.loc[cid]['country_name']
            leagues_dict[cid] = {
                'country_name': country_name,
                'leagues': {
                    'league_ids': league_ids,
                    'country_name': country_name,
                    'league_names': league_names
                }
            }
        return leagues_dict


@app.route('/')
def check_server():
    return "connected to middle layer server"


@app.route('/get_leagues_db/', methods=['GET'])
def get_leagues_db():
    logging.info("get_leagues_db")
    df = db_con.get_league_db()
    return jsonify(df.to_dict('index'))


@app.route('/get_sidebar_info/', methods=['GET'])
def get_sidebar_info():
    return jsonify(db_con.get_leagues())


@app.route('/get_league_standings_db/<league_id>', methods=['GET'])
def get_league_standings_db(league_id):
    league_id=int(league_id)
    df = db_con.get_league_db_standings(league_id)
    if df.empty:
        return jsonify('league_id not recognised')
    return jsonify(df.to_dict('index'))


@app.route('/get_name_from_country_id/<country_id>/', methods=['GET'])
def get_name_from_country_id(country_id):
    country_id = int(country_id)
    df = db_con.get_league_db()
    if country_id in df['country_id'].values:
        return jsonify(df.loc[df['country_id'] == country_id].iloc[0].country_name)
    logging.warning('asked for country name for this country id but cant find them {}'.format(country_id))
    return jsonify('default')


@app.route('/get_fixtures/<league_id>', methods=['GET'])
def get_fixtures(league_id):
    league_id = int(league_id)
    date_from = datetime.now()
    date_to = datetime.now() + timedelta(days=14)
    return jsonify(db_con.get_events(league_id=league_id, date_from=date_from, date_to=date_to))


@app.route('/get_results/<identifier>/<days_back>/<days_forward>/', methods=['GET'])
def get_results(identifier, days_back, days_forward):
    days_back, days_forward = int(days_back), int(days_forward)
    date_from = datetime.now() - timedelta(days=days_back)
    date_to = datetime.now() + timedelta(days=days_forward)

    # identifier could be league_id or a team name
    if identifier.isnumeric():
        return jsonify(db_con.get_events(league_id=int(identifier), date_from=date_from, date_to=date_to))

    # must be a team name
    return jsonify(db_con.get_events(team_name=identifier, date_from=date_from, date_to=date_to))


@app.route('/get_match/<match_id>', methods=['GET'])
def get_match(match_id):
    match_id = int(match_id)
    match_info = db_con.get_events(match_id=match_id)[match_id]
    return jsonify(match_info)


@app.route('/get_all_teams/', methods=['GET'])
def get_all_teams():
    league_ids = list(db_con.get_league_db()['league_id'])
    team_list = []
    for league_id in league_ids:
        df = db_con.get_league_db_standings(league_id)[['team_name', 'team_id']]
        df['league_id'] = league_id
        team_list.extend(df.to_dict('records'))
    return jsonify(team_list)


@app.route('/get_last_matches_for_team/<team_name>/', methods=['GET'])
def get_last_matches_for_team(team_name):
    N=5
    matches = db_con.get_events(team_name=team_name, date_to=datetime.now() - timedelta(days=1))

    match_summaries = []
    for mid,match in matches.items():
        home = match['match_hometeam_name'] == team_name
        home_score = match['match_hometeam_score']
        away_score = match['match_awayteam_score']
        match_date = datetime.fromtimestamp(int(match['match_date']))
        opponent = match['match_awayteam_name'] if home else match['match_hometeam_name']
        match_summaries.append({'home':home,
                                'home_score':home_score,
                                'away_score':away_score,
                                'match_date':match_date,
                                'team_name':team_name,
                                'opponent':opponent})

    match_summaries.sort(key=lambda x:x['match_date'], reverse=True)
    return jsonify(match_summaries[:min(N, len(match_summaries))])


@app.route('/get_team_info/<team_name>/', methods=['GET'])
def get_team_info(team_name):
    leagues = db_con.leagues_db
    for league in leagues.itertuples():
        league_standing = db_con.get_league_db_standings(league.league_id)
        if team_name not in list(league_standing['team_name']):
            continue
        info_in_league = league_standing.loc[league_standing['team_name'] == team_name].iloc[0]
        team_info = {
            'country_name': league.country_name,
            'country_id': str(league.country_id),
            'league_id': str(league.league_id),
            'league_name': league.league_name,
            'team_id': str(info_in_league.team_id),
            'pos': str(info_in_league.overall_league_position)
        }
        logging.info('found this team info {}'.format(team_info))
        return jsonify(team_info)
    return jsonify({'no info for team': team_name})



if __name__ == '__main__':
    import logging

    logging.basicConfig(filename='logs/middle.log', level=logging.DEBUG)

    global db_con
    db_con = DatabaseConnection(config)  # or whatever you need to do

    app.run(host="0.0.0.0", port=config.middleware_port)
