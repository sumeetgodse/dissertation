const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    resourceId: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return this._id.toString();
        }
    },
    resourceName: {
        required: true,
        type: String
    },
    skuName: {
        required: true,
        type: String
    },
    installSoftwares: {
        required: true,
        type: Boolean
    },
    cloudProvider: {
        required: true,
        type: String
    },
    region: {
        required: true,
        type: String
    },
    endDate: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('resource', resourceSchema)
