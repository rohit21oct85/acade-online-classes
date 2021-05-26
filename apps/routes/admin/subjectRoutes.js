const express =  require("express");
const Subject = require('../../http/controllers/admin/subjectController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, Subject.CreateSubject)
    .patch('/update/:id', checkAuth, Subject.UpdateSubject)
    .get('/view/:id', checkAuth, Subject.ViewSubject)
    .get('/view-all', checkAuth, Subject.ViewAllSubject)
    .delete('/delete/:id', checkAuth, Subject.DeleteSubject)
;

module.exports = router;