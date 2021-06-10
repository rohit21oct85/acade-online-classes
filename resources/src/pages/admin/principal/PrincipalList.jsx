import React, { useEffect } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreatePrincipal from './CreatePrincipal';
import AllPrincipals from './AllPrincipals';
import UploadPrincipals from './UploadPrincipals';
import useAccess from '../../../hooks/useAccess';
import useModule from '../../../hooks/useModule';

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

    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false){
            history.push(`/admin/principal-management`)
        }
        if(update === false){
            history.push(`/admin/principal-management`)
        }

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

                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                            { upload === true  && params.page_type === 'upload' && <UploadPrincipals />  }
                            { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' ) && <CreatePrincipal />  }
                            </div>
                            
                            <div className={`${(params?.page_type === 'create' || params?.page_type === 'update' || params?.page_type === 'upload') ? 'col-md-9':'col-md-12'}`}>
                               <AllPrincipals />
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
