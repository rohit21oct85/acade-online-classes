import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useSchoolLists from './hooks/useSchoolLists';
import useClassList from '../class/hooks/useClassList';
import useClassSubjectList from '../../../hooks/classSubjectMapping/useClassSubjectList';
import useSchoolAssignedTests from './hooks/useSchoolAssignedTests';

export default function SchoolReport() {
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
            history.push(`/admin/school-report`)
        }
    }

    const {data: schools} = useSchoolLists();
    const {data: sClass} = useClassList();
    const {data: reports } = useSchoolAssignedTests();
    
    function handleSchoolChange(e){
            history.push(`/admin/school-report/${e.target.value}`);
    }
    function handleSubjectChange(e){
            history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${e.target.value}`);
    }
    function handleClassChange(e){
            history.push(`/admin/school-report/${params?.school_id}/${e.target.value}`);
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
                        <select className="form-control col-md-2 ml-2"
                        value={params?.school_id}
                        onChange={handleSchoolChange}>
                              <option  value="">Select School</option>
                              {schools?.map(school => {
                                    return(
                                          <option value={school?._id}>{school?.school_name}</option>
                                    )
                              })}
                        </select>       
                        <select className="form-control col-md-2 ml-2"
                        value={params?.class_id}
                        onChange={handleClassChange}>
                              <option value="">Select Class</option>
                              {sClass?.map(sc => {
                                    return(
                                          <option value={sc?._id}>{sc?.class_name}Th </option>
                                    )
                              })}
                        </select>      
                        
                  </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="dash-cont-start">
                  <div className="row col-md-12">
                       
                        {!params?.test_id && reports?.map(rep => {
                              let tsubjects = Array.prototype.map.call(rep?.test_subjects, function(items) { return items.subject_name}).join(', ');
                              let test_window = new Date(rep?.start_date)
                              test_window.setMinutes( test_window.getMinutes() + rep?.test_window );
                              if(rep?.assigned === true)
                              return(
                              <div className="col-md-4 card p-3">
                                    <div className="flex"><strong>Test Name:</strong> {rep?.test_name}</div>  
                                    <div className="flex"><strong>Test Type:</strong>{rep?.test_type}</div>  
                                    <div className="flex"><strong>Test Subjects:</strong>{tsubjects}</div>  
                                    <div className="flex"><strong>Test Attemted:</strong>{rep.attemptedStudentIds?.length}</div>  
                                    <div className="flex"><strong>Test Window:</strong> {rep?.test_window}</div>  
                                    <div className="flex"><strong>Test Duration:</strong>{rep?.test_duration}</div>  
                                    <div className="flex"><strong>Total Question:</strong>{rep?.total_question}</div>  
                                    <div className="flex"><strong>Test Starts:</strong>{new Date(rep?.start_date).toLocaleString()}</div>  
                                    <div className="flex"><strong>Test Ends:</strong> {test_window.toLocaleString()}</div>  
                                    <hr />
                                    <button className="dark bg-success btn btn-sm"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${rep?.test_id}`)
                                    }}>
                                          View Results
                                    </button>
                              </div>      
                              )
                        })}

                        {params?.test_id && (
                              <h2>Test result: </h2>
                        )}
                        
                  </div>
                  </div>    
                </div>
            </div>
        </div>
    )
}
