const adminAuth = require('./admin/adminAuth');
const roleRoutes = require('./admin/roleRoutes.js');
const schoolAuth = require('./school/schoolAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const permissionRoutes = require('./admin/permissionRoutes');
const classRoutes = require('./admin/classRoutes');
const subjectRoutes = require('./admin/subjectRoutes');
const studentRoutes = require('./admin/studentRoutes');
const teacherRoutes = require('./admin/teacherRoutes');
const principalRoutes = require('./admin/principalRoutes');

module.exports = {
    adminAuth,
    roleRoutes,
    schoolAuth,
    schoolRoutes,
    moduleRoutes,
    permissionRoutes,
    classRoutes,
    subjectRoutes,
    studentRoutes,
    teacherRoutes,
    principalRoutes,
}