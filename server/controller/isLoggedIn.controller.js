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
            res.status(200).json({
                isLoggedIn: false
            })
            return
        }

        const checkSession = await prisma.session.findFirst({
            where: {
                id: sessionId
            },
            include: {
                User: true
            }
        })

        if (checkSession === null) {
            res.status(200).json({
                isLoggedIn: false
            })
        } else {
            res.status(200).cookie('session_id', checkSession.id, { httpOnly: true }).json({
                isLoggedIn: true,
                username: checkSession.User.username
            })
        }
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}