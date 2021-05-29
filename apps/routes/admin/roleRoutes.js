const express =  require("express");
const Auth = require('../../http/controllers/admin/roleController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreateRole)
    .patch('/update/:id',checkAuth,adminAuth, Auth.UpdateRole)
    .get('/view/:id',checkAuth,adminAuth, Auth.ViewRole)
    .get('/view-all',checkAuth,adminAuth, Auth.ViewAllRole)
    .post('/delete',checkAuth,adminAuth, Auth.DeleteRole);
module.exports = router;