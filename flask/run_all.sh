echo starting all flask services...

echo removing old logs
rm logs/server.log
rm logs/middle.log

#export FLASK_APP=server.py
#flask run
python3 server.py &
python3 apiFootballMiddle.py &

echo running all flask services
