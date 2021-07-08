const express =  require("express");
const Principal = require('../../http/controllers/admin/principalController.js');
const checkAuth =  require("../../http/middleware/check-auth");

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
    .post('/login', Principal.Login)
    .post('/create',checkAuth, Principal.CreatePrincipal)
    .patch('/update/:id',checkAuth, Principal.UpdatePrincipal)
    .get('/view/:id',checkAuth, Principal.ViewPrincipal)
    .get('/view-all/:school_id?',checkAuth, Principal.ViewAllPrincipal)
    .post('/delete', checkAuth, Principal.DeletePrincipal)
    .post('/upload', upload.single('file'), checkAuth, Principal.uploadPrincipal);

module.exports = router;