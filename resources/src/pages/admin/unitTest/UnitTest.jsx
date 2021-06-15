import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import CreateTest from './components/CreateTest'
import AllUnitTests from './components/AllUnitTests'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';

export default function ModuleList() {
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
            history.push(`/admin/manage-unit-test`)
        }
    }
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Module List</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    history.push(`/admin/manage-unit-test/create`)
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Unit Test                                </button>
                            )}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-8 pr-0">
                                { (create === true || update === true || upload === true)  &&  (params.page_type === 'create' ||params.page_type === 'update' || params.page_type === 'upload') && <CreateTest />  }
                            </div>
                            <div className={`${(params?.page_type === 'create' || params?.page_type === 'update' || params?.page_type === 'upload') ? 'col-md-4 pr-0':'col-md-12'}`}>
                                <AllUnitTests update={update} Delete={Delete}/>
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
