const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
      user_id: {
            type: String
      },
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
      
      unit_id: {
            type: String
      },
      unit_no:{
            type: String
      },
      unit_name:{
            type: String
      },
      chapter_no:{
            type: String
      },
      chapter_name:{
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

module.exports = mongoose.model('Chapter', ChapterSchema);