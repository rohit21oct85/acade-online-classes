const express =  require("express");
const Student = require('../../http/controllers/admin/studentController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, Student.CreateStudent)
    .patch('/update/:id', checkAuth, Student.UpdateStudent)
    .get('/view/:id', checkAuth, Student.ViewStudent)
    .get('/view-all', checkAuth, Student.ViewAllStudent)
    .delete('/delete/:id', checkAuth, Student.DeleteStudent)
;

module.exports = router;