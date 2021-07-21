import React, {useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useAttemptedStudents from '../hooks/useAttemptedStudents';

export default function StudentList() {
      const history = useHistory();
      const params = useParams();
      const {data:attemtedStudetns} = useAttemptedStudents();
      const viewResult = async (id) => {
            Array.from(document.querySelectorAll('.answerDiv')).map( data => {
                  let divId = data?.id;
                  let did = divId.split('-')[1]
                  if(did === id && document.getElementById(`btn-${id}`).value === 'View'){
                        document.getElementById(`result-${id}`).style.display = "block"
                        document.getElementById(`btn-${id}`).value = "Hide"
                        document.getElementById(`btn-${id}`).classList.remove('fa-eye')
                        document.getElementById(`btn-${id}`).classList.add('fa-eye-slash')   
                  }else{
                        document.getElementById(`btn-${did}`).value = "View"
                        document.getElementById(`btn-${did}`).classList.remove('fa-eye-slash')
                        document.getElementById(`btn-${did}`).classList.add('fa-eye')
                        document.getElementById(`result-${did}`).style.display = "none"
                  }
            })
            
      }
      useEffect(() => {
            const script = document.createElement("script");
            script.id = 'editor';
            script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
            script.async = true;
            document.body.appendChild(script);
        },[])
      return (
            <div>
                 <div className="col-md-12 pl-0">
                              <h4>Student List
                                    <button className="btn btn-sm dark pull-left mr-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/single-test`)
                                    }}>
                                          Back
                                    </button>
                              </h4>

                              <hr />
                        </div> 
                        <div className={`col-md-12 pl-0 pb-3`} style={{ overflow: 'scroll hidden'}}>
                        
                              <div className="flex col-md-12 pl-0 pr-0">
                                    <div className="border col-md-2">#ID</div>
                                    <div className="border col-md-3">Student</div>
                                    <div className="border col-md-1">Class</div>
                                    <div className="border col-md-1">Roll</div>
                                    <div className="border col-md-1">Section</div>
                                    <div className="border col-md-2">Test Name</div>
                                    <div className="border col-md-1">Marks</div>
                                    <div className="border col-md-2">Percentage(%)</div>
                                    <div className="border col-md-2">Time Taken</div>
                                    <div className="border col-md-1">Duration</div>
                                    <div className="border col-md-1">Window</div>
                                    <div className="border col-md-3">Test Start Date</div>
                                    <div className="border col-md-3">Test End Date</div>
                              </div>
                         
                        {attemtedStudetns?.map(student => {
                              let questions = student?.questions;
                              let total_question = questions.length;
                              
                              let correct_answer = questions.map(que => {
                                    var total = 0;
                                    if(student.test_type === 'mock-test'){
                                          if((que.answer === 'yes' ? 'a' : 'b') === que?.correct_answer){
                                                total = +total + 1;
                                          }else{
                                                total = +total + 0;
                                          }
                                    }else{
                                          if(que?.option === que.correct_option){
                                                total = +total + 1;
                                          }else{
                                                total = +total + 0;
                                          }
                                    }
                                    
                                    return total;
                              })
                              let end_window = new Date(student?.start_date)
                              end_window.setMinutes( end_window.getMinutes() + student?.test_window );
                              let total_time = student?.time_taken;
                              let minute = Math.floor(total_time/60);
                              let seconds = total_time - minute * 60
                              return(
                                    <>
                                    <div className="flex col-md-12 pl-0 pr-0" key={student?._id}>
                                          <div className="border col-md-2">
                                                <span className="fa fa-eye pr-2" style={{
                                                      display: 'inline-block',
                                                      cursor: 'pointer'
                                                }}
                                                id={`btn-${student?._id}`}
                                                value="View"
                                                onClick={e => {
                                                      viewResult(student?._id)
                                                }}></span>
                                                {student?.student_emp_id}
                                          </div>
                                          <div className="border col-md-3">{student?.student_name}</div>
                                          <div className="border col-md-1">{student?.student_class_name}</div>
                                          <div className="border col-md-1">{student?.student_roll_no}</div>
                                          <div className="border col-md-1">{student?.section}</div>
                                          <div className="border col-md-2">{student?.test_name}</div>
                                          <div className="border col-md-1">{correct_answer.reduce((a,b) => a+b)}/{total_question}</div>
                                          <div className="border col-md-2">{Math.round(correct_answer.reduce((a,b) => a+b)*100/total_question)}%</div>
                                          <div className="border col-md-2">{minute} Min {seconds} Sec</div>
                                          <div className="border col-md-1">{student?.test_duration} Min</div>
                                          <div className="border col-md-1">{student?.test_window} Min</div>
                                          <div className="border col-md-3">{new Date(student?.start_date).toLocaleString()}</div>
                                          <div className="border col-md-3">{end_window.toLocaleString()}</div>
                                    </div>
                                    <div className="border answerDiv pl-2 pr-2 pb-2 pt-2" 
                                    id={`result-${student?._id}`}
                                    style={{
                                          width: '1200px',
                                          height: 'auto',
                                          display: 'none'
                                    }}>
                                         {student?.questions?.map( (ques, indx) => {
                                               return(
                                                     <div className="border mb-2">
                                                      <div className="col-md-12 flex" style={{
                                                            
                                                            justifyContent: 'flex-start'
                                                      }}>
                                                      Ques: {indx+1}
                                                      <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.question  }}></span>
                                                      </div>
                                                      <hr className="mb-2 mt-1"/>
                                                      {params?.test_type === 'mock-test' && (
                                                      <div className="flex col-md-12">
                                                           <span>Option A: {ques?.option_a}</span>
                                                           <span>Option B: {ques?.option_b}</span>
                                                           <span>Correct Answer: {ques?.correct_answer}</span>
                                                           <span>
                                                           {(ques?.answer == "no" ? 'b': 'a') === ques?.correct_answer 
                                                                  ? 
                                                                  <span className="fa fa-check-circle pr-2 text-success"></span>
                                                                  :
                                                                  <span className="fa fa-times-circle pr-2 text-danger"></span>
                                                            }
                                                            User Answer: {ques?.answer}
                                                            </span>
                                                      </div>
                                                      )}
                                                      
                                                      {params?.test_type === 'single-test' && (
                                                      <div className="flex col-md-12"
                                                      style={{
                                                            flexWrap: 'wrap'
                                                      }}>
                                                           <div className="col-md-6 card mb-2">Option A: 
                                                            <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.option_a  }}></span>
                                                           </div>
                                                           
                                                           <div className="col-md-6 card mb-2">Option B: 
                                                           <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.option_b  }}></span>
                                                           </div>
                                                           
                                                           <div className="col-md-6 card mb-2">Option C: 
                                                           <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.option_c  }}></span>
                                                           </div>
                                                           
                                                           <div className="col-md-6 card mb-2">Option D: 
                                                           <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.option_d  }}></span>
                                                           </div>
                                                           
                                                           <div className="col-md-12 mb-2 mr-2" style={{
                                                                 border: '1px solid #cdcdcd'
                                                           }}>
                                                            <span className="fa fa-check-circle pr-2 text-success"></span>
                                                            Correct Answer: <b>{ques?.correct_option}</b>
                                                           
                                                           <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.correct_answer  }}></span>
                                                           </div>

                                                           <div className="col-md-12 mb-2 mr-2" style={{
                                                                 border: '1px solid #cdcdcd'
                                                           }}>
                                                           {ques?.option === ques?.correct_option 
                                                                  ? 
                                                                  <span className="fa fa-check-circle pr-2 text-success"></span>
                                                                  :
                                                                  <span className="fa fa-times-circle pr-2 text-danger"></span>
                                                            }
                                                            User Answer: <b>{ques?.option}</b>
                                                            <span className="question ml-2" dangerouslySetInnerHTML={{ __html: ques?.answer  }}></span>
                                                            </div>
                                                      </div>
                                                      )}

                                                      </div>
                                               )
                                         })}       
                                    </div>      
                                    </>
                              );
                        })}
                        </div>
            </div>
      )
}
