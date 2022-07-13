const express = require('express')

/**
 * Candidate Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    try {
        res
            .status(200)
            .json({ msg: 'Success', data: await prisma.candidate.findMany() })
    } catch (err) {
        res.status(500).json({msg: err})
    }
}