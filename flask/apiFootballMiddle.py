import pandas as pd
import requests
import threading
from datetime import datetime, timedelta
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import numpy as np
import config

app = Flask(__name__)
CORS(app)


class DiskConnection:
    """
    manages the disk read and writes and inital setup from disk
    """

    def __init__(self, lock, config):
        self.lock = lock
        self.config = config
        self.leagues_db = pd.DataFrame(columns=['country_id', 'country_name', 'league_id', 'league_name'])
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
                db.to_csv(path)
            return True
        except Exception as e:
            logging.error('error in write_db_to_disk {}'.format(e))
        return False

    def read_db_from_disk(self, path, index=True):
        """
        return df from disk via path
        """
        logging.info('getting db at {} from disk'.format(path))
        try:
            with self.lock:
                df = pd.read_csv(path, index=index)
            return df
        except Exception as e:
            logging.error('error in getting db at {} error is {}'.format(path,e))
            return pd.DataFrame()

    def setup_all_league_standings_from_disk(self):
        if self.setup_leagues_db_from_disk() and self.setup_events_db_from_disk():
            for league_id in self.leagues_db.league_id:
                self.setup_league_standings_db_from_disk(league_id)
            return True
        return False

    def setup_leagues_db_from_disk(self):
        df = self.read_db_from_disk(self.config.path_leagues_db, False)
        if df.empty:
            return False
        self.leagues_db = df
        return True

    def setup_events_db_from_disk(self):
        df = self.read_db_from_disk(self.config.path_events_db)
        if df.empty:
            return False
        df = df.astype({'match_id': 'int32', 'country_id': 'int32', 'league_id':'int32'}).set_index('match_id', drop=False)
        df['match_id'] = df['match_id'].astype('int64')
        df['match_date'] = [datetime.strptime(d, '%Y-%m-%d') for d in df['match_date']]
        self.events_db = df
        return True

    def setup_league_standings_db_from_disk(self, league_id):
        path = self.config.path_league_standings_stem + str(league_id) + ".csv"
        df = self.read_db_from_disk(path)
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

            self.disk_connection.write_db_to_disk(self.config.path_events_db, events_db)
            self.update_last_refresh_times(1)
        except Exception as e:
            logging.error('error in update_events_from_fetch {}'.format(e))
        return events_db


    def update_league_db_standings_from_fetch(self, league_id, league_db_standings):
        # check if data is already fresh
        if self.is_data_fresh(league_id):
            logging.info('in update_league_db_standings_from_fetch and data is fresh')
            return league_db_standings[league_id]
        logging.info('in update_league_db_standings_from_fetch data is stale')

        # fetch data from webservice
        path = self.config.apifootball_host + '/?action=get_standings&league_id=' + str(
            league_id) + '&APIkey=' + self.config.apifootball_key
        try:
            response = requests.get(path)
            df = pd.DataFrame(response.json())
            logging.info('changed league_db_standings from the fetch for {}'.format(league_id))
            self.disk_connection.write_db_to_disk(self.config.path_league_standings_stem + str(league_id), df)
            self.update_last_refresh_times(league_id)
        except Exception as e:
            logging.error('error in update_league_db_standings_from_fetch {}'.format(e))
        return df

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


    def get_events(self, league_id=None, date_from=None, date_to=None, match_id=None):
        df = self.events_db.copy()
        trues = np.array([True]*len(df))

        # apply filters
        match_id_filter = df.index == match_id if match_id else trues
        league_id_filter = df['league_id'] == league_id if league_id else trues
        date_from_filter = df['match_date'] > date_from.replace(hour=0, minute=0, second=0) if date_from else trues
        date_to_filter = df['match_date'] < date_to.replace(hour=23, minute=59, second=0) if date_to else trues

        # format the dataframe correctly
        df = df.replace(np.nan, '', regex=True)
        df = df.loc[match_id_filter & league_id_filter & date_from_filter & date_to_filter]
        df['match_date'] = [d.timestamp() for d in df['match_date']]
        #df['lineup'] = [ast.literal_eval(d) for d in df['lineup']]
        #df['cards'] = [ast.literal_eval(d) for d in df['cards']]
        #df['goalscorer'] = [ast.literal_eval(d) for d in df['goalscorer']]
        #df['statistics'] = [ast.literal_eval(d) for d in df['statistics']]

        return df.to_dict('index')


    def df_to_strings(self, df):
        for col in df.columns:
            df[col] = df[col].astype(str)
        return df


    def get_league_db(self):
        self.leagues_db = self.host_connection.update_leagues_db_from_fetch(self.leagues_db)
        return self.leagues_db


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


@app.route('/get_fixtures/<league_id>', methods=['GET'])
def get_fixtures(league_id):
    league_id = int(league_id)
    date_from = datetime.now()
    date_to = datetime.now() + timedelta(days=14)
    return jsonify(db_con.get_events(league_id=league_id, date_from=date_from, date_to=date_to))


@app.route('/get_results/<league_id>', methods=['GET'])
def get_results(league_id):
    league_id = int(league_id)
    date_from = datetime.now() - timedelta(days=14)
    date_to = datetime.now()
    return jsonify(db_con.get_events(league_id=league_id, date_from=date_from, date_to=date_to))


@app.route('/get_match/<match_id>', methods=['GET'])
def get_match(match_id):
    match_id = int(match_id)
    match_info = db_con.get_events(match_id=match_id)[match_id]
    return jsonify(match_info)


if __name__ == '__main__':
    import logging

    logging.basicConfig(filename='logs/middle.log', level=logging.DEBUG)

    global db_con
    db_con = DatabaseConnection(config)  # or whatever you need to do

    app.run(host="0.0.0.0", port=config.middleware_port)
