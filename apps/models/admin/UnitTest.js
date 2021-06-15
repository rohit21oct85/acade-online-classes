const mongoose = require('mongoose');
const TestQuestionSchema = new mongoose.Schema({
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
      }
})
const UnitTestSchema = new mongoose.Schema({
      test_name: {
            type: String,
      },
      test_slug: {
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
      subject_name: {
            type: String,
      },
      test_date: {
            type: String,
      },
      test_duration: {
            type: String,
      },
      test_question: {
            type: Array,
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


module.exports = mongoose.model('UnitTest', UnitTestSchema);