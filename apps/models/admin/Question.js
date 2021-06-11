const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
      class_id: {
            type: String,
      },
      class_name: {
            type: String,
      },
      subject_id: {
            type: String,
      },
      subject_slug: {
            type: String,
      },
      
      unit_id: {
            type: String,
      },
      unit_no: {
            type: String,
      },
      unit_name: {
            type: String,
      },
      
      chapter_id: {
            type: String,
      },
      chapter_no: {
            type: String,
      },
      chapter_name: {
            type: String,
      },
      
      question:{
        type: String
      },
      option_a: {
            type: String
      },
      option_b: {
            type: String
      },
      option_c: {
            type: String
      },
      option_d: {
            type: String
      },
      answer:{
        type: String
      },
      qtype:{
        type: String
      },
      atype:{
        type: String
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


module.exports = mongoose.model('Question', QuestionSchema);