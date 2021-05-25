const express =  require("express");
const Module = require('../../http/controllers/admin/moduleController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Module.CreateModule)
    .patch('/update/:id',checkAuth,adminAuth, Module.UpdateModule)
    .get('/view/:id',checkAuth,adminAuth, Module.ViewModule)
    .get('/view-all',checkAuth,adminAuth, Module.ViewAllModule)
    .delete('/delete/:id', checkAuth,adminAuth, Module.DeleteModule);

module.exports = router;