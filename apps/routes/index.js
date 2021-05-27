const adminAuth = require('./admin/adminAuth');
const schoolAdminAuth = require('./school/schoolAdminAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const schoolAdminRoutes = require('./admin/schoolAdminRoutes');
const moduleRoutes = require('./admin/moduleRoutes');

module.exports = {
    adminAuth,
    schoolAdminAuth,
    schoolRoutes,
    schoolAdminRoutes,
    moduleRoutes,
}