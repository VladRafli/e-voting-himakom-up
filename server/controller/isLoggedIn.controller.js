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

    res.header('Cache-Control', ['no-store', 'no-cache', 'must-revalidate'])
    res.header('Pragma', 'no-cache')
    res.header('Expires', '0')
    res.header('ETag', 'false')
    if (checkSession === null) {
        res.status(200).json(false)
    } else {
        res.status(200).cookie('session_id', checkSession.id, { httpOnly: true }).json(true)
    }

}