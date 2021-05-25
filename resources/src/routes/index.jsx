import AdminLogin from '../pages/admin/auth/Login'
import NotAuthorized from '../pages/NotAuthorized.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import CategoryList from '../pages/admin/category/CategoryList'

import AppModule from '../pages/admin/appModule/AppModule.jsx'
import ClassList from '../pages/admin/class/ClassList.jsx'

export const webRoutes =  [
    { 
        path:'/',
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
        path: '/admin/category-management/:action_type?/:category_id?/:category_slug?/:segment_id?',
        component: CategoryList
    }

];

export const adminRoutes = [
    {
        path: '/admin/app-module/:module_id?',
        component: AppModule
    },
    {
        path: '/admin/class-management',
        component: ClassList
    }
]