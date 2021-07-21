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

                              <div className="row col-md-12 pl-3">
                                    <div className="border col-md-4">User Email</div>
                                    <div className="border col-md-2">User Type</div>
                                    <div className="border col-md-2 pl-3">Action</div>
                              </div>   
                        )}
                        {!params?.user_id && (params?.report_type === 'login-report') && reports?.map(rep => {
                              return(
                              <div className="col-md-12 pl-3 row"
                              style={{
                                    marginRight: '120px'
                              }}
                               key={rep?.report_id}>
                                    <div className="border col-md-4">{rep?._id.email_id}</div>  
                                    <div className="border col-md-2">{rep?._id?.user_type}</div>  
                                    <div className="border col-md-2">
                                    <button className="dark bg-success btn btn-sm"
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
