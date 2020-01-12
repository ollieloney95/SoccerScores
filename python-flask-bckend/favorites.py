from flask import Flask, jsonify, request
from flask_cors import CORS
import config
import pandas as pd
import json
import threading
from collections import namedtuple
import logging


app = Flask(__name__)
CORS(app)

Favorites = namedtuple('Favorites', 'username teams leagues')

class FavDbCon:

    def __init__(self):
        self.lock = threading.Lock()
        self._favorites_db = self._get_favorites_database_from_disk()


    def _get_favorites_database_from_disk(self):
        """
        retrieves user database from disk otherwise creates one
        """
        logging.info('setting up _favorites_db')
        try:
            with self.lock:
                df = pd.read_csv(config.path_favorites_db)
            df = df.set_index('username')
            return df
        except Exception as e:
            logging.info('no user db found ?')
            logging.error(e)
            return None


    def _write_user_database_to_disk(self):
        """
        retrieves user database from disk otherwise creates one
        """
        logging.info('writing _favorites_db')
        try:
            with self.lock:
                self._favorites_db.to_csv(config.path_favorites_db, index=True)
            logging.info('wrote _favorites_db')
            return True
        except Exception as e:
            logging.error(e)
            return None


    def get_for_username(self, username):
        with self.lock:
            if username not in db_con._favorites_db.index:
                return Favorites(username, set(), set())
        with self.lock:
            favs = db_con._favorites_db.loc[username].to_dict()
        return Favorites(username, set(json.loads(favs['teams'])), set(json.loads(favs['leagues'])))


    def _save_for_username(self, favs: Favorites):
        with self.lock:
            db_con._favorites_db.loc[favs.username] = [json.dumps(list(favs.teams)), json.dumps(list(favs.leagues))]
        self._write_user_database_to_disk()


    def toggle_team(self, username: str, team: str):
        favs = self.get_for_username(username)
        if team in favs.teams:
            favs.teams.remove(team)
        else:
            favs.teams.add(team)
        self._save_for_username(favs)


    def toggle_league(self, username: str, league_id: int):
        favs = self.get_for_username(username)
        if league_id in favs.leagues:
            favs.leagues.remove(league_id)
        else:
            favs.leagues.add(league_id)
        self._save_for_username(favs)


@app.route('/')
def hello_world():
    return "connected to favorites server"

@app.route('/toggleTeam/<username>/<team>/', methods=['GET'])
def toggle_team(username, team):
    logging.info('toggling team {} for user {}'.format(team, username))
    db_con.toggle_team(username, team)
    return jsonify(1)

@app.route('/toggleLeague/<username>/<league_id>/', methods=['GET'])
def toggle_league(username, league_id):
    logging.info('toggling league {} for user {}'.format(league_id, username))
    db_con.toggle_league(username, league_id)
    return jsonify(1)

@app.route('/getFavorites/<username>/', methods=['GET'])
def get_favorites(username):
    logging.info('getting favorites for user {}'.format(username))
    fav = db_con.get_for_username(username)
    logging.info('got favorites for user {}, teams {}, leagues {}'.format(username, fav.teams, fav.leagues))
    return jsonify({
        'teams':list(fav.teams),
        'leagues':list(fav.leagues)
    })


if __name__ == '__main__':
    logging.basicConfig(filename='logs/favorites.log',level=logging.DEBUG)

    global db_con
    db_con = FavDbCon()

    app.run(host="0.0.0.0", port=config.favorites_port)