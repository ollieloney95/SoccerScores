import pandas as pd
import requests
import threading
from datetime import datetime, timedelta
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import numpy as np
import ast

import config

app = Flask(__name__)
CORS(app)


class DatabaseConnection:
    # this should connect to a q server to check the database for things
    def __init__(self):
        self.lock = threading.Lock()
        self.leagues_db = pd.DataFrame()
        self.events_db = pd.DataFrame()
        self.league_db_standings = {}
        self.setup_from_disk()
        self.last_refresh_times = {}
        self.refresh_events()
        self.update_leagues_db_from_fetch()
        self.refresh_all_leagues_from_fetch()

    #----------- disk io ----------------------------------------------------------------------------------------

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

    def setup_from_disk(self):
        self.setup_leagues_from_disk()
        self.setup_events_db_from_disk()
        for league_id in self.leagues_db.league_id:
            self.setup_league_standings_db_from_disk(league_id)

    def setup_leagues_from_disk(self):
        """
        retrieves league db from disk via path in config
        """
        logging.info('getting league_db from disk')
        try:
            with self.lock:
                df = pd.read_csv(config.path_leagues_db)
            self.leagues_db = df
            logging.info('set up leagues_db from disk')
            return True
        except Exception as e:
            logging.error('error in get_league_db_from_disk {}'.format(e))
            return False

    def setup_events_db_from_disk(self):
        """
        retrieves events db from disk via path in config
        """
        logging.info('getting league_db from disk')
        try:
            with self.lock:
                df = pd.read_csv(config.path_events_db).set_index('match_id', drop=False)
            df = df.astype({'country_id': 'int32',
                            'league_id':'int32'})
            df['match_date'] = [datetime.strptime(d, '%Y-%m-%d') for d in df['match_date']]
            self.events_db = df
            return True
        except Exception as e:
            logging.error('error in setup_leagues_from_disk {}'.format(e))
            return False

    def setup_league_standings_db_from_disk(self, league_id):
        """
        retrieves league standings db from disk via path stem in config plus league_id
        """
        logging.info('setting up league_db for id {} from disk'.format(league_id))
        path = config.path_league_standings_stem + str(league_id)
        try:
            with self.lock:
                df = pd.read_csv(path)
            self.league_db_standings[league_id] = df
            logging.info('set up league_db for id {} from disk'.format(league_id))
            return True
        except Exception as e:
            logging.error('error in get_league_standings_db_from_disk {}'.format(e))
            return False

    #----------- disk io ---------------------------------------------------------------------------------------
    #----------- fetches----------------------------------------------------------------------------------------

    def refresh_all_leagues_from_fetch(self):
        if self.leagues_db.empty:
            raise Exception('leagues_db is empty so something went wrong !')
        for league_id in self.leagues_db.league_id:
            self.update_league_db_standings_from_fetch(league_id)

    def update_leagues_db_from_fetch(self):
        """
        using an api call sets up the leagues_db
        """
        logging.info('updating  leagues_db from fetch')
        path = config.apifootball_host + '/?action=get_leagues&APIkey=' + config.apifootball_key
        try:
            response = requests.get(path)
            df = pd.DataFrame(response.json())
            self.leagues_db = df
            self.write_db_to_disk(config.path_leagues_db, df)
            self.update_last_refresh_times(0)
            return True
        except Exception as e:
            logging.error('error in update_leagues_db_from_fetch {}'.format(e))
            return False

    def update_events_from_fetch(self, date_from, date_to):
        """
        retrieves events from fetch by date and updates the events_db by match_id
        """
        date_from = self.date_to_string(date_from)
        date_to = self.date_to_string(date_to)
        path = config.apifootball_host + '/?action=get_events&from=' + date_from + '&to=' + date_to + '&APIkey=' + config.apifootball_key
        try:
            logging.info('fetch for {}'.format(path))
            response = requests.get(path)
            df = pd.DataFrame(response.json()).set_index('match_id', drop=False)
            df = df.astype({'country_id': 'int32',
                            'league_id':'int32'})
            df['match_date'] = [datetime.strptime(d, '%Y-%m-%d') for d in df['match_date']]

            if self.events_db.empty:
                logging.info('events_db is empty so setting from fetch')
                self.events_db = df
            else:
                logging.info('events_db updating {} with new table {}'.format(len(self.events_db), len(df)))
                self.events_db.update(df, join='left', overwrite=True)
            self.write_db_to_disk(config.path_events_db, df)
            self.update_last_refresh_times(1)
            return True
        except Exception as e:
            logging.error('error in update_events_from_fetch {}'.format(e))
            return False

    def update_league_db_standings_from_fetch(self, league_id):
        """
        using an api call to set up the league_db_standings
        """
        logging.info('setting up league_db_standings from fetch for id {}'.format(league_id))
        path = config.apifootball_host + '/?action=get_standings&league_id=' + str(
            league_id) + '&APIkey=' + config.apifootball_key
        try:
            response = requests.get(path)
            df = pd.DataFrame(response.json())
            self.league_db_standings[league_id] = df
            logging.info('changed league_db_standings from the fetch for {}'.format(league_id))
            self.write_db_to_disk(config.path_league_standings_stem + str(league_id), df)
            self.update_last_refresh_times(league_id)
            return True
        except Exception as e:
            logging.error('error in update_league_db_standings_from_fetch {}'.format(e))
            return False

    #----------- fetches----------------------------------------------------------------------------------------

    def get_events(self, league_id=None, date_from=None, date_to=None, match_id=None):
        df = self.events_db.copy()
        trues = np.array([True]*len(df))

        match_id_filter = df.index == int(match_id) if match_id else trues
        league_id_filter = df['league_id'] == int(league_id) if league_id else trues
        date_from_filter = df['match_date'] > date_from.replace(hour=0, minute=0, second=0) if date_from else trues
        date_to_filter = df['match_date'] < date_to.replace(hour=23, minute=59, second=0) if date_to else trues

        # format the dataframe correctly
        df = df.replace(np.nan, '', regex=True)
        df = df.loc[match_id_filter & league_id_filter & date_from_filter & date_to_filter]
        df['match_date'] = [d.timestamp() for d in df['match_date']]
        df['lineup'] = [ast.literal_eval(d) for d in df['lineup']]
        df['cards'] = [ast.literal_eval(d) for d in df['cards']]
        df['goalscorer'] = [ast.literal_eval(d) for d in df['goalscorer']]
        df['statistics'] = [ast.literal_eval(d) for d in df['statistics']]

        return df.to_dict('index')


    def refresh_events(self):
        if not self.is_data_fresh(1):
            logging.info('in refresh_events data not fresh')
            date_from = datetime.now() - timedelta(days=14)
            date_to = datetime.now() + timedelta(days=14)
            self.update_events_from_fetch(date_from, date_to)
            logging.info('refreshed events')
        else:
            logging.info('in refresh_events data is fresh')

    def update_last_refresh_times(self, id):
        self.last_refresh_times[id] = datetime.now()

    def is_data_fresh(self, id):
        if not id in self.last_refresh_times:
            return False
        time_since_update_mins = (datetime.now() - self.last_refresh_times[id]).seconds / 60
        if time_since_update_mins > config.refresh_time_mins:
            return False
        return True

    def date_to_string(self, date):
        yyyy = str(date.year)
        mm = str(date.month)
        dd = str(date.day)
        if len(mm) == 1:
            mm = '0' + mm
        if len(dd) == 1:
            dd = '0' + dd
        return yyyy + '-' + mm + '-' + dd

    def df_to_strings(self, df):
        for col in df.columns:
            df[col] = df[col].astype(str)
        return df

    def get_league_db(self):
        if not self.is_data_fresh(0):
            logging.info('in get_league_db data not fresh')
            self.update_leagues_db_from_fetch()
        else:
            logging.info('in get_league_db data is fresh')
        return self.leagues_db

    def get_league_db_standings(self, league_id):
        if not self.is_data_fresh(league_id):
            logging.info('in get_league_db_standings data not fresh')
            self.update_league_db_standings_from_fetch(league_id)
        else:
            logging.info('in get_league_db_standings data is fresh')
        logging.info('keys of league_db_standings are {} and league id {} is in ? {}'.format(self.league_db_standings.keys(), league_id, league_id in self.league_db_standings.keys()))
        if league_id in self.league_db_standings.keys():
            return self.league_db_standings[league_id]
        return pd.DataFrame()

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
def get_league_standings():
    logging.info("get_league_standings")
    df = db_con.get_league_db()
    return jsonify(df.to_dict('index'))


