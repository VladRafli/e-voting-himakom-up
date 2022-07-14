const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Read Vote Controller
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
module.exports = async (req, res) => {
    try {
        const count = await prisma.vote.count({
            select: {
                user_id: true,
            },
            where: req.user.id
        })

        res
            .status(200)
            .json(count.user_id > 0 ? true : false)
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}