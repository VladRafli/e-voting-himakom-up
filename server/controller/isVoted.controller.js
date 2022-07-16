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
        // ! Buggy
        const count = await prisma.vote.count({
            select: {
                user_id: true,
            },
            where: req.user.User.id
        }) 
        //const count = await prisma.$queryRaw`SELECT COUNT(user_id) AS user_id_count FROM vote WHERE BINARY user_id = ${req.user.User.id}`
        res
            .status(200)
            .json(count[0].user_id_count > 0 ? true : false)
    } catch (err) {
        res.status(500).json({ msg: err.stack })
    }
}