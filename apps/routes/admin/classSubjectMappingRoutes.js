const express =  require("express");
const classSubjectMapping = require('../../http/controllers/admin/classSubjectMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, classSubjectMapping.CreateClassSubjectMapping)
    .get('/view-all/:class_id?',checkAuth,adminAuth, classSubjectMapping.ViewAllClassSubjectMapping)
    .post('/delete',checkAuth,adminAuth, classSubjectMapping.DeleteClassSubjectMapping);
    
module.exports = router;