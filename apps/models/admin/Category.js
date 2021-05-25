const mongoose = require('mongoose');
const SubCategorySchema = new mongoose.Schema({
    name: String, 
    slug: String, 
    about: String, 
    icon: String, 
    status: {
        type: Boolean, 
        default: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
    },
    category_slug:{
        type: String
    },
    category_image:{
        type: String
    },
    category_details:{
        type: String
    },
    segment_uploaded:{
        type: Boolean,
        default: false
    },
    segments:{
        type: [SubCategorySchema]
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

module.exports = mongoose.model('Category', CategorySchema);