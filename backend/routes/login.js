const express = require('express');

const router = express.Router();

const userModel = require('../models/userModel');

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(500).json({ message: "User not found!" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
