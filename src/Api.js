import axios from 'axios'
var config = require('./config.json')

/**
 * 
 * @param {function} callback The callback to call after reaching the API
 */
export const GetToday = (callback) => {
    axios.get(config.serverip + '/today')
        .then(response => callback(response.data))
        .catch((error) => {
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

export const GetDatesByName = (nameObject, callback) => {
    axios.get(config.serverip + `/name/${nameObject.first}/${nameObject.last}`)
        .then((response) => {
            callback(response.data)
        })
        .catch(err => {
            callback(null, err)
        })
}

/**
 * 
 * @param {Object} nameObject Object for names
 * @param {callback} callback Callback(object, error) to call
 */
export const GetJobByName = (nameObject, callback) => {
    axios.get(config.serverip + `/jobbyname/${nameObject.first}/${nameObject.last}`)
        .then((response) => {
            callback(response.data)
        })
        .catch((error) => {
            if (error) console.error(error)
            callback(null, error)
        })
}