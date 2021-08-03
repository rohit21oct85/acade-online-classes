const express =  require("express");
const MockTest = require('../../http/controllers/admin/mockTestController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/add-question', checkAuth, MockTest.AddMockTestQuestion)
    .post('/update-question', checkAuth, MockTest.UpdateMockTestQuestion)
    .get('/all-question/:question_for?', checkAuth, MockTest.AllMockTestQuestion)
    .get('/single-question/:test_id?', checkAuth, MockTest.SingleMockTestQuestion)
    .post('/delete-question', checkAuth, MockTest.DeleteMockTestQuestion)
    
    .post('/create', checkAuth, MockTest.CreateMockTest)
    .post('/update-mock-test', checkAuth, MockTest.UpdateMockTest)
    .get('/view/:id', checkAuth, MockTest.ViewMockTest)
    .get('/view-all/:test_for?/:status?', checkAuth, MockTest.ViewAllMockTest)
    .post('/delete', checkAuth, MockTest.DeleteMockTest)
    .post('/delete-all-test?', checkAuth, MockTest.DeleteAllMockTest)
;

module.exports = router;