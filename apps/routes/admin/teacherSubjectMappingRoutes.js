const express =  require("express");
const teachSubMapping = require('../../http/controllers/admin/teacherSubjectMappingController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, teachSubMapping.CreateTeacherSubjectMapping)
    // .patch('/update/:id',checkAuth,adminAuth, teachSubMapping.UpdateTeacherSubjectMapping)
    // .get('/view/:module_slug/:role_slug',checkAuth,adminAuth, teachSubMapping.ViewTeacherSubjectMapping)
    // .get('/module/:role_slug?',checkAuth, teachSubMapping.OtherModules)
    .get('/view-all/:school_id?/:teacher_id?',checkAuth,adminAuth, teachSubMapping.ViewAllTeacherSubjectMapping)
    .post('/delete',checkAuth,adminAuth, teachSubMapping.DeleteTeacherSubjectMapping);
    
module.exports = router;