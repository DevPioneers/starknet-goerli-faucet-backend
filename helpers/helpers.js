const config = require('config')

const Helper = {
    nowSec: () => {
        return Math.floor(Date.now() / 1000)
    },
    getConfigInfo: () => {
        return config[config.network]
    },
    sleep: async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    },
}

module.exports = Helper