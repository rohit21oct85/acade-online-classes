const express =  require("express");
const Web = require('../../http/controllers/web/webController.js');
const checkAuth =  require("../../http/middleware/check-auth");
// const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .get('/get-subjects', checkAuth, Web.getSubjects)
;

module.exports = router;