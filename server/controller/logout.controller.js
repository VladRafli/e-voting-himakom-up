const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Logout Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {

    try {
        const session = await prisma.session.findFirst({
            where: {
                id: req.cookies.session_id
            }
        })

        if (session === null) {
            res
                .status(400)
                .json({
                    msg: 'Session tidak valid!'
                })
        }

        await prisma.session.delete({
            where: {
                id: req.cookies.session_id
            }
        })

        res
            .status(200)
            .clearCookie('session_id')
            .json({
                msg: 'Sucessfully logged out!'
            })
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}