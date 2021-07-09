import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import CreateAssignTest from './components/CreateAssignTest'
import AllAssignedTest from './components/AllAssignedTest'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useClassList from '../class/hooks/useClassList';
import useSchoolLists from '../school/hooks/useSchoolLists';

export default function AssignTests() {
    const params = useParams();
    const history = useHistory();
    const accessUrl = useModule();
    const {data: SClass}     = useClassList()
    const {data: schools}    = useSchoolLists();

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
            history.push(`/admin/question-bank`)
        }
    }
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Assigned Test List</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark" onClick={e => { history.push(`/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            
                            <button className="btn btn-sm dark ml-2" onClick={e => { 
                                if(params?.school_id && params?.test_type && params?.class_id){
                                    history.push(`/admin/assign-test/create/${params?.school_id}/${params?.test_type}/${params?.class_id}`)
                                }else{
                                    history.push(`/admin/assign-test/create/`)
                                }
                            }}>
                                <span className="bi bi-assign"></span>
                                Assign New Test
                            </button>
                            <button className="btn btn-sm dark ml-2" onClick={e => { 
                                if(params?.school_id && params?.test_type && params?.class_id){
                                    history.push(`/admin/assign-test/view/${params?.school_id}/${params?.test_type}/${params?.class_id}`)
                                }else{
                                    history.push(`/admin/assign-test/view/`)
                                }
                            }}>
                                <span className="bi bi-assign"></span>
                                View Assign Test
                            </button>

                        </div>
                    </div>
                    {(params?.page_type == 'create' || params?.page_type == 'view') && (
                        <>
                        <div className="dash-con-heading">
                        <div className="col-md-12 row pl-0">
                        <div className="col-md-2">
                        <select className="form-control"
                        value={params?.school_id}
                        onChange={e => {
                            history.push(`/admin/assign-test/${params?.page_type}/${e.target.value}`)
                        }}>
                        <option value="">Select School</option>      
                        {schools?.map(school => 
                            <option value={school?._id}>{school?.school_name}</option>
                        )}
                        </select>
                        </div>
                        <div className="col-md-3">
                                <select className="form-control"
                                value={params?.test_type}
                                onChange={e => {
                                    history.push(`/admin/assign-test/${params?.page_type}/${params?.school_id}/${e.target.value}`)
                                }}>
                                    <option value="">Test Type</option>
                                    <option value="combine-test">Combined Test</option>
                                    <option value="single-test">Single Test</option>
                                </select>
                        </div>
                            <div className="col-md-2">
                            <select className="form-control"
                                value={params?.class_id}
                                onChange={e => {
                                        history.push(`/admin/assign-test/${params?.page_type}/${params?.school_id}/${params?.test_type}/${e.target.value}`)
                                }}
                                >
                                        <option className="_">Classess</option>
                                        {SClass?.map(scl => 
                                            <option value={scl?._id} key={scl?._id}>{scl?.class_name}</option>
                                        )}
                                </select>
                            </div>
                            

                        </div>
                    </div>
                        </>
                    )}
                    

                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-12">
                                { (create === true || update === true || upload === true)  &&  (params.page_type === 'create' ||params.page_type === 'update') && <CreateAssignTest />  }
                            </div>
                            {params?.page_type === 'view' && (
                            <div className={`${(params?.page_type === 'view') ? 'col-md-12':'col-md-12'}`}>
                                <AllAssignedTest update={update} Delete={Delete}/>
                            </div>
                            )}

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
