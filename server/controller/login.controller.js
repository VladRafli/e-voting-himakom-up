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
        // ! Buggy on MySQL or MariaDB
        // const user = await prisma.user.findMany({
        //     where: {
        //         username: username
        //     }
        // })

        /**
         * @type {[{id: Number, username: String, password: String}]}
         */
        const user = await prisma.$queryRaw`SELECT id, username, password FROM User WHERE BINARY username = ${username}`

        // * Check if user not found
        if (user.length === 0) {
            res.status(400).json({
                msg: 'Username atau password salah!'
            })
            return
        }

        // * Check if password is wrong
        if (!bcrypt.compareSync(password, user[0].password)) {
            res.status(400).json({
                msg: 'Username atau password salah!'
            })
            return
        }

        // * Create or Update Session
        await prisma.session.upsert({
            create: {
                id: sessionId,
                user_id: user[0].id
            },
            update: {
                id: sessionId
            },
            where: {
                user_id: user[0].id
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