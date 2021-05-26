const adminAuth = require('./admin/adminAuth');
const schoolRoutes = require('./admin/schoolRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const classRoutes = require('./admin/classRoutes');
const subjectRoutes = require('./admin/subjectRoutes');
const studentRoutes = require('./admin/studentRoutes');

module.exports = {
    adminAuth,
    schoolRoutes,
    moduleRoutes,
    classRoutes,
    subjectRoutes,
    studentRoutes,
}