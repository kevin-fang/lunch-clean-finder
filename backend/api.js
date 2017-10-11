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
	getByName: getByName,
	getDateRange: getDateRange
}

// turn a person row into an object
function objectifyPersonRow(row) {
	return {
		first: row[1],
		last: row[0],
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

/**
 * Get all the jobs in a specific week
 * @param {any} auth
 * @param {Date} date Date of the Monday to receive
 */
function getDateRange(auth, firstDate, secondDate) {
	firstDate = firstDate.withoutTime()
	secondDate = secondDate.withoutTime()
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: "Lunch Cleanup Schedule!A:D"
		}, (err, response) => {
			if (err) {
				reject(err)
			} else if (response === null) {
				reject("Failed to reach cleanup schedule spreadsheet.")
			}
			var responses = response.values.filter(row => {
				return row !== [] && row[0] !== "DATE" && row[0] !== ""
			}).filter(row => {
				var checkingDate = new Date(row[0]).withoutTime()
				return checkingDate >= firstDate && checkingDate <= secondDate
			}).reduce((days, row) => {
				return days.concat([row])
			}, [])
			resolve(responses)
		})
	})
}

/** 
 * Get the job on a specific date - FINISHED
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
			if (err) {
				reject(err)
			} else if (response === null) {
				reject("Failed to reach cleanup schedule spreadsheet.")
			}
			var responseRow = response.values.filter((row) => {
				return row !== [] && row[0] !== "DATE" && row[0] !== ""
			}).filter((row) => {
				return date.valueOf() === new Date(row[0]).withoutTime().valueOf()
			}).map((row) => {
				return objectifyTeamRow(row)
			})

			if (responseRow !== null) {
				resolve(responseRow)
			} else {
				reject("Date not found: " + date.valueOf())
			}
		})
	})
}

/** 
 * Get all job dates by team - FINISHED
 * @param {any} auth 
 * @param {string} team 
 */
function getByTeam(auth, team, day) {
	team = team.slice(0, 1).toUpperCase()
	teamDays = {
		team: team,
		days: null
	}
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: "Lunch Cleanup Schedule!A:D"
		}, (err, response) => {
			if (err) reject(err);
			teamDays.days = response.values.filter((row) => {
				return row.length === 4 && row[0] !== "DATE" && row[3] !== "N/A" && row[3] !== "TBA"
			}).filter((row) => {
				return row[3].includes(team)
			}).map((row) => {
				return objectifyTeamRow(row)
			}).filter(row => {
				return row.weekday === day.nameify()
			}).reduce((days, row) => {
				return days.concat(row)
			}, [])

			resolve(teamDays)
		})
	})
}

/**
 * Get the job of a specific person
 * @param {*} auth 
 * @param {Object} name {first: "", last: ""}
 */
function getJobByName(auth, name) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get({
			auth: auth,
			spreadsheetId: SPREADSHEET_ID,
			range: 'Job Assignments (by Name)!A:E'
		}, (err, response) => {
			if (err) return reject(err)

			// handle if there are multiple words in last name by capitalizing each one
			name.last = name.last.split(" ")
				.map(name => {
					return name[0].toUpperCase() + name.slice(1)
				})
				.reduce((last, name) => {
					return last + " " + name
				}, "")
				
			// delete the first space, side effect of reduce
			name.last = name.last.slice(1)

			var job = response.values.filter((row) => {
				return row.length === 5 && row[1] === name.first && row[0] === name.last
			}).map((row) => {
				return objectifyPersonRow(row)
			})
			if (job !== null) {
				resolve(job[0])
			} else {
				reject("Person not found: " + name.first + " " + name.last)
			}
		})
	})
}

/**
 * DEPRECATED - Get all jobs of a specific person's name
 * To get jobs by name, request the team of a person and then request the days for that team.
 * @param {any} auth 
 */
function getByName(auth, name) {
	return new Promise((resolve, reject) => {
		getJobByName(auth, name).then((response) => {
			console.log(response)
			if (response === undefined || response === null) {
				reject("Person not found")
			} else {
				getByTeam(auth, response.team).then((response) => {
					resolve(response)
				}).catch((err) => {
					console.log(err)
					reject("Team not found? This should never happen. Please contact Kevin Fang on GitHub.")
			})
			}
		}).catch((err) => {
			console.log(err)
			reject("Name not found")
		})
	})
}

/*
	OAuth stuff below - do NOT change these unless you know what you are doing.
*/

/**
 * Verify the OAuth key is valid
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

/**
 * Authorize that the application has been initialized. Helper function for verifyOauth
 * @param {*} credentials 
 * @param {*} callback 
 */
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