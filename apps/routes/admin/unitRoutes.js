const express =  require("express");
const Unit = require('../../http/controllers/admin/unitController.js');
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
    .post('/create', checkAuth, Unit.CreateUnit)
    .post('/upload', upload.single('file'), checkAuth, Unit.UploadUnit)
    .post('/update', checkAuth, Unit.UpdateUnit)
    .get('/view/:id', checkAuth, Unit.ViewUnit)
    .get('/view-all/:class_id?/:subject_id?', checkAuth, Unit.ViewAllUnit)
    .post('/delete', checkAuth, Unit.DeleteUnit)
    .post('/update-subject', checkAuth, Unit.UpdateUnitSubject)
    .post('/update-class', checkAuth, Unit.UpdateUnitClass)
;

module.exports = router;