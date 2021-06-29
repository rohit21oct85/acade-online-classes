const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
      user_id: {
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
      extension: {
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
      
      question_type:{
        type: String
      },
      question_varity:{
        type: String
      },
      difficulty:{
        type: String
      },
      expected_time_to_solve:{
        type: String
      },
      topic_chapter_name:{
        type: String
      },
      concept:{
        type: String
      },
      sub_concept:{
        type: String
      },
      concept_field:{
        type: String
      },

      question:{
        type: String
      },

      options:{
        type: Array
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
      option_e: {
            type: String
      },
      answer:{
             type: String
      },
      explain:{
            type: String
      },
      hint_1: {
            type: String
      },
      hint_2: {
            type: String
      },
      hint_3: {
            type: String
      },
      hint_4: {
            type: String
      },
      hint_5: {
            type: String
      },
      exam_name:{
            type: String
      },
      unit_section_name:{
            type: String
      },
      d_subject_name:{
            type: String
      },
      governing_board:{
            type: String
      },
      exam_year:{
            type: String
      },
      question_number:{
            type: String
      },
      shift:{
            type: String
      },
      grade:{
            type: String
      },
      question_category:{
            type: String
      },
      blooms_taxonomy:{
            type: String
      },
      dok_level:{
            type: String
      },
      concept_field:{
            type: String
      },
      keywords_tags:{
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