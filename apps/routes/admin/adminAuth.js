const express =  require("express");
const auth = require('../../http/controllers/admin/authController');
const router = express.Router();

router
    .post('/register', auth.Register)
    .post('/login', auth.Login)
    .post('/forgot-password', auth.ForgotPassword)
    .post('/refresh-token', auth.RefreshToken)
    .delete('/logout', auth.Logout)
;
module.exports = router;