const express =  require("express");
const UnitTest = require('../../http/controllers/admin/unitTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, UnitTest.CreateUnitTest)
    .patch('/update/:id', checkAuth, UnitTest.UpdateUnitTest)
    .get('/view/:id', checkAuth, UnitTest.ViewUnitTest)
    .get('/view-all/:class_id?/:subject_id?', checkAuth, UnitTest.ViewAllUnitTest)
    .post('/delete', checkAuth, UnitTest.DeleteUnitTest)
;

module.exports = router;