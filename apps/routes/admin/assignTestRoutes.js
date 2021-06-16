const express =  require("express");
const AssignTest = require('../../http/controllers/admin/AssignTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, AssignTest.CreateAssignTest)
;

module.exports = router;