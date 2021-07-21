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
                  {!params?.user_id && (
                        <>
                        <h4>{label}</h4>
                        <hr />
                        </>
                  )}
                  </div> 

                        <div className={`${!params?.report_id ? 'pl-0 pb-3': ''}`} style={{ 
                              overflow: 'scroll scroll',
                              height: '390px',
                              marginRight: '120px'
                        }}>
                        {!params?.user_id && (

                              <div className="flex col-md-12 pl-3">
                                    <div className="border col-md-1">status</div>
                                    <div className="border col-md-3">userName</div>
                                    <div className="border col-md-4">User Email</div>
                                    <div className="border col-md-2">Total Session</div>
                                    <div className="border col-md-2 pl-3">Action</div>
                              </div>   
                        )}
                        {!params?.user_id && (params?.report_type === 'login-report') && reports?.map(rep => {
                              let seconds = Math.floor(rep?.total_session);
                              let hour = Math.floor(seconds/3600) 
                              let minute = Math.floor(seconds/60 - (hour * 60)) 
                              let sec = Math.floor(seconds - (hour * 3600 + minute * 60))
                              let hourDifference = `${hour} Hr ${minute} Min ${sec} Sec`
                              return(
                              <div className="col-md-12 pl-3 flex"
                              style={{
                                    marginRight: '120px'
                              }}
                               key={rep?.report_id}>
                                    <div className="border col-md-1">{rep?._id?.sessionInProgress === false ? <span className="fa fa-circle text-danger"></span> : <span className="fa fa-circle text-success"></span>}</div>  
                                    <div className="border col-md-3">{rep?._id?.user_name}</div>  
                                    <div className="border col-md-4">{rep?._id.email_id}</div>  
                                    <div className="border col-md-2">{hourDifference}</div>  
                                    <div className="border col-md-2 p-0">
                                    <button className="dark bg-success p-0 btn btn-sm"
                                    style={{
                                          width: '100%'
                                    }}
                                    onClick={() => {
                                          history.push(`/admin/activity-report/${params?.school_id}/${params?.user_type}/activity-detail/${rep?._id?.user_id}`)
                                    }}>
                                          View
                                    </button>
                                    </div>  
                                    
                              </div>      
                              )})}
                              </div>
                        
            </div>
      )
}
