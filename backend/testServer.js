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

// allow cross origin research sharing - so it works with a react frontend
app.use(cors())

function log(msg) {
    return "[" + new Date().toISOString() + "]" + " " + msg
}

// TODO: return the team working today
app.get('/today', (req, res) => {
    log("[" + new Date().toISOString() + "]" + " request for today")
    res.setHeader('Content-Type', 'text/json')
    var today = new Date()
    var returnObject = {
		date: today.toUTCString(),
		weekday: "Monday",
		notes: "",
		team: "AB"
    }
    res.send(JSON.stringify(returnObject))
})

// return the days for a specific team
app.get('/team/:team', (req, res) => {
    log("Request for team: " + req.params.team)
    res.setHeader('Content-Type', 'text/json')
    var returnObject = {
        team: "A",
        days: [
            {
                date: "9/2/2017",
                weekday: "Monday",
                notes: "",
                team: "AC"
            },
            {
                date: "9/9/2017",
                weekday: "Monday",
                notes: "test-notes",
                team: "AB"
            }
        ]
    }
    res.send(JSON.stringify(returnObject))
})

// return the job days for a specific person - FINISHED
app.get('/name/:first/:last', (req, res) => {
    res.setHeader('Content-Type', 'text/json')
    var returnObject = {
        team: "B",
        days: [
            {
                date: "9/2/2017",
                weekday: "Monday",
                notes: "",
                team: "AC"
            },
            {
                date: "9/9/2017",
                weekday: "Monday",
                notes: "test-notes",
                team: "AB"
            }
        ]
    }
    res.send(JSON.stringify(returnObject))
})

// return the job days for a specific person - FINISHED
app.get('/jobbyname/:first/:last', (req, res) => {
    log("Request for job name")
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

function startServer() {
    app.listen(config.port)
    log("Server listening on port: " + config.port)
}
startServer()