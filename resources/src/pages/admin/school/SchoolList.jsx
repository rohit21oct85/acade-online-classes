import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateSchool from './components/CreateSchool';
import AllSchools from './components/AllSchools';
import UploadSchools from './components/UploadSchools';


import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';

export default function SchoolList() {
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
    
    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false || update === false || upload === false){
            history.push(`/admin/students-management`)
        }
    }


    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                              <h2>School List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>

                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/school-management/create`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Schools                                </button>
                            )}

                            {upload && ( <button className="btn btn-sm dark" onClick={e => {
                                if(params.page_type == undefined || params.page_type == "create"){
                                    history.push(`/admin/school-management/upload`)
                                }else if(params.page_type == "upload"){
                                    history.push(`/admin/school-management`)
                                }
                                }}>
                                <span className="fa fa-upload"></span>   Upload Schools 
                            </button>)}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            {/* <div className="col-md-3">
                            { params.page_type == "upload" ? <UploadSchools /> : <CreateSchool /> }
                            </div> */}
                            
                            <div className="col-md-3">
                            { upload === true  && params.page_type === 'upload' && <UploadSchools />  }
                            { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' ) && <CreateSchool />  }
                            </div>

                            <div className={`${(params?.page_type === 'create' || params?.page_type === 'update' || params?.page_type === 'upload') ? 'col-md-9':'col-md-12'}`}>
                                <AllSchools update={update}/>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
