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
 * Get the ranges
 * /range?first=[...]&second=[...]
 * Make sure queries are in milliseconds, as in Date.valueOf()
 */
app.get('/range', (req, res) => {
    log("Request for date range: " + req.query.first + " to " + req.query.second)
    var firstDate = new Date(new Number(req.query.first))
    var secondDate = new Date(new Number(req.query.second))
    res.setHeader('Content-Type', 'text/json')
    api.getDateRange(auth, firstDate, secondDate).then(response => {
        res.send(JSON.stringify(response))
    }).catch(err => {
        res.send(JSON.stringify({ error: err}))
    })
})

/**
 * Get team for a certain date
 * /date?month=[..]&day=[..]&year=[..]
 */
app.get('/date', (req, res) => {
    const formatDate = (req) => (
        req.query.month + '/' + req.query.day + '/' + req.query.year
    )
    var date = formatDate(req)
    log("Request for date: " + date)
    date = new Date(date)
    res.setHeader('Content-Type', 'text/json')
    if (date.getDay() === 0) {
        res.send(JSON.stringify({weekend: true, day: "Sunday"}))
    } else if (date.getDay() === 6) {
        res.send(JSON.stringify({weekend: true, day: "Saturday"}))
    } else {
        api.getByDate(auth, date).then((response) => {
            response[0].weekend = false
            res.send(JSON.stringify(response[0]))
        }).catch(err => {
            res.send(JSON.stringify({ error: "date not found", date: JSON.stringify(date) }))
        })
    }
})

// return the job days for a specific team - FINISHED
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
app.get('/jobbyname/:first/:last', (req, res) => {
    log("Request for job by name: " + req.params.first + " " + req.params.last)
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

/**
 * Return the team working today - DEPRECATED; please call /date?month=[]&day=[]&year=[]
 */
app.get('/today', (req, res) => {
    log("Request for today - DEPRECATED - please use /date with today's date.")
    res.setHeader('Content-Type', 'text/json')
    if (today.getDay() === 0) {
        res.send(JSON.stringify({error: "Weekend", day: "Sunday"}))
    } else if (today.getDay() === 6) {
        res.send(JSON.stringify({error: "Weekend", day: "Sunday"}))
    } else {
        api.getByDate(auth, today).then((response) => {
            res.send(JSON.stringify(response[0]))
        }).catch((err) => {
            res.send(JSON.stringify({error: "Date not found", date: JSON.stringify(today)}))
            console.log(err)
        })
    }
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
    log("Server listening on port: " + config.port + '\n')
}