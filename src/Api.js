import axios from 'axios'
var config = require('./config.json')


export const GetWeek = (callback) => {
    var firstDate = new Date()
    var friday = new Date()
    friday.setDate(friday.getDate() + (12 - friday.getDay()) % 7)
    var request = config.serverip + `/range?first=${firstDate.valueOf()}&second=${friday.valueOf()}`

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
    var request = config.serverip + `/date?month=${date.getMonth() + 1}&day=${date.getDate()}&year=${date.getFullYear()}`
    axios.get(request)
        .then(response => callback(response.data))
        .catch(error => {
            callback(null, error)
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