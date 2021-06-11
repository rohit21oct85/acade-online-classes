const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    slug:{
        type: String
    },
    status:{
        type: String,
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('School', SchoolSchema);