const express =  require("express");
const teacherClassMapping = require('../../http/controllers/admin/teacherClassMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, teacherClassMapping.CreateTeacherClassMapping)
     .get('/view/:school_id?/:teacher_id?',checkAuth,adminAuth, teacherClassMapping.ViewTeacherClassMapping)
    .get('/view-all/:school_id?/:teacher_id?',checkAuth,adminAuth, teacherClassMapping.ViewAllTeacherClassMapping)
    .post('/delete',checkAuth,adminAuth, teacherClassMapping.DeleteTeacherClassMapping)
    .post('/delete-all',checkAuth,adminAuth, teacherClassMapping.DeleteAllTeacherClassMapping);
    
module.exports = router;