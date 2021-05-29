const adminAuth = require('./admin/adminAuth');
const roleRoutes = require('./admin/roleRoutes.js');
const schoolAdminAuth = require('./school/schoolAdminAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const schoolAdminRoutes = require('./admin/schoolAdminRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const permissionRoutes = require('./admin/permissionRoutes');
const classRoutes = require('./admin/classRoutes');
const subjectRoutes = require('./admin/subjectRoutes');
const studentRoutes = require('./admin/studentRoutes');
const teacherRoutes = require('./admin/teacherRoutes');

module.exports = {
    adminAuth,
    roleRoutes,
    schoolAdminAuth,
    schoolRoutes,
    schoolAdminRoutes,
    moduleRoutes,
    permissionRoutes,
    classRoutes,
    subjectRoutes,
    studentRoutes,
    teacherRoutes,
}