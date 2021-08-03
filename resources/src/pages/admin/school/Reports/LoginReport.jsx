import React , {useState}from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useLogoutUser from '../hooks/useLogoutUser';
import useSchoolActivityLists from '../hooks/useSchoolActivityLists';
import { export_table_to_csv } from '../../../../utils/helper'

export default function LoginReport() {
      const {data: reports} = useSchoolActivityLists();
      const params = useParams();
      let report_type = params?.report_type;
      let label;
      const [formData, setFormData] = useState({});
      switch(report_type){
            case 'login-report':
                  label = 'Activity Report';
                  break;
            default:
                  label = "Report List"
                  break;      
            
      }
      let start_date = new Date(params?.startDate).toISOString().split('T')[0];
      let end_date = new Date(params?.endDate).toISOString().split('T')[0];
      const handleExport = () => {
            var html = document.querySelector("table").outerHTML;
            let file = `${label}_${start_date}_${end_date}`;
            export_table_to_csv(html, `${file}.csv`);
      }
      const logoutMutation = useLogoutUser();
      async function handleLogoutUser(){
            formData['school_id'] = params?.school_id
            await logoutMutation.mutate(formData);     
        }
      return (
            <div>
                 <div className="col-md-12 pl-0">
                  {!params?.user_id && (
                        <>
                        <h4>
                              {label} between {start_date} to {end_date}
                              <button className="btn btn-sm dark pull-right"
                              onClick={handleExport}>
                                    <span className="bi bi-download pr-2"></span>Export Activity Report
                              </button>
                              <button className="btn btn-sm mr-2 pull-right dark bg-danger"
                                    onClick={handleLogoutUser}>
                                    <span className="bi bi-signout"></span>
                                    Logout Previous Session
                              </button>      
                        </h4>
                        <hr />
                        </>
                  )}
                  </div> 

                        <div className={`col-md-12 ${!params?.report_id ? 'pl-0 pb-3': 'pr-3'}`} style={{ 
                              overflow: 'scroll scroll',
                              height: '390px',
                        }}>
                        <table className="table table-bordered">
                              
                        {!params?.user_id && (
                              <thead>
                                    <tr className="header flex pl-0">
                                    <th className="col-md-3">UniqueID</th>
                                    <th className="col-md-5">username</th>
                                    <th className="col-md-2">User Type</th>
                                    <th className="col-md-2">Status</th>
                                    <th className="col-md-2">Total Session</th>
                                    <th className="col-md-3">Login Time</th>
                                    <th className="col-md-3">Logout Time</th>
                              </tr>
                              </thead>   
                        )}
                        {!params?.user_id && (params?.report_type === 'login-report') && reports?.map(rep => {
                              let seconds;
                              let hour
                              let minute
                              let sec
                              let hourDifference;
                              if(rep?.user_log?.total_session){
                                    seconds = Math.floor(rep?.user_log?.total_session);
                                    hour = Math.floor(seconds/3600) 
                                    minute = Math.floor(seconds/60 - (hour * 60)) 
                                    sec = Math.floor(seconds - (hour * 3600 + minute * 60))
                                    hourDifference = `${hour} Hr ${minute} Min ${sec} Sec`
                              }else{
                                    hourDifference = `0 Hr 0 Min 0 Sec`
                              }
                              
                              let empid;
                              if(rep?.user_type == 'student'){
                                    empid = rep?.EmpId
                              }else if(rep?.user_type == 'teacher'){
                                    empid = rep?.EmpID
                              }else{
                                    empid = "";
                              }

                              let emailid;
                              if(rep?.user_type == 'student'){
                                    emailid = rep?.username
                              }else if(rep?.user_type == 'teacher'){
                                    emailid = rep?.username
                              }else{
                                    emailid = rep?.email;
                              }

                              return(
                              <tr className="pl-0 flex" key={rep?.report_id}>
                                    <td className="col-md-3">{empid}</td>  
                                    <td className="col-md-5">{emailid}</td>  
                                    <td className="col-md-2">{rep?.user_type}</td>  
                                    <td className="col-md-2">{JSON.stringify(rep?.user_log) == "null" ? 'Not Logged In' : 'Logged In'}</td>  
                                    <td className="col-md-2">{hourDifference}</td>  
                                    <td className="col-md-3">{JSON.stringify(rep?.user_log) !== "null" ? new Date(rep?.user_log?.login_time).toLocaleString(): JSON.stringify(rep?.user_log)}</td>  
                                    <td className="col-md-3">{JSON.stringify(rep?.user_log) !== "null" ? new Date(rep?.user_log?.logout_time).toLocaleString(): JSON.stringify(rep?.user_log)}</td>  
                              </tr>      
                              )})}
                              </table>      
                              </div>
                        
            </div>
      )
}
