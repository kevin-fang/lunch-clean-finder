# Backend for Student Jobs Finder

To run the backend, a OAuth client secret must be acquired from the Google Developer's console. Follow the instructions in the Google Sheets API documentation to get a `client_secret.json` file and place it in this directory.


## Initialization
Initialize with `npm i && node initialize.js`. The `initialize.js` script will open an OAuth page using `client_secret.js`. Log in to a Google account with access to the spreadsheet containing jobs and paste the resulting code into the terminal.


## Running
If you want to run the jobs finder with a different spreadsheet or on a different port, modify `config.json`.

Run `npm start` to start a server on a local machine, or deploy it to a cloud platform. It will fail to run if `initialize.js` has not been run and there is not a `.credentials` folder.