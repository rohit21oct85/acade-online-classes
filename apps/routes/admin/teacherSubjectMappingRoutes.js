const express =  require("express");
const teachSubMapping = require('../../http/controllers/admin/teacherSubjectMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, teachSubMapping.CreateTeacherSubjectMapping)
    .get('/view-all/:school_id?',checkAuth,adminAuth, teachSubMapping.ViewAllTeacherSubjectMapping)
    .post('/delete',checkAuth,adminAuth, teachSubMapping.DeleteTeacherSubjectMapping);
    
module.exports = router;