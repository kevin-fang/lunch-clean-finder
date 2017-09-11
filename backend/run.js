var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var app = require('express')()
var cors = require('cors')
var config = require('./config.json')
var api = require('./api.js')

app.use(cors())
app.get('/today', (req, res) => {
    console.log("Request for today")
    res.setHeader('Content-Type', 'text/json')
})

app.get('/team/:team', (req, res) => {
    console.log("Request for team: " + req.params.team.toUpperCase())
    res.setHeader('Content-Type', 'text/json')
    var toReturn = {
        team: req.params.team.toUpperCase()
    }
    res.send(JSON.stringify(toReturn))
})

app.get('/name/:first/:last', (req, res) => {
    console.log("Request for name: " + req.params.first + " " + req.params.last)
    res.setHeader('Content-Type', 'text/json')
    api.getByName(auth, {first: req.params.first, last: req.params.last})
        .then(console.log, console.error)
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