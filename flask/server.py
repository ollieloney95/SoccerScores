from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import pandas as pd
import config
from utils import hash
import threading

app = Flask(__name__)
CORS(app)

class User:
    def __init__(self, username, password_hash, email, name, saveData):
        self.username = username
        self.password_hash = password_hash
        self.email = email
        self.name = name
        self.saveData = saveData

class UserDatabaseConnection:
    def __init__(self):
        self.lock = threading.Lock()
        self.user_db = self.get_user_database_from_disk()

    def get_user_database_from_disk(self):
        """
        retrieves user database from disk otherwise creates one
        """
        logging.info('setting up user_db')
        try:
            with self.lock:
                df = pd.read_csv(config.path_user_db)
            df = df.set_index('username')
            return df
        except Exception as e:
            logging.info('ERROR HERE !!!')
            logging.error(e)
            return None

    def write_user_database_to_disk(self):
        """
        retrieves user database from disk otherwise creates one
        """
        logging.info('writing user_db')
        try:
            with self.lock:
                self.user_db.to_csv(config.path_user_db, index=True)
            logging.info('wrote user_db')
            return True
        except Exception as e:
            logging.error(e)
            return None

    def check_credentials(self, usr):
        """
        0 means incorrect username
        1 means incorrect password
        2 means CORRECT
        """
        username = str(usr.username)
        password_hash = str(usr.password_hash)
        logging.info("checking credentials of {}".format(username))
        if username in self.user_db.index:
            logging.info('username found')
            user_db_entry = self.user_db.loc[username]
            logging.info('user_db_entry')
            logging.info(user_db_entry)
            if user_db_entry['password_hash'] == password_hash:
                return "2_CORRECT"
            else:
                return "1_INCORRECT_PASSWORD"
        else:
            return "0_INCORRECT_USERNAME"

    def add_user(self, usr):
        """
        Adds user object to user database
        """
        credentials_check = self.check_credentials(usr)
        if credentials_check == "0_INCORRECT_USERNAME":
            logging.info("adding user...")
            with self.lock:
                self.user_db.loc[usr.username] = [str(usr.password_hash), str(usr.name), str(usr.email)]
            logging.info("added user complete")
            self.write_user_database_to_disk()
        else:
            logging.info("did not add user as sername already exists")
            return "False"
        return "True"

@app.route('/')
def hello_world():
    return config.path_user_db
    return "connected to pyweb server"

@app.route('/login/', methods=['POST'])
def login():
    # try to login
    username = request.get_json()['username']
    password_hash = hash(request.get_json()['password'])

    user_ = User(username, password_hash, "", "", "")
    user_check = Db_connection.check_credentials(user_)
    if user_check == "2_CORRECT":
         logging.info("user: {} has been verifies".format(user_.username))
    elif user_check == "1_INCORRECT_PASSWORD":
        logging.info("user: {} has incorrect password".format(user_.username))
    elif user_check == "0_INCORRECT_USERNAME":
        logging.info("user: {} does not exist".format(user_.username))
    return jsonify({"user_check": user_check})

@app.route('/addAccount/', methods=['POST'])
def addAccount():
    logging.info("trying to add account")
    # try to login
    username = request.get_json()['username']
    password_hash = hash(request.get_json()['password'])
    name = request.get_json()['name']
    email = request.get_json()['email']

    user_ = User(username, password_hash, name, email, "")
    user_check = Db_connection.check_credentials(user_)
    if user_check == "2_CORRECT" or user_check == "1_INCORRECT_PASSWORD":
        logging.info("user: {} already exists".format(user_.username))
        return jsonify(2)
    else:
        logging.info("user: {} does not exist so checking password legit".format(user_.username))
    password_check = True
    if password_check == True:
        added_user = Db_connection.add_user(user_)
        return jsonify(0)
    return jsonify(1)

if __name__ == '__main__':
    import logging
    logging.basicConfig(filename='logs/server.log',level=logging.DEBUG)

    global Db_connection
    Db_connection = UserDatabaseConnection()  # or whatever you need to do

    app.run(host="0.0.0.0", port=config.server_port)