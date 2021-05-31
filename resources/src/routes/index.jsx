import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import SchoolList from '../pages/admin/school/SchoolList'
import SchoolLoginPage from '../pages/school/SchoolLoginPage'
import SchoolAdminDashboard from '../pages/school/SchoolAdminDashboard'

import AppModule from '../pages/admin/appModule/AppModule.jsx'
import AppRole from '../pages/admin/appRole/AppRole.jsx'
import AppPermission from '../pages/admin/appPermission/AppPermission.jsx'
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
        path: '/school/:user_type?/login',
        component: SchoolLoginPage
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
        path: '/admin/auth-management/:page_type?/:school_id?/:school_admin_email?/:school_admin_id?',
        component: SchoolAuthList
    },
    {
        path: '/admin/teachers-management/:page_type?/:school_id?/:teacher_id?',
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
    {
        path: '/school/:school_slug/admin/class-management/:page_type?/:school_id?',
        component: ClassList
    },
    {
        path: '/school/:school_slug/admin/student-management/:page_type?/:school_id?/:class_id?/:student_id?',
        component: StudentList
    },
    {
        path: '/school/:school_slug/admin/students-management/:page_type?/:student_id?',
        component: StudentList
    },
    {
        path: '/school/:school_slug/admin/subject-management/:page_type?/:subject_id?',
        component: SubjectList
    },
    {
        path: '/school/:school_slug/admin/teachers-management/:page_type?/:teacher_id?',
        component: TeacherList
    }
]

