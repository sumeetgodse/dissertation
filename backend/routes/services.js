const express = require('express');

const router = express.Router();

const serviceModel = require('../models/serviceModel');

router.get('/', async (req, res) => {
    try {
        const services = await serviceModel.find()
        res.status(200).json({ data: services })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router;
