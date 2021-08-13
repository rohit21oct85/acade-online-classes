const express =  require("express");
const Chapter = require('../../http/controllers/admin/chapterController.js');
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
    .post('/create', checkAuth, Chapter.Create)
    .post('/upload', upload.single('file'), checkAuth, Chapter.UploadChap)
    .post('/upload-chap', upload.single('file'), checkAuth, Chapter.UploadChap)
    .patch('/update/:id', checkAuth, Chapter.Update)
    .get('/view/:id', checkAuth, Chapter.View)
    .get('/view-all/:class_id?/:subject_id?/:unit_id?', checkAuth, Chapter.ViewAll)
    .delete('/delete/:id', checkAuth, Chapter.Delete)
    .post('/update-subject', checkAuth, Chapter.UpdateChapterSubject)
    .post('/update-class', checkAuth, Chapter.UpdateChapterClass)
;

module.exports = router;