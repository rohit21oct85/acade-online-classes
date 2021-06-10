import React , {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateSubject from './CreateSubject';
import UploadSubjects from './UploadSubjects';
import AllSubjects from './AllSubjects';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';

export default function SubjectList() {
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
    
    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false){
            history.push(`/admin/subject-management`)
        }
        if(update === false){
            history.push(`/admin/subject-management`)
        }
    }
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Subjects List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            <button className="btn btn-sm dark" onClick={e => { 
                                if(params.page_type == undefined){
                                    history.push(`/admin/subject-management/upload`)
                                }else if(params.page_type == "upload"){
                                    history.push(`/admin/subject-management`)
                                }
                                }}>
                                <span className="fa fa-upload"></span>   Upload Subjects 
                            </button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                            { params.page_type == "upload" ? <UploadSubjects /> : <CreateSubject /> }
                            </div>
                            
                            <div className="col-md-9 ">
                            <AllSubjects />
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
