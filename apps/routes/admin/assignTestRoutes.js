const express =  require("express");
const AssignTest = require('../../http/controllers/admin/AssignTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, AssignTest.CreateAssignTest)
    .get('/view-all/:school_id?/:test_type?/:class_id?', checkAuth, AssignTest.ViewAllAssignedTest)
    .post('/to-class', checkAuth, AssignTest.AssignedTestToClass)
;

module.exports = router;