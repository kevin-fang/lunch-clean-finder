var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var express = require('express')
var app = express()
var cors = require('cors')
var config = require('./config.json')
var api = require('./api.js')

require('./util.js')

// allow cross origin resource sharing - so it works with a react frontend
app.use(cors())

function log(msg) {
    console.log("[" + new Date().toISOString() + "]" + " " + msg)
}

/**
 * return the team working today
 */
app.get('/today', (req, res) => {
    log("Request for today")
    res.setHeader('Content-Type', 'text/json')
    var today = new Date()
    api.getByDate(auth, today).then((response) => {
        res.send(JSON.stringify(response[0]))
    }).catch((err) => {
        res.send(JSON.stringify({error: "Date not found", date: JSON.stringify(today)}))
        console.log(err)
    })
})

// TODO: return the days for a specific team
app.get('/team/:day/:team', (req, res) => {
    log("Request for team: " + req.params.team)
    res.setHeader('Content-Type', 'text/json')
    api.getByTeam(auth, req.params.team, req.params.day).then((response) => {
        res.send(JSON.stringify(response))
    }).catch((err) => {
        res.send(JSON.stringify({error: "Team not found", request: req.params.team}))
    })
})

// return the job days for a specific person - FINISHED
app.get('/name/:first/:last', (req, res) => {
    res.setHeader('Content-Type', 'text/json')
    api.getByName(auth, {first: req.params.first.nameify(), last: req.params.last.nameify()})
        .then((response) => {
            res.send(JSON.stringify(response))
        })
        .catch((err) => {
            res.send(JSON.stringify(
                {
                    error: "Name not found", 
                    request: 
                        {
                            first: req.params.first, 
                            last: req.params.last
                        }
                    }
                ))
            console.log(err)
        })
})

// return the job days for a specific person - FINISHED
app.get('/jobbyname/:first/:last', (req, res) => {
    log("Request for job name: " + req.params.first + " " + req.params.last)
    res.setHeader('Content-Type', 'text/json')
    api.getJobByName(auth, {first: req.params.first.nameify(), last: req.params.last.nameify()})
        .then((response) => {
            res.send(JSON.stringify(response))
        })
        .catch((err) => {
            res.send(JSON.stringify(
                {
                    error: "Name not found", 
                    request: 
                        {
                            first: req.params.first, 
                            last: req.params.last
                        }
                    }
                ))
            console.log(err)
        })
})

// get an authorization key from Google OAuth
var auth = null;
api.verifyOauth((err, authKey) => {
    if (err) {
        console.log(err)
        process.exit()
    }
    log("Successfully loaded OAuth. Starting server...")
    auth = authKey;
    startServer()
})

// start server on config port
function startServer() {
    app.listen(config.port)
    log("Server listening on port: " + config.port)
}