const express =  require("express");
const Subject = require('../../http/controllers/admin/subjectController.js');
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
    .post('/create', checkAuth, Subject.CreateSubject)
    .patch('/update/:id', checkAuth, Subject.UpdateSubject)
    .get('/view/:id', checkAuth, Subject.ViewSubject)
    .get('/view-all', checkAuth, Subject.ViewAllSubject)
    .delete('/delete/:id', checkAuth, Subject.DeleteSubject)
    .post('/upload', upload.single('file'), checkAuth, Subject.uploadSubject)

    .get('/subject-by-school-id/:id', checkAuth, Subject.getSubjectBySchoolId)
    .get('/view-all-class/:subject_id?', checkAuth, Subject.getClassBySubjectId)
;

module.exports = router;