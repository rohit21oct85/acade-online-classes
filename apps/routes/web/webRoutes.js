const express =  require("express");
const Web = require('../../http/controllers/web/webController.js');
const checkAuth =  require("../../http/middleware/check-auth");
// const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    //student
    .get('/get-subjects/:class_id?', checkAuth, Web.getSubjects)
    .post('/get-assigned-tests/:school_id?/:class_id?', checkAuth, Web.getAssignedTestsStudent)
    .get('/get-test-questions/:test_id?', checkAuth, Web.getTestQuestions)
    .get('/get-a-test-question/:test_id?', checkAuth, Web.getASingleQuestions)
    .post('/attempt-test/:school_id?/:class_id?/:user_id?', checkAuth, Web.attemptTestByStudent)
    .post('/get-question/:test_id?', checkAuth, Web.getQuestions)
    .patch('/save-answer/:test_id?', checkAuth, Web.saveAnswer)
    .get('/get-result/:attempt_id?', checkAuth, Web.getResult)
    .post('/get-all-questions/:test_id?', checkAuth, Web.getAllQuestions)
    .post('/get-last-score', checkAuth, Web.getLastScore)
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
    .put('/update-assigned-test/:class_id?/:id?',checkAuth, Web.assignTestToStudent)
    .get('/get-student-wise-report/:school_id?/:class_id?/:subject_id?/:test_id?', checkAuth, Web.getStudentWiseReport)
    .get('/get-assigned-tests-teacher/:school_id?/:class_id?/:subject_id?', checkAuth, Web.getAssignedTestsTeacher)
    .get('/get-sections-student-count/:school_id?/:class_id?/:class_name', checkAuth, Web.getSectionStudent)
    .get('/get-class-sections-students/:school_id?/:class_id?/:class_name/:section', checkAuth, Web.getClassSectionStudents)
    .get('/classes-with-student-no/:school_id?/:teacher_id', checkAuth, Web.getClassesWithStudents)

    //principal
    .get('/view-principal/:id', checkAuth, Web.getPrincipal)
    .patch('/update-principal/:id', checkAuth, Web.updatePrincipal)
    .get('/classes-with-student-no-principal/:school_id?', checkAuth, Web.getClassesWithStudentsPrincipal)
    .post('/get-all-teachers/:school_id?', checkAuth, Web.getAllTeachersOfSchool)
    .get('/get-all-subjects', checkAuth, Web.getAllSubjects)
    .get('/get-all-teacher-assigned-tests/:school_id?/:teacher_id?', checkAuth, Web.getAllTeacherAssignedTests)
    .get('/get-all-student-attempted-tests/:school_id?/:class_id?/:test_id?', checkAuth, Web.getAllStudentAttemptedTests)
    
    //general
    .get('/get-school-logo/:sub_domain?', Web.getSchoolLogo)
    .delete('/deleteall/:school_id?', Web.deleteStudents)
    ;

module.exports = router;