import React, {useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useAttemptedStudents from '../hooks/useAttemptedStudents';
import { export_table_to_csv } from '../../../../utils/helper'

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
      // useEffect(() => {
      //       const script = document.createElement("script");
      //       script.id = 'editor';
      //       script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
      //       script.async = true;
      //       document.body.appendChild(script);
      //   },[]);
      const handleExport = (e) => {
      e.preventDefault()      
      var html = document.querySelector("table").outerHTML;
      // console.log(html);      
      export_table_to_csv(html, "table.csv");
      }
      
      return (
            <div>
                 <div className="col-md-12 pl-0">
                              <h4>Student List
                                    <button className="btn btn-sm dark pull-left mr-2"
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${params?.test_type}`)
                                    }}>
                                          Back
                                    </button>
                                    
                                    <button className="btn btn-sm dark pull-right mr-2"
                                    onClick={handleExport}>
                                          Export Report
                                    </button>

                              </h4>

                              <hr />
                        </div> 
                        <div style={{ 
                              overflow: 'scroll scroll',
                              height: '450px',
                              marginBottom: '50px',
                              paddingBottom: '100px'
                        }}
                        className={`table table-responsive col-md-12 pl-0 pb-4 pr-3 mb-3`}
                        >
                             <table className="table table-bordered">
                              <tr className="flex col-md-12 pl-0 pr-0">
                                    <th className="border col-md-4">Student</th>
                                    <th className="border col-md-1">Class</th>
                                    <th className="border col-md-1">Roll</th>
                                    <th className="border col-md-1">Section</th>
                                    <th className="border col-md-3">Test Name</th>
                                    <th className="border col-md-1">Obtain Marks</th>
                                    <th className="border col-md-1">Ques.</th>
                                    <th className="border col-md-1">Total Marks</th>
                                    <th className="border col-md-2">Percentage(%)</th>
                                    <th className="border col-md-2">Time Taken</th>
                                    <th className="border col-md-2">Duration</th>
                                    <th className="border col-md-2">Test Close</th>
                                    <th className="border col-md-2">Window</th>
                                    <th className="border col-md-3">Test Start Date</th>
                                    <th className="border col-md-3">Test End Date</th>
                              </tr>
                         
                        {attemtedStudetns?.map(student => {
                              let questions = student?.questions;
                              let total_question = questions.length;
                              let total_marks = student.total_marks;
                              let single_marks = Math.floor(+total_marks/+total_question)
                              let correct_answer = questions.map(que => {
                                    var total = 0;
                                    if(student.test_type === 'mock-test'){
                                          if((que.answer === 'yes' ? 'a' : 'b') === que?.correct_answer){
                                                total = +total + 1;
                                          }else{
                                                total = 0;
                                          }
                                    }else{
                                          if(que?.option === undefined || que?.option === null){
                                                total = 0;
                                          }else{
                                                if(que?.option === que.correct_option){
                                                      total = +single_marks;
                                                }else{
                                                      total = 0;
                                                }
                                          }
                                    }
                                    
                                    return total;
                              })
                              let end_window = new Date(student?.start_date)
                              end_window.setMinutes( end_window.getMinutes() + student?.test_window );
                              let total_time = student?.time_taken;
                              let hourDifference;
                              if(total_time !== undefined){
                                    let seconds = Math.floor(total_time);
                                    let hour = Math.floor(seconds/1000/3600) 
                                    let minute = Math.floor(seconds/1000/60 - (hour * 60)) 
                                    let sec = Math.floor(seconds/1000 - (hour * 3600 + minute * 60))
                                    hourDifference = `${(hour === 'NaN') ? 0 : hour} Hr ${(minute === 'NaN') ? 0 : minute} Min ${(sec === 'NaN') ? 0 : sec} Sec`

                              }else{
                                    hourDifference = `0 Hr 0 Min 0 Sec`
                              }
                              let mark_obtain = correct_answer.reduce((a,b) => a+b)
                              return(
                                    <>
                                    <tr className="flex col-md-12 pl-0 pr-0" key={student?._id}>
                                          <td className="border col-md-4">
                                                {/* <span className="fa fa-eye pr-2" style={{
                                                      display: 'inline-block',
                                                      cursor: 'pointer'
                                                }}
                                                id={`btn-${student?._id}`}
                                                value="View"
                                                onClick={e => {
                                                      viewResult(student?._id)
                                                }}></span> */}
                                                {student?.student_name}
                                          </td>
                                          
                                          <td className="border col-md-1">{student?.student_class_name}</td>
                                          <td className="border col-md-1">{student?.student_roll_no}</td>
                                          <td className="border col-md-1">{student?.section}</td>
                                          <td className="border col-md-3">{student?.test_name}</td>
                                          <td className="border col-md-1">{mark_obtain}</td>
                                          <td className="border col-md-1">{total_question}</td>
                                          <td className="border col-md-1">{total_marks}</td>
                                          <td className="border col-md-2">{Math.round(mark_obtain*100/total_marks)}%</td>
                                          <td className="border col-md-2">{hourDifference}</td>
                                          <td className="border col-md-2">{student?.test_duration} Min</td>
                                          <td className="border col-md-2">{student?.completion_status}</td>
                                          <td className="border col-md-2">{student?.test_window} Min</td>
                                          <td className="border col-md-3">{new Date(student?.start_date).toLocaleString()}</td>
                                          <td className="border col-md-3">{end_window.toLocaleString()}</td>
                                    </tr>
                                        
                                    </>
                              );
                        })}
                        </table> 
                        </div>
                        
            </div>
      )
}
