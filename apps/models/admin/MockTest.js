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
      test_type: {
            type: String,
      },
      test_for: {
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