import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useLogoutUser from '../hooks/useLogoutUser';
import useSchoolActivityLists from '../hooks/useSchoolActivityLists';
import { export_table_to_csv } from '../../../../utils/helper'

export default function LoginReport() {
      const {data: reports} = useSchoolActivityLists();
      console.log(reports);
      const params = useParams();
      const history = useHistory();
      let report_type = params?.report_type;
      let label;
      switch(report_type){
            case 'login-report':
                  label = 'Login Report List';
                  break;
            default:
                  label = "Report List"
                  break;      
            
      }
      const handleExport = () => {
            var html = document.querySelector("table").outerHTML;
            export_table_to_csv(html, "table.csv");
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
                              {label} between {new Date(params?.startDate).toISOString().split('T')[0]} to {new Date(params?.endDate).toISOString().split('T')[0]}
                              <button className="btn btn-sm dark pull-right"
                              onClick={handleExport}>
                                    <span className="bi bi-download pr-2"></span>Export Report
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
                              marginRight: '120px'
                        }}>
                        <table className="table table-bordered">
                              
                        {!params?.user_id && (
                              <tr className="flex header col-md-12 pl-0">
                                    <th className="col-md-4">Name</th>
                                    <th className="col-md-5">Email</th>
                                    <th className="col-md-1">Type</th>
                                    <th className="col-md-2">Session</th>
                                    <th className="col-md-3">Login</th>
                                    <th className="col-md-3">Logout</th>
                              </tr>   
                        )}
                        {!params?.user_id && (params?.report_type === 'login-report') && reports?.map(rep => {
                              let seconds;
                              let hour
                              let minute
                              let sec
                              let hourDifference;
                              if(rep?.total_session){
                                    seconds = Math.floor(rep?.total_session);
                                    hour = Math.floor(seconds/3600) 
                                    minute = Math.floor(seconds/60 - (hour * 60)) 
                                    sec = Math.floor(seconds - (hour * 3600 + minute * 60))
                                    hourDifference = `${hour} Hr ${minute} Min ${sec} Sec`
                              }else{
                                    hourDifference = `0 Hr 0 Min 0 Sec`
                              }
                              

                              return(
                              <tr className="col-md-12 pl-0 flex"
                              style={{
                                    marginRight: '120px'
                              }}
                               key={rep?.report_id}>
                                    <td className="col-md-4 pl-2">
                                    {rep?.sessionInProgress === false 
                                    ? <span className="fa fa-circle text-danger"></span> 
                                    : <span className="fa fa-circle text-success"></span>}
                                    <span className="ml-2">{rep?.user_name}</span>
                                    </td>  
                                    <td className="col-md-5">{rep.email_id}</td>  
                                    <td className="col-md-1">{rep.user_type}</td>  
                                    <td className="col-md-2">{hourDifference}</td>  
                                    <td className="col-md-3">{new Date(rep.login_time).toLocaleString()}</td>  
                                    <td className="col-md-3">{rep.logout_time ? new Date(rep.logout_time).toLocaleString(): 'Online'}</td>  
                              </tr>      
                              )})}
                              </table>      
                              </div>
                        
            </div>
      )
}
