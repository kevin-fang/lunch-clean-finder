var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var config = require('./config.json')
require('./util.js')

var SPREADSHEET_ID = config.spreadsheetId
var TOKEN_DIR = config.tokenDir
var TOKEN_PATH = TOKEN_DIR + config.tokenName

var sheets = google.sheets('v4')

module.exports = {
	verifyOauth: verifyOauth,
	getByDate: getByDate,
	getByTeam: getByTeam,
	getJobByName: getJobByName,
	getByName: getByName
}

// turn a person row into an object
function objectifyPersonRow(row) {
	return {
		firstName: row[1],
		lastName: row[0],
		day: row[2],
		job: row[3],
		team: row[4]
	}
}

// turn a name row into an object
const objectifyTeamRow = (row) => {
	return {
		date: row[0],
		weekday: row[1],
		notes: row[2],
		team: row[3]
	}
}

// TODO: get the days that a person is working
function getByName(auth) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: "" 
		}, (err, response) => {

		})
	})
}

/** Get the job by a date - FINISHED
 * 
 * @param {any} auth 
 * @param {Date} date 
 */
function getByDate(auth, date) {
	date = date.withoutTime()
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: "Lunch Cleanup Schedule!A:D"
		}, (err, response) => {
			if (err) reject(err);
			response.values.filter((row) => {
				return row[0] !== "DATE"
			}).filter((row) => {
				return date.valueOf() === new Date(row[0]).withoutTime().valueOf()
			})
			.map((row) => {
				return objectifyTeamRow(row)
			})
			.map((row) => {
				resolve(row)
			})
			
			reject("Date not found: " + date.valueOf())
		})
	})
}

// TODO: get the days for a specific team
function getByTeam() {

}

// Get job for a specific person
function getJobByName(auth, name) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: 'Job Assignments (by Name)!A:E'
		}, (err, response) => {
			if (err) return reject(err)
			response.values.filter((row) => {
				return (row[1] === name.first && row[0] === name.last)
			})
			.map((row) => {
				return objectifyPersonRow(row)
			})
			.map((row) => {
				resolve(row)
			})
			reject("Person not found: " + name.first + " " + name.last)
		})
	})
}

/**
 * 
 * @param {function(err, oauth)} callback (err, OAuthkey) The callback to run after authorization
 */
function verifyOauth(callback) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) {
			callback("Error loading client_secret.json. Is the file available?");
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Sheets API.
		authorize(JSON.parse(content), callback);
	});
}

function authorize(credentials, callback) {

  	var clientSecret = credentials.installed.client_secret;
  	var clientId = credentials.installed.client_id;
  	var redirectUrl = credentials.installed.redirect_uris[0];
  	var auth = new googleAuth();
  	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  	// Check if we have previously stored a token.
  	fs.readFile(TOKEN_PATH, function(err, token) {
  	  	if (err) {
			callback("Token file not found. Please run `node initialize.js`")
  	  	} else {
  	    	oauth2Client.credentials = JSON.parse(token);
  	    	callback(null, oauth2Client);
  	  	}
  	});
}

/*
function listMajors(auth) {
	var sheets = google.sheets('v4');
	sheets.spreadsheets.values.get({
		auth: auth,
		spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
		range: 'Class Data!A2:E',
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var rows = response.values;
		if (rows.length == 0) {
			console.log('No data found.');
		} else {
			console.log('Name, Major:');
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				// Print columns A and E, which correspond to indices 0 and 4.
				console.log('%s, %s', row[0], row[4]);
			}
		}
	});
}
*/