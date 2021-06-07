const mongoose = require('mongoose');

const RoleModuleSchema = new mongoose.Schema({
      role_id:{
            type: String,
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
      module_id:{
            type: String,
      },
      module_name:{
            type: String
      },
      module_slug: {
            type: String,
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

module.exports = mongoose.model('RoleModule', RoleModuleSchema);