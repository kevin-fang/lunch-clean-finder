var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var app = require('express')()
var cors = require('cors')
var config = require('./config.json')
var api = require('./api.js')

// convert any format text to a name
// kevin FAng => Kevin Fang
String.prototype.nameify = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

// allow cross origin research sharing - so it works with a react frontend
app.use(cors())

// return the team working today
app.get('/today', (req, res) => {
    console.log("Request for today")
    res.setHeader('Content-Type', 'text/json')
})

// return the days for a specific team
app.get('/team/:team', (req, res) => {
    console.log("Request for team: " + req.params.team.toUpperCase())
    res.setHeader('Content-Type', 'text/json')
    var toReturn = {
        team: req.params.team.toUpperCase()
    }
    res.send(JSON.stringify(toReturn))
})

// return the job days for a specific person
app.get('/name/:first/:last', (req, res) => {
    console.log("Request for name: " + req.params.first.nameify() + " " + req.params.last.nameify())
    res.setHeader('Content-Type', 'text/json')
    api.getByName(auth, {first: req.params.first.nameify(), last: req.params.last.nameify()})
        .then((response) => {
        })
        .catch((err) => {
            console.log(err)
        })
})

var auth = null;
api.verifyOauth((err, authKey) => {
    if (err) {
        console.log(err)
        process.exit()
    }
    console.log("Successfully loaded OAuth. Starting server...")
    auth = authKey;
    startServer()
})

function startServer() {
    app.listen(config.port)
    console.log("Server listening on port: " + config.port)
}