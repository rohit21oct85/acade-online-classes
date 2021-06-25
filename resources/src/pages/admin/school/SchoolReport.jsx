import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateSchool from './components/CreateSchool';
import AllSchools from './components/AllSchools';
import UploadSchools from './components/UploadSchools';


import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useSchoolLists from './hooks/useSchoolLists';
import useSubjectList from '../subject/hooks/useSubjectList';
import useSubjectClassList from './hooks/useSubjectClassList';

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
    const {data: subjects} = useSubjectList()
    const {data: sClass} = useSubjectClassList()
    console.log(sClass)
    function handleSchoolChange(e){
            history.push(`/admin/school-report/${e.target.value}`);
    }
    function handleSubjectChange(e){
            history.push(`/admin/school-report/${params?.school_id}/${e.target.value}`);
    }
    function handleClassChange(e){
            history.push(`/admin/school-report/${params?.school_id}/${params?.subject_id}/${e.target.value}`);
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
                        value={params?.subject_id}
                        onChange={handleSubjectChange}>
                              <option value="">Select subject</option>
                              {subjects?.map(subject => {
                                    return(
                                          <option value={subject?._id}>{subject?.subject_name}</option>
                                    )
                              })}
                        </select>      
                        <select className="form-control col-md-1 ml-2"
                        value={params?.class_id}
                        onChange={handleClassChange}>
                              <option value="">Select Class</option>
                              {sClass?.map(sc => {
                                    return(
                                          <option value={sc?._id}>{sc?.class_name}</option>
                                    )
                              })}
                        </select>      
                  </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="dash-cont-start">
                  <div className="row">
                        
                  </div>
                  </div>    
                </div>
            </div>
        </div>
    )
}
