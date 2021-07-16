import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useAttemptedStudents from '../hooks/useAttemptedStudents';

export default function StudentList() {
      const history = useHistory();
      const params = useParams();
      const {data:attemtedStudetns} = useAttemptedStudents();
      console.log(attemtedStudetns)
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
                                    <div className="border col-md-2">Student</div>
                                    <div className="border col-md-2">Test Name</div>
                                    <div className="border col-md-2">Time Taken</div>
                                    <div className="border col-md-2">Duration</div>
                                    <div className="border col-md-2">Window</div>
                                    <div className="border col-md-1">Question</div>
                                    <div className="border col-md-1">Marks</div>
                                    <div className="border col-md-2">Percentage(%)</div>
                                    <div className="border col-md-3">Start Date</div>
                                    <div className="border col-md-3">End Date</div>
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
                                    <div className="flex col-md-12 pl-0 pr-0" key={student?._id}>
                                          <div className="border col-md-2">{student?.emp_id}</div>
                                          <div className="border col-md-2">{student?.student_name}</div>
                                          <div className="border col-md-2">{student?.test_name}</div>
                                          <div className="border col-md-2">{minute} Min {seconds} Sec</div>
                                          <div className="border col-md-2">{student?.test_duration} Min</div>
                                          <div className="border col-md-2">{student?.test_window} Min</div>
                                          <div className="border col-md-1">{total_question}</div>
                                          <div className="border col-md-1">{correct_answer.reduce((a,b) => a+b)}/{total_question}</div>
                                          <div className="border col-md-2">{Math.round(correct_answer.reduce((a,b) => a+b)*100/total_question)}%</div>
                                          <div className="border col-md-3">{new Date(student?.start_date).toLocaleString()}</div>
                                          <div className="border col-md-3">{end_window.toLocaleString()}</div>

                                    </div>
                              );
                        })}
                        </div>
            </div>
      )
}
