const adminAuth = require('./admin/adminAuth');
const roleRoutes = require('./admin/roleRoutes.js');

const schoolRoutes = require('./admin/schoolRoutes');
const moduleRoutes = require('./admin/moduleRoutes');
const permissionRoutes = require('./admin/permissionRoutes');
const classRoutes = require('./admin/classRoutes');
const subjectRoutes = require('./admin/subjectRoutes');
const unitRoutes = require('./admin/unitRoutes');
const chapterRoutes = require('./admin/chapterRoutes');
const studentRoutes = require('./admin/studentRoutes');
const teacherRoutes = require('./admin/teacherRoutes');
const questionRoutes = require('./admin/questionRoutes');
const principalRoutes = require('./admin/principalRoutes');
const teacherSubjectMappingRoutes = require('./admin/teacherSubjectMappingRoutes');
const teacherClassMappingRoutes = require('./admin/teacherClassMappingRoutes');
const classSubjectMappingRoutes = require('./admin/classSubjectMappingRoutes');
const webRoutes = require('./web/webRoutes');

module.exports = {
    adminAuth,
    roleRoutes,
    schoolRoutes,
    moduleRoutes,
    permissionRoutes,
    classRoutes,
    subjectRoutes,
    unitRoutes,
    chapterRoutes,
    studentRoutes,
    teacherRoutes,
    questionRoutes,
    principalRoutes,
    teacherSubjectMappingRoutes,
    teacherClassMappingRoutes,
    classSubjectMappingRoutes,
    webRoutes,
}