const express =  require("express");
const Student = require('../../http/controllers/admin/studentController.js');
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
    .post('/login', Student.Login)
    .post('/create', checkAuth, Student.CreateStudent)
    .post('/logout',checkAuth, Student.Logout)
    .patch('/update/:id', checkAuth, Student.UpdateStudent)
    .get('/view/:id', checkAuth, Student.ViewStudent)
    .get('/view-all/:school_id?/:class_id?/:section?', checkAuth, Student.ViewAllStudent)
    .get('/all-students/:school_id?/:class_id?', checkAuth, Student.AllStudentCount)
    .get('/roll-no/:school_id?/:class_id?/:section?', checkAuth, Student.getRollNo)
    .delete('/delete/:id', checkAuth, Student.DeleteStudent)
    .post('/upload', upload.single('file'), checkAuth, Student.uploadStudent)
    .get('/student-by-school-id/:sid', checkAuth, Student.getStudentBySchoolIdAndClassId)
    .post('/update-all', Student.updateAllStudent)
;

module.exports = router;