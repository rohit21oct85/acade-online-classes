import React, { useEffect } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreatePrincipal from './components/CreatePrincipal';
import AllPrincipals from './components/AllPrincipals';
import UploadPrincipals from './components/UploadPrincipals';
import useAccess from '../../../hooks/useAccess';
import useModule from '../../../hooks/useModule';
import { export_table_to_csv } from '../../../utils/helper'

export default function PrincipalList() {
    
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
    const view = useAccess('view');

    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false || update === false || upload === false || view === false){
            history.push(`/admin/principal-management`)
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
                              <h2>Principal List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/principal-management/create`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Principals 
                                </button>
                            )}
                            {upload && (
                                <button className="btn btn-sm dark" 
                                onClick={ e => {
                                    history.push(`/admin/principal-management/upload`)
                                }}>
                                    <span className="fa fa-upload mr-2"></span>Upload Principals 
                                </button>
                            )}
                            {view && (
                                <button className="btn btn-sm dark ml-2" 
                                onClick={ e => {
                                    history.push(`/admin/principal-management/view`)
                                }}>
                                    <span className="fa fa-eye mr-2"></span>View Principals 
                                </button>
                            )}

                            {params.school_id ? <button className="btn btn-sm dark ml-2" onClick={handleExport}> 
                                <span className="fa fa-download mr-2"></span>Export to CSV 
                            </button> : "" }

                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-12">
                            { upload === true  && params.page_type === 'upload' && <UploadPrincipals />  }
                            </div>
                            
                            <div className="col-md-12">
                            { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' ) && <CreatePrincipal />  }
                            </div>
                            
                            <div className="col-md-12">
                              {(view === true && params?.page_type === 'view') && (
                                <AllPrincipals />
                              )}
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
