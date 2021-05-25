const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    module_name: {
        type: String,
        required: true,
    },
    module_icon:{
        type: String
    },
    module_slug:{
        type: String
    },
    status:{
        type: Boolean,
        default: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Module', ModuleSchema);