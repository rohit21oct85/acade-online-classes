import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import SchoolList from '../pages/admin/school/SchoolList'

import AppModule from '../pages/admin/appModule/AppModule.jsx'

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
    }

];

export const adminRoutes = [
    {
        path: '/admin/app-module/:module_id?',
        component: AppModule
    }
]