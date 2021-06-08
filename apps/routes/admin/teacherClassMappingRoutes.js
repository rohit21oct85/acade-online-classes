const express =  require("express");
const teacherClassMapping = require('../../http/controllers/admin/teacherClassMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, teacherClassMapping.CreateTeacherClassMapping)
    // .patch('/update/:id',checkAuth,adminAuth, teacherClassMapping.UpdateTeacherClassMapping)
    // .get('/view/:module_slug/:role_slug',checkAuth,adminAuth, teacherClassMapping.ViewTeacherClassMapping)
    // .get('/module/:role_slug?',checkAuth, teacherClassMapping.OtherModules)
    .get('/view-all/:school_id?/:teacher_id?',checkAuth,adminAuth, teacherClassMapping.ViewAllTeacherClassMapping)
    .post('/delete',checkAuth,adminAuth, teacherClassMapping.DeleteTeacherClassMapping);
    
module.exports = router;