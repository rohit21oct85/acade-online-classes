import React, {useState} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useActivityDetails from '../hooks/useActivityDetails';
import useLogoutUser from '../hooks/useLogoutUser';

export default function LoginActivityDetails() {
      const {data: reports} = useActivityDetails();
      const params = useParams();
      const history = useHistory();
      let report_type = params?.report_type;
      const [formData, SetFormData] = useState({});
      let label;
      switch(report_type){
            case 'activity-detail':
                  label = 'Activity Details';
                  break;
            default:
                  label = "Report List"
                  break;      
            
      }
      const logoutMutation = useLogoutUser();
      async function handleLogoutUser(){
          formData['school_id'] = params?.school_id
          formData['student_id'] = params?.user_id
          await logoutMutation.mutate(formData);     
      }
      return (
            <div>
                 <div className="col-md-12 pl-0">
                  {params?.user_id && (
                        <>
                        <h4>
                              <button className="btn btn-sm dark bg-success mr-2"
                              onClick={() => {
                                    history.push(`/admin/activity-report/${params?.school_id}/${params?.user_type}/login-report/`)
                              }}>
                                    Back
                              </button>
                              {label}
                              
                        <button className="btn btn-sm pull-right dark bg-danger"
                        onClick={handleLogoutUser}>
                              Logot User
                        </button>
                        </h4>
                        <hr />
                        </>
                  )}
                  </div> 

                        <div className={`${params?.user_id ? 'pl-0 pb-3': ''}`} style={{ 
                              overflow: 'scroll scroll',
                              height: '390px',
                              marginRight: '50px'
                        }}>
                        {params?.user_id && (

                              <div className="flex col-md-12 pl-0">
                                    <div className="border col-md-4">User Email</div>
                                    <div className="border col-md-3">Login Time</div>
                                    <div className="border col-md-3">Logout Time</div>
                                    <div className="border col-md-2">Activity</div>
                                    
                              </div>   
                        )}
                        {params?.user_id && (params?.report_type === 'activity-detail') && reports?.map(rep => {
                              let startTime = new Date(rep?.login_time);
                              let endTime;
                              if(rep?.logout_time !== undefined){
                                    endTime   = new Date(rep?.logout_time);
                              }else{
                                    endTime   = new Date();
                              }
                              var seconds = (endTime.getTime() - startTime.getTime()) / 1000;
                              let hour = Math.floor(seconds/3600) 
                              let minute = Math.floor(seconds/60 - (hour * 60)) 
                              let sec = Math.floor(seconds - (hour * 3600 + minute * 60))
                              let hourDifference = `${hour} Hr ${minute} Min ${sec} Sec`
                              return(
                              <div className="col-md-12 pl-0 flex"
                              style={{
                                    marginRight: '70px'
                              }}
                               key={rep?.report_id}>
                                    <div className="border col-md-4">{rep.email_id}</div>  
                                    <div className="border col-md-3">{new Date(rep?.login_time).toLocaleString()}</div>  
                                    <div className="border col-md-3">{(rep?.logout_time !== undefined) ? new Date(rep?.logout_time).toLocaleString(): 'Not Logout'}</div>  
                                    <div className="border col-md-2">{hourDifference}</div>  
                              </div>      
                              )})}
                              </div>
                        
            </div>
      )
}
