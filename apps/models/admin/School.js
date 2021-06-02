const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    school_name: {
        type: String,
    },
    school_slug:{
        type: String
    },
    sub_domain:{
        type: String
    },
    school_logo:{
        type: String
    },
    address:{
        type: String
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    pincode:{
        type: String
    },
    contact_name:{
        type: String,
    },
    contact_email:{
        type: String,
    },
    contact_mobile:{
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