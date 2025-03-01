const express = require('express');

const router = express.Router();

const serviceModel = require('../models/serviceModel');
const catalogItemModel = require('../models/catalogItemModel');

router.get('/', async (req, res) => {
    try {
        const services = await serviceModel.find()
        res.status(200).json({ data: services })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:serviceId/catalogItems', async (req, res) => {
    try {
        const catalogItems = await catalogItemModel.find({ serviceId: req.params.serviceId })
        res.status(200).json({ data: catalogItems })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:serviceId/catalogItems/:catalogItemId', async (req, res) => {
    try {
        const catalogItem = await catalogItemModel.findOne({ serviceId: req.params.serviceId, catalogItemId: req.params.catalogItemId })
        res.status(200).json(catalogItem)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router;
