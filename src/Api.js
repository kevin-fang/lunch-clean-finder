import axios from 'axios'
var config = require('./config.json')

/**
 * 
 * @param {function} callback The callback to call after reaching the API
 */
export const GetToday = (callback) => {
    GetTeamsByDate(new Date(), callback)
}

/**
 * 
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

export const GetDatesByTeam = (day, team, callback) => {
    axios.get(config.serverip + `/team/${day}/${team}`)
        .then(response => callback(response.data))
        .catch((error) => {
            callback(null, error)
        })
}

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
 * 
 * @param {Object} name Object for names
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