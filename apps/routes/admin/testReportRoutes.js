const express =  require("express");
const TestReport = require('../../http/controllers/admin/testReportController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const router = express.Router();

router
      .get('/view-student/:test_id?/:school_id?/:class_id?/:test_type?', checkAuth, TestReport.ViewStudentReport)
;

module.exports = router;