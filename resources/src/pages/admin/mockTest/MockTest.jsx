import React,{useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import CreateMockTestQuestion from './components/CreateMockTestQuestion';
import CreateMockTest from './components/CreateMockTest';
import MockTestQuestionList from './components/MockTestQuestionList';
import MockTestList from './components/MockTestList';

export default function MockTest() {
    const params = useParams();
    const history = useHistory();
    const accessUrl = useModule();
    useEffect(checkPageAccessControl,[accessUrl]);
    function checkPageAccessControl(){
        if(accessUrl === false){
            history.push('/403');
        }
    }
    const create = useAccess('create');
    const update = useAccess('update');
    const upload = useAccess('upload');
    const Delete = useAccess('delete');
    const view = useAccess('view');
    
    useEffect(manageAccess,[create, update, upload, Delete, view]);
    function manageAccess(){
        if(create === false && update === false){
            history.push(`/admin/mock-test`)
        }
    }

    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Mock Test</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <>
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.question_for !== undefined){
                                        history.push(`/admin/mock-test/create/mock-test-question/${params?.question_for}`)
                                    }else{
                                        history.push(`/admin/mock-test/create/mock-test-question`)
                                    }
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Add Mock Test Question
                                </button>
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.question_for !== undefined){
                                        history.push(`/admin/mock-test/create/mock-test/${params?.question_for}`)
                                    }else{
                                        history.push(`/admin/mock-test/create/mock-test`)
                                    }
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Mock Test
                                </button>
                                </>
                            )}
                            {view && (
                                <>
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.question_for !== undefined){
                                        history.push(`/admin/mock-test/view/mock-test-question/${params?.question_for}`)
                                    }else{
                                        history.push(`/admin/mock-test/view/mock-test-question`)
                                    }
                                }}>
                                    <span className="fa fa-eye mr-2"></span>View Mock Test Question
                                </button>
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.question_for !== undefined){
                                        history.push(`/admin/mock-test/view/mock-test/${params?.question_for}`)
                                    }else{
                                        history.push(`/admin/mock-test/view/mock-test`)
                                    }
                                }}>
                                    <span className="fa fa-eye mr-2"></span>View Mock Test
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="dash-con-heading">
                    <div className="form-group">
                             <select className="form-control col-md-2"
                             value={params?.question_for}
                             onChange={(e) => {
                              if(e.target.value !== '')   
                              history.push(`/admin/mock-test/${params?.page_type}/${params?.module_type}/${e.target.value}`)
                             }}>
                                    <option value="">Question For</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="principal">Principal</option>
                             </select>
                       </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                             {create === true && params?.page_type === 'create' && params?.module_type === 'mock-test-question' && (
                                <div className="col-md-3">
                                    <CreateMockTestQuestion />
                                </div>   
                             )}
                             
                             {create === true && params?.page_type === 'create' && params?.module_type === 'mock-test' && (
                                <div className="col-md-3">
                                    <CreateMockTest />
                                </div>   
                             )}

                             {view === true && params?.page_type === 'view' && params?.module_type === 'mock-test-question' && (
                                <div className="col-md-12">
                                    <MockTestQuestionList />
                                </div>   
                             )}
                             {view === true && params?.page_type === 'view' && params?.module_type === 'mock-test' && (
                                <div className="col-md-12">
                                    <MockTestList />
                                </div>   
                             )}
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
