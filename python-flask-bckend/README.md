## Backend
The backend is a Python flask web service
Databases of user information and the underlying soccer data is stored as csv's on server
TODO - implement a more robust database solution, likely sqlite3.

The flask server provides several HTTP points for the frontend to access

The server lazy loads in new soccer data when it become stale (after 15 minutes).
HTTPS requests are made to the api here https://apifootball.com/ to update data
