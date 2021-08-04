const express =  require("express");
const UnitTest = require('../../http/controllers/admin/unitTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, UnitTest.CreateUnitTest)
    .post('/addFields', UnitTest.AddFields)
    .patch('/update/:id', checkAuth, UnitTest.UpdateUnitTest)
    .post('/update-subject/:subject_id?', checkAuth, UnitTest.UpdateSubjectUnitTest)
    .get('/view/:id', checkAuth, UnitTest.ViewUnitTest)
    .get('/view-all/:class_id?/:test_type?', checkAuth, UnitTest.ViewAllUnitTest)
    .get('/view-class-subject/:class_id?/:subject_id?/:school_id?', checkAuth, UnitTest.ViewUnitTestByClassSubjects)
    .post('/delete', checkAuth, UnitTest.DeleteUnitTest)
;

module.exports = router;