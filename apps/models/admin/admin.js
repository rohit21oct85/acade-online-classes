const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: String,
        required: true,
        default: 2
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

AdminSchema.pre('save', function(next) {
    const admin = this;
    if(!admin.isModified || !admin.isNew){
        next();
    }else{
        bcrypt.hash(admin.password, 10, function(err, hash){
            if(err) {
                console.log('Error hashing password for admin', admin.fullname);
                next(err);
            }
            else{
                admin.password = hash;
                next();
            }
        })
    }
});

AdminSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (this._update.password) {
            const hashed = await bcrypt.hash(this._update.password, 10)
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }

});

module.exports = mongoose.model('Admin', AdminSchema);