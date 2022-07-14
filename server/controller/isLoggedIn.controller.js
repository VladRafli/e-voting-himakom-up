const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Is Logged In Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    try {
        const sessionId = req.cookies.session_id

        if (sessionId === undefined) {
            res.status(200).json(false)
            return
        }

        const checkSession = await prisma.session.findFirst({
            where: {
                id: sessionId
            }
        })

        if (checkSession === null) {
            res.status(200).json(false)
        } else {
            res.status(200).cookie('session_id', checkSession.id, { httpOnly: true }).json(true)
        }
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}