const express =  require("express");
const Class = require('../../http/controllers/admin/classController.js');
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
    .post('/create', checkAuth, Class.CreateClass)
    .patch('/update/:id', checkAuth, Class.UpdateClass)
    .get('/view/:id', checkAuth, Class.ViewClass)
    .get('/view-all', checkAuth, Class.ViewAllClass)
    .delete('/delete/:id', checkAuth, Class.DeleteClass)
    .post('/upload', upload.single('file'), checkAuth, Class.uploadClass)

    .get('/class-by-school-id/:id', checkAuth, Class.getClassBySchoolId)
;

module.exports = router;