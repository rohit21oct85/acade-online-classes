import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useSchoolAssignedTests from '../hooks/useSchoolAssignedTests';

export default function SingleTestList() {
      const {data: reports} = useSchoolAssignedTests();
      console.log("Reports ",reports);
      const params = useParams();
      const history = useHistory();
      let test_type = params?.test_type;
      let label;
      switch(test_type){
            case 'mock-test':
                  label = 'Mock Test List';
                  break;
            case 'single-test':
                  label = 'Assign Test List'
                  break;
            
            case 'upload-test':
                  label = 'Teacher Assign Test List'
                  break;
            default:
                  label = "Test List"
                  break;      
            
      }

      return (
            <div>
                 <div className="col-md-12 pl-0">
                  {!params?.test_id && (
                        <>
                        <h4>{label}</h4>
                        <hr />
                        </>
                  )}
                  </div> 
                  <div className={`${!params?.test_id ? 'pl-0 pb-3': ''}`} style={{ 
                        overflow: 'scroll hidden',
                        marginRight: '120px'
                  }}>
                  
                        {!params?.test_id && (

                              <div className="flex col-md-12 pl-0">
                                    <div className="border col-md-3">Test Name</div>
                                    <div className="border col-md-3">Test Type</div>
                                    <div className="border col-md-3">Test Subjects</div>
                                    <div className="border col-md-2">Attempted Students</div>
                                    <div className="border col-md-2">Test Window</div>
                                    <div className="border col-md-2">Test Duration</div>
                                    <div className="border col-md-2">Total Question</div>
                                    <div className="border col-md-3">Start Date</div>
                                    <div className="border col-md-3">End Date</div>
                                    <div className="border pl-3" style={{ 
                                          position: 'fixed', 
                                          width: '150px',
                                          right: '25px',
                                          background: 'white'
                                    }}>Action</div>
                              </div>   
                        )}
                        {!params?.test_id && (params?.test_type === 'single-test' || params?.test_type === 'mock-test' || params?.test_type === 'upload-test') && reports?.map(rep => {
                              let tsubjects;
                              if(rep?.test_subjects !== null){
                                    if(rep?.test_subjects?.length > 0){
                                          tsubjects = Array.prototype.map.call(rep?.test_subjects, function(items) { return items.subject_name}).join(', ');
                                    }else{
                                          tsubjects = ""
                                    }
                              }else{
                                    tsubjects = "No Subjects"
                              }
                              let test_window = new Date(rep?.start_date)
                              test_window.setMinutes( test_window.getMinutes() + rep?.test_window );
                              if(rep?.assigned === true)
                              return(
                              <div className="col-md-12 pl-0 flex"
                              style={{
                                    marginRight: '120px'
                              }}
                               key={rep?.test_id}>
                                    <div className="border col-md-3">{rep?.test_name}</div>  
                                    <div className="border col-md-3">{rep?.test_type}</div>  
                                    <div className="border col-md-3">{tsubjects}</div>  
                                    <div className="border col-md-2">{rep.attemptedStudentIds?.length}</div>  
                                    <div className="border col-md-2">{rep?.test_window}</div>  
                                    <div className="border col-md-2">{rep?.test_duration}</div>  
                                    <div className="border col-md-2">{rep?.total_question}</div>  
                                    <div className="border col-md-3">{new Date(rep?.start_date).toLocaleString()}</div>  
                                    <div className="border col-md-3">{test_window.toLocaleString()}</div>  
                                    <div className="border"
                                    style={{ 
                                          position: 'fixed', 
                                          width: '150px',
                                          right: '25px',
                                          background: 'white'
                                    }}>
                                    <button className="dark bg-success btn btn-sm"
                                    style={{
                                          width: '100%'
                                    }}
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${params?.test_type}/student-report/${params?.test_type == 'upload-test'? rep?._id : rep?.test_id}`)
                                    }}>
                                          View Results
                                    </button>
                                    </div>  
                                    
                              </div>      
                              )
                        })}
                        </div>
                        
            </div>
      )
}
