const adminAuth = require('./admin/adminAuth');
const roleRoutes = require('./admin/roleRoutes.js');
const schoolAdminAuth = require('./school/schoolAdminAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const schoolAdminRoutes = require('./admin/schoolAdminRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const permissionRoutes = require('./admin/permissionRoutes');

module.exports = {
    adminAuth,
    roleRoutes,
    schoolAdminAuth,
    schoolRoutes,
    schoolAdminRoutes,
    moduleRoutes,
    permissionRoutes,
}