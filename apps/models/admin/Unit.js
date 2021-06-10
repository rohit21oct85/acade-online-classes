const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
      class_id: {
            type: String
      },
      class_name:{
            type: String
      },
      subject_id: {
            type: String
      },
      subject_name:{
            type: String
      },
      unit_no:{
            type: String
      },
      unit_name:{
            type: String
      },
      marks:{
            type: String
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

module.exports = mongoose.model('Unit', UnitSchema);