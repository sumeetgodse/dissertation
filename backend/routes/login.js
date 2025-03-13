require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userModel = require('../models/userModel');

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        const jwtPayload = {
            email: user.email,
            type: user.type,
        };
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });
        res.status(200).json(user.email);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
