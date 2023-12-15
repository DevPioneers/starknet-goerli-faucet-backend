const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const db = require('../models');
const Helper = require('../helpers/helpers');
const abiJson = require('../abis/ERC20.sierra.json')
const configInfo = Helper.getConfigInfo()

const { RpcProvider, Account, Contract } = require("starknet");

require('dotenv').config()

router.post('/faucet', [
    check('user').exists().withMessage('user missing'),
], async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { user } = req.body
    console.log('request faucet for ', user)

    try {

        const userDb = await db.User.findOne({ user }).lean().exec()
        let timeNow = Helper.nowSec()

        if (userDb) {
            let lastTimestampFaucet = userDb.lastTimestampFaucet
            if (timeNow - lastTimestampFaucet < 86400) {
                return res.status(200).json({
                    status: 'Faucet is only avaiable 1 time per day'
                })
            }
        }
        let rpc = process.env.provider
        const provider = new RpcProvider({ nodeUrl: rpc });
        console.log("Provider connected.");
        const privateKey = process.env.privateKey;
        const accountAddress = configInfo.seedWallet
        const amount = configInfo.faucetAmount
        const faucetToken = configInfo.faucetToken

        const account = new Account(provider, accountAddress, privateKey);
        const tokenContract = new Contract(abiJson.abi, faucetToken, provider)
        tokenContract.connect(account)
        await tokenContract.transfer(user, amount)

        const count = userDb ? userDb.count + 1 : 1
        await db.User.updateOne({ user }, {
            $set: {
                lastTimestampFaucet: timeNow,
                count: count
            }
        }, { upsert: true, new: true })
        return res.status(200).json({
            status: `done transfer faucet to ${user}`
        })

    } catch (e) {
        console.error(`error from api request faucet ${e}`)
        return res.status(400).json({
            status: `Fail to send transfer faucet to ${user}`
        })
    }

})


module.exports = router

