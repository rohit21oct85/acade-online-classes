const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SchoolAdminSchema = new mongoose.Schema({
  school_id: {
    type: String,
    require: true,
  },
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
  plain_password: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role:{
    type: Number,
    default: 1
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

SchoolAdminSchema.pre('save', function(next) {
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

SchoolAdminSchema.pre('findOneAndUpdate', async function(next) {
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

module.exports = mongoose.model('SchoolAdmin', SchoolAdminSchema);