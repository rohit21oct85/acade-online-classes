const mongoose = require('mongoose');

const MockTestQuestionSchema = new mongoose.Schema({
      question_for:{
            type: String
      },
      question:{
            type: String
      },
      option_a:{
            type: String
      },
      option_b:{
            type: String
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