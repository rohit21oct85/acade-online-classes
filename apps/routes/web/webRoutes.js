const express =  require("express");
const Web = require('../../http/controllers/web/webController.js');
const checkAuth =  require("../../http/middleware/check-auth");
// const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'apps/uploads/')
    },
    fileFilter: function(req, file, cb) {
        console.log(file.mimetype, "dadasd")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },
})
var upload = multer({ storage: storage })


router
    //student
    .get('/get-subjects/:class_id?', checkAuth, Web.getSubjects)
    .post('/get-assigned-tests/:school_id?/:class_id?', checkAuth, Web.getAssignedTestsStudent)
    .get('/get-test-questions/:test_id?', checkAuth, Web.getTestQuestions)
    .get('/get-a-test-question/:test_id?', checkAuth, Web.getASingleQuestions)
    .post('/attempt-test/:school_id?/:class_id?/:user_id?', checkAuth, Web.attemptTestByStudent)
    .post('/attempt-test-offline/:school_id?/:class_id?/:user_id?', checkAuth, Web.attemptTestByStudentOffline)
    .post('/get-question/:test_id?/:test_type?', checkAuth, Web.getQuestions)
    .patch('/save-answer/:test_id?/:test_type?', checkAuth, Web.saveAnswer)
    .patch('/save-answer-offline/:test_id?/:test_type?', checkAuth, Web.saveAnswerOffline)
    .patch('/save-answer-upload/:test_type?', checkAuth, Web.saveUploadAnswer)
    .get('/get-result/:attempt_id?/:test_type?', checkAuth, Web.getResult)
    .post('/get-all-questions/:test_id?/:test_type?', checkAuth, Web.getAllQuestions)
    .post('/get-last-score', checkAuth, Web.getLastScore)
    .post('/get-cumulative-score/:subject_id?', checkAuth, Web.getCumulativeScore)
    .get('/get-mock-test/:school_id?/:student_id?', checkAuth, Web.getMockTest)
    .get('/get-mock-test-questions/', checkAuth, Web.getMockTestQuestions)
    .get('/get-upload-test/:school_id?/:student_id?/:class_id?', checkAuth, Web.getUploadTest)
    .get('/get-uploaded-test-paper/:attempt_id?/:test_type?', checkAuth, Web.getUploadTestPaper)
    .get('/test-internet',Web.testInternet)
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
    .get('/view-all-units/:class_id?/:subject_id?', checkAuth, Web.ViewAllUnit)
    .get('/view-all-chapters/:class_id?/:subject_id?/:unit_id?', checkAuth, Web.ViewAllChapters)
    // .get('/view-all-chaps/:class_id?/:subject_id?', checkAuth, Web.ViewAllChaps)
    .post('/create-test/:class_id?/:unit_id?/:chapter_id?/:teacher_id?/:school_id?', upload.array('files', 10), checkAuth, Web.CreateTest)
   
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

    //testing purposes
    .delete('/deleteall/:school_id?', Web.deleteStudents)
    .delete('/deleteall-teach/:school_id?', Web.deleteTeachers)
    .patch('/change-domain-and-empid/:school_id?', Web.changeDomainStudent)
    .patch('/update-time/:school_id?', Web.changeTime)
    .patch('/update-attempt-ids/:school_id?/:class_id?', Web.updateAttempt)
    // .get('/test?/:school_id?/:class_id?/:class_name?', checkAuth, Web.testStrengthServer)
    ;

module.exports = router;
