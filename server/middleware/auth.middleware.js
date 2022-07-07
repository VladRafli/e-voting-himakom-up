const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Authenticated User Middleware
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
module.exports = async (req, res, next) => {
    if (req.cookies.session_id === null) {
        res.status(403).json({
            msg: 'Session missing!'
        })
        return
    }

    const user = await prisma.session.findFirst({
        select: {
            User: {
                select: {
                    id: true,
                    username: true
                }
            }
        },
        where: {
            id: req.cookies.session_id
        }
    })

    if (user === null) {
        res.status(403).json({
            msg: 'Session invalid!'
        })
        return
    }

    req.user = user
    
    next()
}