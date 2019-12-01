echo killing all flask instances ...

echo killing server.py
pkill -9 -f server.py

echo killing apiFootballMiddle.py
pkill -9 -f apiFootballMiddle.py

echo killing favorites.py
pkill -9 -f favorites.py

echo killed all flask instances
