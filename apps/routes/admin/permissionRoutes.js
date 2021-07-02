const express =  require("express");
const Auth = require('../../http/controllers/admin/permissionController');
const checkAuth =  require("../../http/middleware/check-auth.js");
const adminAuth =  require("../../http/middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreatePermission)
    .get('/view/:module_slug/:role_slug/:admin_email?',checkAuth, Auth.ViewPermission)
    .get('/module/:role_slug?/:admin_email?',checkAuth, Auth.OtherModules)
    .get('/view-all/:role_slug?/:user_email?',checkAuth,adminAuth, Auth.ViewAllPermission)
    .post('/delete',checkAuth,adminAuth, Auth.DeletePermission)
    .post('/delete-all',checkAuth,adminAuth, Auth.DeleteAllPermission)
    .post('/delete-all-module-permission',checkAuth,adminAuth, Auth.DeleteAllModulePermission)
    ;
module.exports = router;