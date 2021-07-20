const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
        login_time:{
            type: Date,
        },
        logout_time:{
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
        device_type:{
            type:String,
        },
        sessionInProgress:{
            type:Boolean,
        },
        total_session:{
            type:String,
        },
        otherInfo: {
            type: Array
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