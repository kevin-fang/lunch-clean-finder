# Student Jobs Finder 
Kevin Fang, 2017

Contains backend and frontend to a student jobs finder. Requires Node.js and npm.

## Setting up the server
The backend is contained in `backend/`, and instructions are included for obtaining a client secret file from Google and starting the server.

The frontend is in the base directory. Change `src/config.json` to reflect the IP of the backend server. Run `npm i && npm start` in this directory to start the React server.


### Known bugs
- When there is, say, a Friday schedule on a Thursday, that is not reflected across names.