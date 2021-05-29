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
import AppRole from '../pages/admin/appRole/AppRole.jsx'
import AppPermission from '../pages/admin/appPermission/AppPermission.jsx'

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
        path: '/admin/auth-management/:page_type?/:school_id?/:school_admin_email?/:school_admin_id?',
        component: SchoolAuthList
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
        path: '/admin/app-permissions/:role_id?/:role_slug?/:school_id?/:school_slug?/:permission_id?',
        component: AppPermission
    },

]

export const schoolAdminRoutes = [
    {
        path: '/school/:school_slug/admin/dashboard',
        component: SchoolAdminDashboard
    },
]

