import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useSchoolLists from './hooks/useSchoolLists';
import useClassList from '../class/hooks/useClassList';

import StudentList from './Reports/StudentList';
import SingleTestList from './Reports/SingleTestList';
import { useToasts } from 'react-toast-notifications';

export default function SchoolReport() {
    const params = useParams();
    const history = useHistory();
    const accessUrl = useModule();
    const { addToast } = useToasts();
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
            history.push(`/admin/school-report`)
        }
    }

    const {data: schools} = useSchoolLists();
    const {data: sClass} = useClassList();
    
    
    function handleSchoolChange(e){
      history.push(`/admin/school-report/${e.target.value}`);
      document.getElementById("rclass").selectedIndex = '0'
    }
    
    function handleClassChange(e){
      if(params?.school_id == "undefined" || typeof params?.school_id !== 'string'){
            addToast("please select school id", { appearance: 'error', autoDismiss: true });
            document.getElementById("rclass").selectedIndex = '0'
            return;
        }else{
            history.push(`/admin/school-report/${params?.school_id}/${e.target.value}`);
        }    
    }
   
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                  <div className="dash-main-head">
                        <h2>School Report</h2>
                  </div>
                  <div className="dash-con-heading">
                  <div className="col-md-12 row">
                        <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                              <span className="fa fa-dashboard"></span>
                        </button>
                        <select className="form-control col-md-3 ml-2"
                        id="rschool"
                        value={params?.school_id}
                        onChange={handleSchoolChange}>
                              <option  value="">Select School</option>
                              {schools?.map(school => {
                                    return(
                                          <option value={school?._id} key={school?._id}>{school?.school_name}</option>
                                    )
                              })}
                        </select>       
                        <select className="form-control col-md-2 ml-2"
                        id="rclass"
                        value={params?.class_id}
                        onChange={handleClassChange}>
                              <option value="">Select Class</option>
                              <option value="all">All Class</option>
                              {sClass?.map(sc => {
                                    return(
                                          <option value={sc?._id}>{sc?.class_name}Th </option>
                                    )
                              })}
                        </select>   
                        {params?.school_id && params?.class_id && (
                              <>
                              <button className="dark ml-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/combine-test`)
                                    }}
                              >
                                    Rivision Tests
                              </button>  
                              <button className="dark ml-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/single-test`)
                                    }}
                              >
                                    Assign Tests
                              </button>  
                              
                              <button className="dark ml-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/mock-test`)
                                    }}
                              >
                              Mock Test
                              </button>  
                              <button className="dark ml-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/upload-test`)
                                    }}
                              >
                              Teacher Led Test
                              </button>  
                              
                              </>


                        )}            
                  </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="dash-cont-start">
                        {(params?.test_type === 'combine-test' || params?.test_type === 'single-test' || params?.test_type === 'mock-test' || params?.test_type === 'upload-test') && (
                              <SingleTestList />
                        )}
                        
                        {params?.test_id && (params?.test_type === 'combine-test' || params?.test_type === 'single-test' || params?.test_type === 'mock-test' || params?.test_type === 'upload-test') && (
                              <StudentList />
                        )}
                        
                  </div>    
                </div>
            </div>
        </div>
    )
}
