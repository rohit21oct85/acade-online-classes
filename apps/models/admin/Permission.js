const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
      school_id: {
            type: String,
            required: true
      },
      school_slug: {
            type: String,
            required: true
      },
      role_id:{
            type: String,
            required: true,
      },
      role_slug: {
            type: String,
            required: true,
      },
      module_id:{
            type: String,
            required: true,
      },
      module_slug: {
            type: String,
            required: true
      },
      module_icon: {
            type: String,
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

module.exports = mongoose.model('Permission', PermissionSchema);