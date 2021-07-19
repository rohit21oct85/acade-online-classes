const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PrincipalSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    name: {
        type: String,
    },
    EmpId: {
        type: String
    },
    isLoggedIn : {
        type: Boolean,
        default: false,
    },
    isActive: {
        type:Boolean,
        default: true,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: String
    },
    school_id: {
        type: String
    },
    status: {
        type: String,
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});


PrincipalSchema.pre('save', function(next) {
    const principal = this;
    if (!principal.isModified || !principal.isNew) {
        next();
    } else {
        bcrypt.hash(principal.password, 10, function(err, hash) {
            if (err) {
                console.log('Error hashing password for principal', principal.name);
                next(err);
            } else {
                principal.password = hash;
                next();
            }
        })
    }
});

module.exports = mongoose.model('Principal', PrincipalSchema);