@app.route('/get_sidebar_info/', methods=['GET'])
def get_sidebar_info():
    logging.info("get_sidebar_info")
    logging.info('db_con.get_leagues() {}'.format(db_con.get_leagues()))
    return jsonify(db_con.get_leagues())


@app.route('/get_league_standings_db/<league_id>', methods=['GET'])
def get_league_standings_db(league_id):
    league_id=int(league_id)
    logging.info("get_league_standings_db for {}".format(league_id))

    df = db_con.get_league_db_standings(league_id)
    if df.empty:
        return jsonify('league_id not recognised')
    return jsonify(df.to_dict('index'))


@app.route('/get_fixtures/<league_id>', methods=['GET'])
def get_fixtures(league_id):
    date_from = datetime.now()
    date_to = datetime.now() + timedelta(days=14)
    return jsonify(db_con.get_events(league_id=league_id, date_from=date_from, date_to=date_to))


@app.route('/get_results/<league_id>', methods=['GET'])
def get_results(league_id):
    date_from = datetime.now() - timedelta(days=14)
    date_to = datetime.now()
    return jsonify(db_con.get_events(league_id=league_id, date_from=date_from, date_to=date_to))


@app.route('/get_match/<match_id>', methods=['GET'])
def get_match(match_id):
    match_info = db_con.get_events(match_id=match_id)[int(match_id)]
    return jsonify(match_info)

if __name__ == '__main__':
    import logging

    logging.basicConfig(filename='logs/middle.log', level=logging.DEBUG)

    global db_con
    db_con = DatabaseConnection()  # or whatever you need to do

    app.run(host="0.0.0.0", port=config.middleware_port)
