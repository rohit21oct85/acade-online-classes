const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
        login_time:{
            type: Date,
        },
        user_type:{
            type:String,
        },
        user_id:{
            type:String,
        },
        email_id:{
            type:String,
        },
        school_id:{
            type:String,
        },
        status:{
                type: Boolean,
                default: true
        },
        created_at: {
                type: Date,
                default: Date.now
        }
});

module.exports = mongoose.model('UserLog', UserLogSchema);