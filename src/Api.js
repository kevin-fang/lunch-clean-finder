import axios from 'axios'

var config = require('./config.json')

/**
 * 
 * @param {function} callback The callback to call after reaching the API
 */
export const getToday = (callback) => {
    axios.get(config.serverip + '/today')
    .then(callback)
    .catch((error) => {
        if (error) console.error(error)
        callback(null, error)
    })
}

