const mongoose = require('mongoose');

const AssignTestSchema = new mongoose.Schema({
      school_id: {
            type: String,
      },
      school_name: {
            type: String,
      },
      test_id: {
            type: String,
      },
      test_name: {
            type: String,
      },
      test_window: {
            type: Number,
      },
      test_duration: {
            type: Number,
      },
      total_question: {
            type: Number,
      },
      teacher_id: {
            type: String,
      },
      teacher_name: {
            type: String,
      },
      class_id: {
            type: String,
      },
      class_name: {
            type: String,
      },
      subject_id: {
            type: String,
      },
      chapter_id: {
            type: String,
      },
      unit_id: {
            type: String,
      },
      answers: {
            type: Array,
      },
      extension: {
            type: String,
        },
      subject_name: {
            type: String,
      },
      start_date:{
            type: Date,
      },
      test_window:{
            type: Number,
      },
      test_duration:{
            type: Number,
      },
      total_question:{
            type: Number,
      },
      test_subjects: {
            type: Array,
      },
      questionDocs: {
            type: Array,
      },
      test_type: {
            type: String,
      },
      teacher_id:{
            type: String,
      },
      status:{
            type: Boolean,
            default: false
      },
      assigned:{
            type: Boolean,
            default: false
      },
      attemptedStudentIds:{
            type: Array
      },
      attemptedStudents:{
            type: Number
      },
      create_at: {
        type: Date,
        default: Date.now
      }
});


module.exports = mongoose.model('AssignTest', AssignTestSchema);