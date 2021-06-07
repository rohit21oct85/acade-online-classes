import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import SubAdminList from '../pages/admin/subAdmin/SubAdminList'
import SchoolList from '../pages/admin/school/SchoolList'

import AppModule from '../pages/admin/appModule/AppModule.jsx'
import AppRole from '../pages/admin/appRole/AppRole.jsx'
import AppPermission from '../pages/admin/appPermission/AppPermission.jsx'
import ClassList from '../pages/admin/class/ClassList.jsx'
import SubjectList from '../pages/admin/subject/SubjectList.jsx'
import StudentList from '../pages/admin/student/StudentList.jsx'
import TeacherList from '../pages/admin/teacher/TeacherList'
import TeacherStudentList from '../pages/admin/mappingTeacherStudent/TeacherStudentList'

export const webRoutes =  [
    { 
        path:'/',
        component: AdminLogin
    },
    { 
        path:'/admin/login',
        component: AdminLogin
    },
    {
        path:'/403',
        component: NotAuthorized
    }

];

export const privateRoutes = [
    {
        path: '/:user_type?/dashboard',
        component: Dashboard
    },
    {
        path: '/admin',
        component: Dashboard
    },
    
    {
        path: '/admin/class-management/:page_type?/:school_id?/:class_id?',
        component: ClassList
    },
    {
        path: '/admin/student-management/:page_type?/:school_id?/:class_id?/:student_id?',
        component: StudentList
    },
    {
        path: '/admin/students-management/:page_type?/:student_id?',
        component: StudentList
    },
    {
        path: '/admin/subject-management/:page_type?/:school_id?/:subject_id?',
        component: SubjectList
    },
    {
        path: '/admin/teachers-management/:page_type?/:school_id?/:teacher_id?',
        component: TeacherList
    },
    {
        path: '/admin/mapping-teacher-subjects/:page_type?/:school_id?/:teacher_id?',
        component: TeacherStudentList
    }

];

export const adminRoutes = [
    {
        path: '/admin/app-module/:module_id?',
        component: AppModule
    },
    
    {
        path: '/admin/app-roles/:role_id?',
        component: AppRole
    },
    {
        path: '/admin/app-permissions/:role_id?/:role_slug?/:role?/:admin_email?',
        component: AppPermission
    },
    {
        path: '/admin/school-management/:page_type?/:school_id?',
        component: SchoolList
    },
    {
        path: '/admin/manage-sub-admin/:page_type?/:admin_id?',
        component: SubAdminList
    },

]
