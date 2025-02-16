const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceId: {
        required: true,
        type: String
    },
    serviceName: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('service', serviceSchema)
