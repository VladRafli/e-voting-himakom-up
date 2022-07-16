const express = require('express')
const bcrypt = require('bcrypt')
const ms = require('ms')
const { nanoid } = require('nanoid')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Login Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    try {
        const { username, password } = req.body
        const sessionId = nanoid()

        // * Find user by username
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        // * Check if user not found
        if (user === null) {
            res.status(400).json({
                msg: 'Username atau password salah!'
            })
            return
        }

        console.log(username, password)
        console.log(user)

        if (user.username !== username) {
            res.status(400).json({
                msg: 'Username atau password salah!'
            })
            return
        }

        // * Check if password is wrong
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(400).json({
                msg: 'Username atau password salah!'
            })
            return
        }

        // * Create or Update Session
        await prisma.session.upsert({
            create: {
                id: sessionId,
                user_id: user.id
            },
            update: {
                id: sessionId
            },
            where: {
                user_id: user.id
            }
        })

        res
            .status(200)
            .cookie('session_id', sessionId, { httpOnly: true })
            .json({
                msg: 'Successfully logged in!'
            })
    } catch (err) {
        res.status(500).json(err.stack)
    }

}