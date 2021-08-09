const express =  require("express");
const AssignTest = require('../../http/controllers/admin/AssignTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, AssignTest.CreateAssignTest)
    .get('/view-all/:school_id?/:test_type?/:class_id?', checkAuth, AssignTest.ViewAllAssignedTest)
    .get('/view/:test_id?', checkAuth, AssignTest.ViewAssignedTest)
    .post('/update', checkAuth, AssignTest.UpdateAssignedTest)
    .get('/view-assigned-mock-test/:school_id?/:test_type?/:question_for?', checkAuth, AssignTest.ViewAssignedMockTest)
    .post('/to-class', checkAuth, AssignTest.AssignedTestToClass)
    .post('/update-time', checkAuth, AssignTest.UpdateTimeAssignTest)
    .post('/update-mark', AssignTest.UpdateAllTestMarks)
;

module.exports = router;