const express =  require("express");
const auth = require('../../http/controllers/school/authController');
const router = express.Router();

router
    .post('/login', auth.Login)
    .post('/forgot-password', auth.ForgotPassword)
    .post('/refresh-token', auth.RefreshToken)
    .delete('/logout', auth.Logout)
;
module.exports = router;