const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
      role_id:{
            type: String,
            required: true,
      },
      role_slug: {
            type: String,
            required: true,
      },
      role: {
            type: Number,
      },
      email: {
            type: String,
      },
      module_id: {
            type: String,
      },
      module_name: {
            type: String,
      },
      module_slug: {
            type: String,
      },
      module_icon: {
            type: String,
      },
      method_name: {
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