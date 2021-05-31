const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug:{
        type: String
    },
    domain:{
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
    admin_name:{
        type: String,
    },
    admin_email:{
        type: String,
    },
    admin_password:{
        type: String
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

SchoolSchema.pre('save', function(next) {
    const school = this;
    if(!school.isModified || !school.isNew){
        next();
    }else{
        bcrypt.hash(school.admin_password, 10, function(err, hash){
            if(err) {
                console.log('Error hashing password for school', school.name);
                next(err);
            }
            else{
                school.admin_password = hash;
                next();
            }
        })
    }
});

SchoolSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (this._update.admin_password) {
            const hashed = await bcrypt.hash(this._update.admin_password, 10)
            this._update.admin_password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }

});
module.exports = mongoose.model('School', SchoolSchema);