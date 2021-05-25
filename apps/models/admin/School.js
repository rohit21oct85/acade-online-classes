const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug:{
        type: String
    },
    logo:{
        type: String
    },
    address:{
        type: String
    },
    zip_code:{
        type: String
    },
    admin_email:{
        type: String,
    },
    admin_mobile:{
        type: String,
    },
    status:{
        type: Boolean,
        default: false
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('School', SchoolSchema);