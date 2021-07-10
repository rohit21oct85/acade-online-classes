const mongoose = require('mongoose');

const MockTestQuestionSchema = new mongoose.Schema({
      question_for:{
            type: String
      },
      question:{
            type: String
      },
      options:{
            type: Array
      },
      answer:{
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


module.exports = mongoose.model('MockTestQuestion', MockTestQuestionSchema);