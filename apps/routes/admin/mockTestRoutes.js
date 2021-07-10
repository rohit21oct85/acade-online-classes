const express =  require("express");
const MockTest = require('../../http/controllers/admin/mockTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/add-question', checkAuth, MockTest.AddMockTestQuestion)
    .get('/all-question/:question_for?', checkAuth, MockTest.AllMockTestQuestion)
    .post('/delete-question', checkAuth, MockTest.DeleteMockTestQuestion)
    .post('/create', checkAuth, MockTest.CreateMockTest)
    .patch('/update/:id', checkAuth, MockTest.UpdateMockTest)
    .get('/view/:id', checkAuth, MockTest.ViewMockTest)
    .get('/view-all/:class_id?/:test_type?', checkAuth, MockTest.ViewAllMockTest)
    .post('/delete', checkAuth, MockTest.DeleteMockTest)
;

module.exports = router;