const express =  require("express");
const Teacher = require('../../http/controllers/admin/teacherController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, Teacher.CreateTeacher)
    .patch('/update/:id', checkAuth, Teacher.UpdateTeacher)
    .get('/view/:id', checkAuth, Teacher.ViewTeacher)
    .get('/view-all', checkAuth, Teacher.ViewAllTeacher)
    .delete('/delete/:id', checkAuth, Teacher.DeleteTeacher)
;

module.exports = router;