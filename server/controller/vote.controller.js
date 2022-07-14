const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    /**
     * Read Vote Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    read: async (req, res) => {
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
            res.status(500).json({ msg: err })
        }
    },
    /**
     * Create Vote Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        try {
            console.log(req.user)

            const candidate_id = parseInt(req.query.id)

            const candidate = await prisma.candidate.findUnique({
                where: {
                    id: candidate_id
                }
            })
            // * Check if candidate available
            if (candidate === null) {
                res.status(400).json({
                    msg: 'Calon tidak ditemukan!'
                })
                return
            }
            // * Get user vote
            const userVote = await prisma.vote.findFirst({
                where: {
                    user_id: req.user.User.id
                }
            })

            // * Check if user already voted
            if (userVote !== null) {
                res.status(400).json({
                    msg: 'User sudah melakukan voting'
                })
                return
            }
            // * Insert user vote
            await prisma.vote.create({
                data: {
                    candidate_id: candidate_id,
                    user_id: req.user.User.id
                }
            })

            res.status(200).json({
                msg: `Berhasil vote untuk ${candidate.name}`
            })
        } catch (err) {
            res.status(500).json({ msg: err.stack })
        }
    }
} 