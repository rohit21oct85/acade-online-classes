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
import PrincipalList from '../pages/admin/principal/PrincipalList'
import TeacherSubjectList from '../pages/admin/mappingTeacherSubject/TeacherSubjectList'
import TeacherClassList from '../pages/admin/mappingTeacherClass/TeacherClassList'
import ClassSubjectList from '../pages/admin/mappingClassSubject/ClassSubjectList'
import QuestionBank from '../pages/admin/questionBank/QuestionBank'
import MockTest from '../pages/admin/mockTest/MockTest'

import ViewAllQuestions from '../pages/admin/questionBank/ViewAllQuestions'
import UnitsList from '../pages/admin/units/UnitsList'
import UnitTests from '../pages/admin/unitTest/UnitTest'
import ViewAllTest from '../pages/admin/unitTest/ViewAllTest'
import SchoolReport from '../pages/admin/school/SchoolReport'
import ActivityReport from '../pages/admin/school/ActivityReport'
import AssignTests from '../pages/admin/assignTest/AssignTests'
import SubjectChapterList from '../pages/admin/mappingSubjectChapter/SubjectChapterList'


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
        path: '/admin/class-management/:page_type?/:class_id?',
        component: ClassList
    },
    {
        path: '/admin/students-management/:page_type?/:school_id?/:class_id?/:section?/:student_id?',
        component: StudentList
    },
    {
        path: '/admin/subject-management/:page_type?/:subject_id?',
        component: SubjectList
    },
    {
        path: '/admin/teachers-management/:page_type?/:school_id?/:subject_id?/:subject_name?/:teacher_id?',
        component: TeacherList
    },
    {
        path: '/admin/principal-management/:page_type?/:school_id?/:principal_id?',
        component: PrincipalList
    },
    {
        path: '/admin/mapping-teacher-subjects/:page_type?/:school_id?/:school_slug?/:teacher_id?/:teacher_slug?/:teacher_sub_id?',
        component: TeacherSubjectList
    },
    {
        path: '/admin/mapping-teacher-class/:page_type?/:school_id?/:school_slug?/:teacher_id?/:teacher_slug?/:teacher_class_id?',
        component: TeacherClassList
    },
    {
        path: '/admin/mapping-class-subjects/:page_type?/:class_id?/:class_slug?/:class_subject_id?',
        component: ClassSubjectList
    },
    {
        path: '/admin/question-bank/:page_type?/:class_id?/:subject_id?/:unit_id?/:chapter_id?/:qbank_id?',
        component: QuestionBank
    },
    {
        path: '/admin/mapping-subject-chapters/:page_type?/:class_id?/:class_slug?/:subject_id?/:subject_slug?/:unit_id?/:unit_slug?/:subject_chapter_id?',
        component: SubjectChapterList
    },
    {
        path: '/admin/manage-units/:page_type?/:class_id?/:subject_id?/:subject_name?/:unit_id?',
        component: UnitsList
    },
    {
        path: '/admin/manage-unit-test/:page_type?/:test_type?/:class_id?/:subject_id?/:unit_id?/:chapter_id?/:test_id?',
        component: UnitTests
    },

    {
        path: '/admin/assign-test/:page_type?/:school_id?/:test_type?/:class_id?/:test_id?',
        component: AssignTests
    },
    {
        path: '/admin/view-all-test/:test_type?/:class_id?',
        component: ViewAllTest
    },
    
    {
        path: '/admin/mock-test/:page_type?/:module_type?/:question_for?/:test_id?',
        component: MockTest
    },


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
        path: '/admin/manage-sub-admin/:page_type?/:role?/:admin_id?',
        component: SubAdminList
    },
    {
        path: '/admin/view-all-questions/:class_id?/:subject_id?',
        component: ViewAllQuestions
    },
    
    {
        path: '/admin/school-report/:school_id?/:class_id?/:test_type?/:report_type?/:test_id?',
        component: SchoolReport
    },
    {
        path: '/admin/activity-report/:school_id?/:user_type?/:report_type?/:report_id?',
        component: ActivityReport
    },

]
