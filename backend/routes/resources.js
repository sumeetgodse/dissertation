const express = require('express');

const router = express.Router();

const resourceModel = require('../models/resourceModel');

router.get('/', async (req, res) => {
    try {
        const resources = await resourceModel.find({ owner: req.user.email })
        res.status(200).json(resources)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/all', async (req, res) => {
    try {
        const resources = await resourceModel.find()
        res.status(200).json(resources)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/', async (req, res) => {
    try {
        const newResource = new resourceModel({
            ...req.body,
            owner: req.user.email,
            status: 'PREPARING'
        });
        await newResource.save();
        res.status(201).json(newResource);

        setTimeout(async () => {
            try {
                newResource.status = 'ACTIVE';
                await newResource.save();
            } catch (error) {
                console.error('Error updating resource status:', error);
            }
        }, 30000);
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router;
