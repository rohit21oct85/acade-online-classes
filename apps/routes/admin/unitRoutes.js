const express =  require("express");
const Unit = require('../../http/controllers/admin/unitController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, Unit.CreateUnit)
    .patch('/update/:id', checkAuth, Unit.UpdateUnit)
    .get('/view/:id', checkAuth, Unit.ViewUnit)
    .get('/view-all/:class_id?/:subject_id?', checkAuth, Unit.ViewAllUnit)
    .post('/delete', checkAuth, Unit.DeleteUnit)
;

module.exports = router;