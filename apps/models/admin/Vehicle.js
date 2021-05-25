const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vehicle_name: {
        type: String,
        required: true,
    },
    vehicle_icon:{
        type: String
    },
    vehicle_slug:{
        type: String
    },
    status:{
        type: Boolean,
        default: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);