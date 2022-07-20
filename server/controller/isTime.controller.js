const express = require('express')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

/**
 * Check Vote Time Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    try {
        res
            .status(200)
            .json({
                isVoteTime: dayjs('2022-07-24').diff(dayjs(), 'day', true) > 0 && dayjs('2022-07-24').diff(dayjs(), 'day', true) <= 1,
                serverTime: dayjs()
            })
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}