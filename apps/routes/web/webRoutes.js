const express =  require("express");
const Web = require('../../http/controllers/web/webController.js');
const checkAuth =  require("../../http/middleware/check-auth");
// const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    //student
    .get('/get-subjects/:class_id?', checkAuth, Web.getSubjects)
    .get('/get-test-units/:subject_id?', checkAuth, Web.getTestUnits)
    .get('/get-test-questions/:test_id?', checkAuth, Web.getTestQuestions)
    .get('/get-a-test-question/:test_id?', checkAuth, Web.getASingleQuestions)
    .get('/view-student/:id', checkAuth, Web.getStudent)
    .patch('/update-student/:id', checkAuth, Web.updateStudent)


    //teacher 
    .get('/get-all-classes', checkAuth, Web.getAllClasses)
    .get('/get-teacher-subject/:teacher_id?/:school_id?', checkAuth, Web.getTeacherSubject)
    .get('/get-all-unit-tests/:school_id?/:class_id?/:subject_id?', checkAuth, Web.getAllUnitTests)
    .get('/view-teacher/:id', checkAuth, Web.getTeacher)
    .patch('/update-teacher/:id', checkAuth, Web.updateTeacher)


    .get('/view-principal/:id', checkAuth, Web.getPrincipal)
    .patch('/update-principal/:id', checkAuth, Web.updatePrincipal)
    ;

module.exports = router;