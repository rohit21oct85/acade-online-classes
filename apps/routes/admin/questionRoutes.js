const express =  require("express");
const Question = require('../../http/controllers/admin/questionController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(req,file)
        cb(null, 'apps/uploads/')
    },
    fileFilter: function(req, file, cb) {
        console.log(file.mimetype, "dadasd")
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now() + '.csv')
    },
})

var upload = multer({ storage: storage })

router
    .post('/create', checkAuth, Question.CreateQuestion)
    .post('/update/:id', checkAuth, Question.UpdateQuestion)
    .post('/update-subject', checkAuth, Question.UpdateSubjectQuestion)
    .post('/update-all-subject', checkAuth, Question.UpdateAllSubjectQuestion)
    .get('/view/:id', checkAuth, Question.ViewQuestion)
    .get('/view-all/:class_id?/:subject_id?/:unit_id?/:chapter_id?', checkAuth, Question.ViewAllQuestion)
    .get('/all-questions/:class_id?/:subject_id?', checkAuth, Question.AllQuestions)
    .get('/all-chapter-questions/:chapter_id?', checkAuth, Question.AllChapterQuestions)
    .get('/subjects-questions/:subject_id?', checkAuth, Question.AllSubjectsQuestions)
    .get('/questions', checkAuth, Question.AllQuestionsByUnits)
    .post('/delete', checkAuth, Question.DeleteQuestion)
    .post('/upload', upload.single('file'), checkAuth, Question.uploadQuestion)
;

module.exports = router;