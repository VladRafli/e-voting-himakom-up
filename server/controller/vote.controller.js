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
            const vote = await prisma.vote.findFirst({
                where: {
                    id: req.user.id
                },
                include: {
                    Candidate: true
                }
            })

            res
                .status(200)
                .json({
                    msg: 'Success',
                    data: vote
                })
        } catch (err) {
            res.status(500).json({ msg: err.stack })
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