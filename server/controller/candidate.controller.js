const express = require('express')

/**
 * Candidate Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    res
        .status(200)
        .json({ msg: 'Success', data: await prisma.candidate.findMany() })
}