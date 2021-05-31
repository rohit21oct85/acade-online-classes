const express =  require("express");
const Auth = require('../../http/controllers/admin/permissionController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreatePermission)
    .patch('/update/:id',checkAuth,adminAuth, Auth.UpdatePermission)
    .get('/view/:id',checkAuth,adminAuth, Auth.ViewPermission)
    .get('/module/:school_slug?/:role_slug?',checkAuth, Auth.OtherModules)
    .get('/view-all/:school_slug?/:role_slug?',checkAuth,adminAuth, Auth.ViewAllPermission)
    .post('/delete',checkAuth,adminAuth, Auth.DeletePermission);
module.exports = router;