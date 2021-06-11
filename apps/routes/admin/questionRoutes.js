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
    .patch('/update/:id', checkAuth, Question.UpdateQuestion)
    .get('/view/:id', checkAuth, Question.ViewQuestion)
    .get('/view-all/:class_id?/:subject_id?/:unit_id?/:chapter_id?', checkAuth, Question.ViewAllQuestion)
    .delete('/delete/:id', checkAuth, Question.DeleteQuestion)
    .post('/upload', upload.single('file'), checkAuth, Question.uploadQuestion)
;

module.exports = router;