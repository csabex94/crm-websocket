const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'supsended', 'blocked']
    }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;