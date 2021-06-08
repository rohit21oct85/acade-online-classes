const express =  require("express");
const classSubjectMapping = require('../../http/controllers/admin/classSubjectMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, classSubjectMapping.CreateClassSubjectMapping)
    // .patch('/update/:id',checkAuth,adminAuth, classSubjectMapping.UpdateclassSubjectMapping)
    // .get('/view/:module_slug/:role_slug',checkAuth,adminAuth, classSubjectMapping.ViewclassSubjectMapping)
    // .get('/module/:role_slug?',checkAuth, classSubjectMapping.OtherModules)
    .get('/view-all/:class_id?',checkAuth,adminAuth, classSubjectMapping.ViewAllClassSubjectMapping)
    .post('/delete',checkAuth,adminAuth, classSubjectMapping.DeleteClassSubjectMapping);
    
module.exports = router;