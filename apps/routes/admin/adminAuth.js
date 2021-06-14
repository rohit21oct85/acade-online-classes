const express =  require("express");
const auth = require('../../http/controllers/admin/authController');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");

const router = express.Router();

router
    .post('/register', auth.Register)
    .post('/login', auth.Login)
    .get('/view-all',checkAuth,auth.ViewAllSubAdmin)
    .get('/role-view-all/:role?',checkAuth,auth.ViewSubAdminByRole)
    .get('/view/:admin_id', checkAuth, auth.ViewSubAdmin)
    .post('/update', checkAuth, auth.UpdateSubAdmin)
    .post('/forgot-password', auth.ForgotPassword)
    .post('/refresh-token', auth.RefreshToken)
    .delete('/logout', auth.Logout)
;
module.exports = router;