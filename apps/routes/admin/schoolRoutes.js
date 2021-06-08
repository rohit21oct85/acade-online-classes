const express =  require("express");
const School = require('../../http/controllers/admin/schoolController.js');
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
    .post('/create',checkAuth,adminAuth, School.CreateSchool)
    .patch('/update/:id',checkAuth,adminAuth, School.UpdateSchool)
    .get('/view/:id',checkAuth,adminAuth, School.ViewSchool)
    .get('/view-all',checkAuth, School.ViewAllSchool)
    .post('/addfields', checkAuth,adminAuth, School.addFields)
    .post('/subdomain', checkAuth,adminAuth, School.checkSubDomain)
    .post('/delete', checkAuth,adminAuth, School.DeleteSchool)
    .post('/delete', checkAuth,adminAuth, School.DeleteSchool)
    .post('/upload', upload.single('file'), checkAuth,adminAuth, School.uploadSchool);
    
module.exports = router;