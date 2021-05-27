import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import SchoolList from '../pages/admin/school/SchoolList'
import SchoolAuthList from '../pages/admin/school_admin/SchoolAuthList'

import SchoolAdminLogin from '../pages/school/admin_auth/AdminLogin'
import SchoolAdminDashboard from '../pages/school/admin/SchoolAdminDashboard'

import TeacherLogin from '../pages/school/teacher_auth/TeacherLogin'
import StudentLogin from '../pages/school/student_auth/StudentLogin'

import AppModule from '../pages/admin/appModule/AppModule.jsx'
import ClassList from '../pages/admin/class/ClassList.jsx'
import SubjectList from '../pages/admin/subject/SubjectList.jsx'
import StudentList from '../pages/admin/student/StudentList.jsx'
import TeacherList from '../pages/admin/teacher/TeacherList'

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
    },
    {
        path: '/school/admin/login',
        component: SchoolAdminLogin
    },
    
    {
        path: '/school/teacher/login',
        component: TeacherLogin
    },
    
    {
        path: '/school/student/login',
        component: StudentLogin
    },

];

export const privateRoutes = [
    {
        path: '/admin/dashboard',
        component: Dashboard
    },
    {
        path: '/admin',
        component: Dashboard
    },
    {
        path: '/admin/school-management/:page_type?/:school_id?',
        component: SchoolList
    },
    {
        path: '/admin/class-management/:page_type?/:school_id?/:class_id?',
        component: ClassList
    },
    {
        path: '/admin/subject-management/:page_type?/:subject_id?',
        component: SubjectList
    },
    {
        path: '/admin/students-management/:page_type?/:student_id?',
        component: StudentList
    },
    {
        path: '/admin/auth-management/:page_type?/:school_id?/:school_admin_email?/:school_admin_id?',
        component: SchoolAuthList
    },
    {
        path: '/admin/teachers-management/:page_type?/:teacher_id?',
        component: TeacherList
    }

];

export const adminRoutes = [
    {
        path: '/admin/app-module/:module_id?',
        component: AppModule
    },
    
    {
        path: '/admin/app-roles/:role_id?',
        component: AppModule
    },
    {
        path: '/admin/app-permissions/:permission_id?',
        component: AppModule
    },

]

export const schoolAdminRoutes = [
    {
        path: '/school/:school_slug/admin/dashboard',
        component: SchoolAdminDashboard
    },
]

