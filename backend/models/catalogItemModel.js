const mongoose = require('mongoose');

const catalogItemSchema = new mongoose.Schema({
    catalogItemId: {
        required: true,
        type: String
    },
    catalogItemName: {
        required: true,
        type: String
    },
    serviceId: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('catalogItem', catalogItemSchema)
