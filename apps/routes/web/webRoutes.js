const express =  require("express");
const Web = require('../../http/controllers/web/webController.js');
const checkAuth =  require("../../http/middleware/check-auth");
// const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    //student
    .get('/get-subjects/:class_id?', checkAuth, Web.getSubjects)
    .post('/get-assigned-tests/:school_id?/:class_id?/:subject_id?', checkAuth, Web.getAssignedTests)
    .get('/get-test-questions/:test_id?', checkAuth, Web.getTestQuestions)
    .get('/get-a-test-question/:test_id?', checkAuth, Web.getASingleQuestions)
    .post('/attempt-test/:school_id?/:class_id?/:subject_id?/:user_id?', checkAuth, Web.attemptTestByStudent)
    .post('/get-question/:subject_id?/:test_id?', checkAuth, Web.getQuestions)
    .patch('/save-answer/:subject_id?/:test_id?', checkAuth, Web.saveAnswer)
    .get('/get-result/:attempt_id?', checkAuth, Web.getResult)
    .post('/get-all-questions/:subject_id?/:test_id?', checkAuth, Web.getAllQuestions)
    .post('/get-last-score/:subject_id?', checkAuth, Web.getLastScore)
    .post('/get-cumulative-score/:subject_id?', checkAuth, Web.getCumulativeScore)

    .get('/view-student/:id?', checkAuth, Web.getStudent)
    .patch('/update-student/:id?', checkAuth, Web.updateStudent)

    //teacher 
    .get('/get-all-classes', checkAuth, Web.getAllClasses)
    .get('/get-teacher-subject/:teacher_id?/:school_id?', checkAuth, Web.getTeacherSubject)
    .get('/get-all-assigned-tests-classbased/:school_id?/:class_id?/:subject_id?', checkAuth, Web.getAllAssignedTestsClassBased)
    .get('/get-all-assigned-tests/:school_id?/:subject_id?', checkAuth, Web.getAllAssignedTests)
    .get('/view-teacher/:id', checkAuth, Web.getTeacher)
    .patch('/update-teacher/:id', checkAuth, Web.updateTeacher)
    .put('/update-assigned-test/:id?',checkAuth, Web.assignTestToStudent)
    .get('/get-student-wise-report/:school_id?/:class_id?/:subject_id?/:test_id?', checkAuth, Web.getStudentWiseReport)
    .get('/get-assigned-tests-teacher/:school_id?/:class_id?/:subject_id?', checkAuth, Web.getAssignedTestsTeacher)


    .get('/view-principal/:id', checkAuth, Web.getPrincipal)
    .patch('/update-principal/:id', checkAuth, Web.updatePrincipal)
    .get('/classes-with-student-no/:school_id?', checkAuth, Web.getClassesWithStudents)
    .post('/get-all-teachers/:school_id?', checkAuth, Web.getAllTeachersOfSchool)
    .get('/get-all-subjects', checkAuth, Web.getAllSubjects)
    ;

module.exports = router;