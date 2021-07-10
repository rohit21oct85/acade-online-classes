const mongoose = require('mongoose');

const MockTestSchema = new mongoose.Schema({
      test_name: {
            type: String,
      },
      test_slug: {
            type: String,
      },
      test_duration: {
            type: String,
      },
      total_question: {
            type: Number,
      },
      test_question: {
            type: Array,
      },
      test_type: {
            type: String,
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


module.exports = mongoose.model('MockTest', MockTestSchema);