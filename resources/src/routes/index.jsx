import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import SchoolList from '../pages/admin/school/SchoolList'

import AppModule from '../pages/admin/appModule/AppModule.jsx'
import ClassList from '../pages/admin/class/ClassList.jsx'
import SubjectList from '../pages/admin/subject/SubjectList.jsx'
import StudentList from '../pages/admin/student/StudentList.jsx'

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
        path: '/admin/class-management/:page_type?/:class_id?',
        component: ClassList
    },
    {
        path: '/admin/subject-management/:page_type?/:subject_id?',
        component: SubjectList
    },
    {
        path: '/admin/students-management/:page_type?/:student_id?',
        component: StudentList
    }

];

export const adminRoutes = [
    {
        path: '/admin/app-module/:module_id?',
        component: AppModule
    }
]