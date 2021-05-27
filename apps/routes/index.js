const adminAuth = require('./admin/adminAuth');
const schoolAdminAuth = require('./school/schoolAdminAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const schoolAdminRoutes = require('./admin/schoolAdminRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const classRoutes = require('./admin/classRoutes');
const subjectRoutes = require('./admin/subjectRoutes');
const studentRoutes = require('./admin/studentRoutes');
const teacherRoutes = require('./admin/teacherRoutes');

module.exports = {
    adminAuth,
    schoolAdminAuth,
    schoolRoutes,
    schoolAdminRoutes,
    moduleRoutes,
    classRoutes,
    subjectRoutes,
    studentRoutes,
    teacherRoutes,
}