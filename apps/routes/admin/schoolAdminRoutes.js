const express =  require("express");
const SchoolAdmin = require('../../http/controllers/admin/SchoolAdminController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");

const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, SchoolAdmin.CreateSchoolAdmin)
    .patch('/update/:id',checkAuth,adminAuth, SchoolAdmin.UpdateSchoolAdmin)
    .get('/view/:id',checkAuth,adminAuth, SchoolAdmin.ViewSchoolAdmin)
    .get('/view-all',checkAuth,adminAuth, SchoolAdmin.ViewAllSchoolAdmin)
    .post('/delete', checkAuth,adminAuth, SchoolAdmin.DeleteSchoolAdmin);

module.exports = router;