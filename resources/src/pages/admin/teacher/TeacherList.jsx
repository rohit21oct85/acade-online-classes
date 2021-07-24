import React,{useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateTeacher from './components/CreateTeacher';
import UploadTeachers from './components/UploadTeachers';
import AllTeachers from './components/AllTeachers';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import { export_table_to_csv } from '../../../utils/helper'

export default function TeacherList() {
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
        if(create === false || update === false || upload === false || view === false){
            history.push(`/admin/teachers-management`)
        }
    }
   
    const handleExport = () => {
        var html = document.querySelector("table").outerHTML;
        export_table_to_csv(html, "table.csv");
    }

    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Teacher List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/teachers-management/create/${params?.school_id}/${params?.subject_id}/${params?.subject_name}`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create teachers 
                                </button>
                            )}
                            {upload && (
                                <button className="btn btn-sm dark" 
                                onClick={ e => {
                                    history.push(`/admin/teachers-management/upload`)
                                }}>
                                    <span className="fa fa-upload mr-2"></span>Upload teachers 
                                </button>
                            )}
                            
                            {view && (
                                <button className="btn btn-sm dark ml-2" 
                                onClick={ e => {
                                    history.push(`/admin/teachers-management/view/${params?.school_id}/${params?.subject_id}/${params?.subject_name}`)
                                }}>
                                    <span className="fa fa-upload mr-2"></span>View Teachers 
                                </button>
                            )}

                            {params.subject_id ? <button className="btn btn-sm dark ml-2" onClick={handleExport}> 
                                <span className="fa fa-download mr-2"></span>Export to CSV 
                            </button> : "" }
                            
                        </div>
                    </div>

                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                            { upload === true && params.page_type === 'upload' && <UploadTeachers />  }
                            </div>
                            
                            <div className="col-md-12">
                            { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' ) && <CreateTeacher />  }
                            </div>

                            {view === true && params?.page_type === 'view' && (
                            <div className={`col-md-12`}>
                                <AllTeachers update={update} Delete={Delete}/>
                            </div>
                            )}

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
