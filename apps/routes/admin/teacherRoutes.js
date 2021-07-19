const express =  require("express");
const Teacher = require('../../http/controllers/admin/teacherController.js');
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
    .post('/login', Teacher.Login)
    .post('/create', checkAuth, Teacher.CreateTeacher)
    .post('/logout', checkAuth, Teacher.Logout)
    .patch('/update/:id', checkAuth, Teacher.UpdateTeacher)
    .get('/view/:id', checkAuth, Teacher.ViewTeacher)
    .get('/view-all/:school_id?/:subject_id?', checkAuth, Teacher.ViewAllTeacher)
    .get('/view-class/:school_id?/:teacher_id?', checkAuth, Teacher.ViewTeacherClass)
    .delete('/delete/:id', checkAuth, Teacher.DeleteTeacher)
    .post('/upload', upload.single('file'), checkAuth, Teacher.uploadTeacher)
    .get('/teacher-by-school-id/:id', checkAuth, Teacher.getTeacherBySchoolId)
;

module.exports = router;