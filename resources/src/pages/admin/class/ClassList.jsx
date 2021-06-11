import React, { useEffect,useState } from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import CreateClass from './components/CreateClass';
import UploadClasses from './components/UploadClasses';
import AllClasses from './components/AllClasses';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';

export default function ClassList() {
    const params = useParams();
    const history = useHistory();
    const location = useLocation();
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
    
    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false || update === false || upload === false){
            history.push(`/admin/class-management`)
        }
    }
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Class List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/class-management/create`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Class
                                </button>
                            )}
                            {upload && (
                                <button className="btn btn-sm dark" 
                                onClick={ e => {
                                    history.push(`/admin/class-management/upload`)
                                }}>
                                    <span className="fa fa-upload mr-2"></span>Upload Classes 
                                </button>
                            )}
                            {/* <button className="btn btn-sm dark" onClick={e => { 
                                if(params.page_type == undefined){
                                    history.push(`/admin/class-management/upload`)
                                }else if(params.page_type == "upload"){
                                    history.push(`/admin/class-management`)
                                }
                                }}>
                                <span className="fa fa-upload"></span>   Upload Classes 
                            </button> */}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                            { upload === true  && params.page_type === 'upload' && <UploadClasses />  }
                            { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' ) && <CreateClass />  }
                            </div>

                            <div className={`${(params?.page_type === 'create' || params?.page_type === 'update' || params?.page_type === 'upload') ? 'col-md-9':'col-md-12'}`}>
                                <AllClasses update={update} Delete={Delete}/>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
