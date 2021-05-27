const express =  require("express");
const School = require('../../http/controllers/admin/schoolController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");

const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, School.CreateSchool)
    .patch('/update/:id',checkAuth,adminAuth, School.UpdateSchool)
    .get('/view/:id',checkAuth,adminAuth, School.ViewSchool)
    .get('/view-all',checkAuth,adminAuth, School.ViewAllSchool)
    .post('/delete', checkAuth,adminAuth, School.DeleteSchool);

module.exports = router;