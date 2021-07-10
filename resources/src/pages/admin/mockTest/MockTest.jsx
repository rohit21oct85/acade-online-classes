import React,{useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import CreateMockTestQuestion from './components/CreateMockTestQuestion';

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
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/mock-test/add-mock-test-question`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Add Mock Test Question
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                             {params?.page_type == 'add-mock-test-question' && (
                                <div className="col-md-3">
                                    <CreateMockTestQuestion />
                                </div>   
                             )}
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
