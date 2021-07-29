import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useSchoolLists from './hooks/useSchoolLists';
import useClassList from '../class/hooks/useClassList';

import LoginReport from './Reports/LoginReport';
import LoginActivityDetails from './Reports/LoginActivityDetails';
import { useToasts } from 'react-toast-notifications';
import useDeleteSchoolMockTest from './hooks/useDeleteSchoolMockTest';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SchoolReport() {
    const params = useParams();
    const history = useHistory();
    const accessUrl = useModule();
    const { addToast } = useToasts();
    useEffect(checkPageAccessControl,[accessUrl]);
    function checkPageAccessControl(){
      //   console.log(accessUrl);  
        if(accessUrl === false){
            history.push('/403');
        }
    }
    const userTypes = [
          {key: 'student', value: 'Students'},
          {key: 'teacher', value: 'Teacher'},
          {key: 'principal', value: 'Principal'},
    ]
    const create = useAccess('create');
    const update = useAccess('update');
    const upload = useAccess('upload');
    const Delete = useAccess('delete');
    
    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false || update === false || upload === false){
            history.push(`/admin/activity-report`)
        }
    }
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const {data: schools} = useSchoolLists();
    const {data: sClass} = useClassList();
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }
    
    function handleSchoolChange(e){
      history.push(`/admin/activity-report/${e.target.value}`);
      
    }
    const deleteMutation = useDeleteSchoolMockTest();
    async function DeleteAllMockTest(){

      await deleteMutation.mutate({
            school_id: params?.school_id
      })
    }
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                  <div className="dash-main-head">
                        <h2>School Activity Report</h2>
                  </div>
                  <div className="dash-con-heading">
                  <div className="col-md-12 row">
                        <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                              <span className="fa fa-dashboard"></span>
                        </button>
                        <select className="form-control col-md-2 ml-2"
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
                        <div className="ml-2 pl-2 pr-2">
                        <DatePicker 
                              className="form-control" 
                              selected={startDate}
                              value={startDate}
                              onChange={(date) => setStartDate(date)}
                              isClearable 
                              showTimeSelect 
                              dateFormat="MM/d/yyyy h:mm aa"
                              maxDate={new Date()}
                        />  
                        </div>
                        <div className="pl-2">
                        <DatePicker
                              className="form-control" 
                              selected={endDate}
                              value={endDate}
                              onChange={(date) => setEndDate(date)}
                              isClearable showTimeSelect dateFormat="MM/d/yyyy h:mm aa"
                              maxDate={new Date()}
                        />  
                        </div>

                        {params?.school_id && (
                              <>
                              <button className="dark ml-2"
                                    onClick={() => {
                                          history.push(`/admin/activity-report/${params?.school_id}/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}/login-report`)
                                    }}
                              >
                                    Login Report
                              </button>  
                              
                              </>
                        )}            
                  </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="dash-cont-start">
                        {(params?.report_type === 'login-report') && (
                              <LoginReport />
                        )}
                        {(params?.report_type === 'activity-detail') && (
                              <LoginActivityDetails />
                        )}
                        
                        
                  </div>    
                </div>
            </div>
        </div>
    )
}
