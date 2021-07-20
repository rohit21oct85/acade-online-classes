import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useSchoolActivityLists from '../hooks/useSchoolActivityLists';

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

      return (
            <div>
                 <div className="col-md-12 pl-0">
                  {!params?.report_id && (
                        <>
                        <h4>{label}</h4>
                        <hr />
                        </>
                  )}
                  </div> 
                  <div className={`${!params?.report_id ? 'pl-0 pb-3': ''}`} style={{ 
                        overflow: 'scroll hidden',
                        marginRight: '120px'
                  }}>
                        {!params?.report_id && (

                              <div className="flex col-md-12 pl-0">
                                    <div className="border col-md-1">Status</div>
                                    <div className="border col-md-4">User Email</div>
                                    <div className="border col-md-3">Login Time</div>
                                    <div className="border col-md-3">Logout Time</div>
                                    <div className="border col-md-2">Activity</div>
                                    <div className="border col-md-2">User Type</div>
                                    <div className="border col-md-2">Device Type</div>
                                    <div className="border pl-3" style={{ 
                                          position: 'fixed', 
                                          width: '120px',
                                          right: '25px',
                                          background: 'white'
                                    }}>Action</div>
                              </div>   
                        )}
                        {!params?.report_id && (params?.report_type === 'login-report') && reports?.map(rep => {
                              let startTime = new Date(rep?._id?.login_time);
                              let endTime;
                              if(rep?._id?.logout_time !== undefined){
                                    endTime   = new Date(rep?._id?.logout_time);
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
                                    marginRight: '120px'
                              }}
                               key={rep?.report_id}>
                                    <div className="border col-md-1">{rep?._id?.sessionInProgress == false ? <span className="fa fa-circle text-danger"></span>: <span className="fa fa-circle text-success"></span>}</div>  
                                    <div className="border col-md-4">{rep?._id.email_id}</div>  
                                    <div className="border col-md-3">{new Date(rep?._id?.login_time).toLocaleString()}</div>  
                                    <div className="border col-md-3">{(rep?._id?.logout_time !== undefined) ? new Date(rep?._id?.logout_time).toLocaleString(): 'Not Logout'}</div>  
                                    <div className="border col-md-2">{hourDifference}</div>  
                                    <div className="border col-md-2">{rep?._id?.user_type}</div>  
                                    <div className="border col-md-2">{rep?._id?.device_type}</div>  
                                    <div className="border"
                                    style={{ 
                                          position: 'fixed', 
                                          width: '120px',
                                          right: '25px',
                                          background: 'white'
                                    }}>
                                    <button className="dark bg-success btn btn-sm"
                                    style={{
                                          width: '100%'
                                    }}
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${params?.test_type}/student-report/${params?.test_type == 'upload-test'? rep?._id : rep?.report_id}`)
                                    }}>
                                          View
                                    </button>
                                    </div>  
                                    
                              </div>      
                              )
                        })}
                        </div>
                        
            </div>
      )
}
