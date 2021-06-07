const express =  require("express");
const Auth = require('../../http/controllers/admin/roleController');
const checkAuth =  require("../../http/middleware/check-auth.js");

const router = express.Router();

router
    .post('/create',checkAuth, Auth.CreateRole)
    .patch('/update/:id',checkAuth, Auth.UpdateRole)
    .get('/view/:id',checkAuth, Auth.ViewRole)
    .get('/view-all',checkAuth, Auth.ViewAllRole)
    .post('/delete',checkAuth, Auth.DeleteRole);
module.exports = router;