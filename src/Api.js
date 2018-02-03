import axios from 'axios'
let config = require('./config.json')

// returns this and next week through a call to the API - just reduces the amount of API calls needed for TodayComponent
export const GetThisAndNextWeek = (callback) => {
    let today = new Date()

    // find this friday
    let friday = new Date(today.valueOf())
    friday.setDate(friday.getDate() + (12 - friday.getDay()) % 7)

    // add 3 days to that to get next monday
    let nextMonday = new Date(friday.valueOf())
    nextMonday.setDate(nextMonday.getDate() + 3) // add 3 days to friday, making it monday

    // find friday after that
    let nextFriday = new Date(nextMonday.valueOf())
    nextFriday.setDate(nextFriday.getDate() + (12 - nextFriday.getDay()) % 7)

    let request = config.serverip + `/range?first=${today.valueOf()}&second=${nextFriday.valueOf()}`

    axios.get(request)
        .then(response => callback(response.data))
        .catch(error => {
            callback(null, error)
        })
}

// return the jobs for this week
export const GetWeek = (callback) => {
    let firstDate = new Date()
    let friday = new Date(firstDate.valueOf())
    friday.setDate(friday.getDate() + (12 - friday.getDay()) % 7)
    let request = config.serverip + `/range?first=${firstDate.valueOf()}&second=${friday.valueOf()}`

    axios.get(request)
        .then(response => callback(response.data))
        .catch(error => {
            callback(null, error)
        })
}

// returns the jobs for next week
export const GetNextWeek = (callback) => {
    // find this friday
    let friday = new Date()
    friday.setDate(friday.getDate() + (12 - friday.getDay()) % 7)

    // add 3 days to that to get next monday
    let nextMonday = new Date(friday.valueOf())
    nextMonday.setDate(nextMonday.getDate() + 3) // add 3 days to friday, making it monday

    // find friday after that
    let nextFriday = new Date(nextMonday.valueOf())
    nextFriday.setDate(nextFriday.getDate() + (12 - nextFriday.getDay()) % 7)

    let request = config.serverip + `/range?first=${nextMonday.valueOf()}&second=${nextFriday.valueOf()}`

    axios.get(request)
        .then(response => callback(response.data))
        .catch(error => {
            callback(null, error)
        })
}

/**
 * Get the teams that work on a specific date
 * @param {Date} date The date to check
 * @param {function} callback Callback after reaching API
 */
export const GetTeamsByDate = (date, callback) => {
    let request = config.serverip + `/date?month=${date.getMonth() + 1}&day=${date.getDate()}&year=${date.getFullYear()}`
    console.log("get teams by date is being called")
    axios.get(request)
        .then(response => {
            //console.log("SUCCESSFUL")
            console.log(response)
            callback(response, null)
        })
}

/**
 * Get the dates that a team works
 * @param {string} day Weekday to search for - "Monday", "Tuesday", etc.
 * @param {string} team Team to search for - "A", "B", "C"
 * @param {function} callback Callback on response data.
 */
export const GetDatesByTeam = (day, team, callback) => {
    axios.get(config.serverip + `/team/${day}/${team}`)
        .then(response => callback(response.data))
        .catch((error) => {
            callback(null, error)
        })
}

/**
 * Get the dates that a person works
 * @param {object} name Name to search for - {first: "", last: ""}
 * @param {function} callback 
 */
export const GetDatesByName = (name, callback) => {
    axios.get(config.serverip + `/name/${name.first}/${name.last}`)
        .then((response) => {
            callback(response.data)
        })
        .catch(err => {
            callback(null, err)
        })
}

/**
 * Get the job that a person has
 * @param {Object} name Name to search for - {first: "", last: ""}
 * @param {callback} callback Callback(object, error) to call
 */
export const GetJobByName = (name, callback) => {
    axios.get(config.serverip + `/jobbyname/${name.first}/${name.last}`)
        .then((response) => {
            callback(response.data)
        })
        .catch((error) => {
            if (error) console.error(error)
            callback(null, error)
        })
}