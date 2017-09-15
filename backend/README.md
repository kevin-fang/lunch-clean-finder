# Backend for Student Jobs Finder

To run the backend, a OAuth client secret must be acquired from the Google Developer's console for their Sheets API. Follow the Node.js instructions in the [Google Sheets API documentation](https://developers.google.com/sheets/api/quickstart/nodejs) to get a `client_secret.json` file and place it in this directory.


## Initialization
Initialize with `npm i && node initialize.js`. The `initialize.js` script will open an OAuth page using `client_secret.json`. Log in to a Google account that has access to the spreadsheet containing jobs and paste the resulting access code into the terminal. You only nee dto run this once, as the credentials will be saved in the `.credentials/` folder. You can reauthenticate by deleting `.credentials/`.

## Running
If you want to run the jobs finder with a different spreadsheet/server port, modify `config.json`.

Run `npm start` to start a server on a local machine, or deploy it to a cloud platform. It will fail to run if `initialize.js` has not been run and there is not a `.credentials` folder.
