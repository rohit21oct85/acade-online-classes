import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useAllStudents from '../../student/hooks/useAllStudents';
import useSchoolAssignedTests from '../hooks/useSchoolAssignedTests';
import { export_table_to_csv } from '../../../../utils/helper'
import { makePdf } from '../../../../utils/helper';
export default function SingleTestList() {
      const {data: reports} = useSchoolAssignedTests();
      const {data:total_students} = useAllStudents();
      const params = useParams();
      const history = useHistory();
      let test_type = params?.test_type;
      let label;
      switch(test_type){
            case 'mock-test':
                  label = 'Mock Test List';
                  break;
            case 'combine-test':
                  label = 'Rivision Test List';
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
      const handleExport = (e) => {
            e.preventDefault()      
            var html = document.querySelector("table").outerHTML;
            // console.log(html);   
            let testDate = new Date(reports[0].start_date).toISOString().split('T')[0];
            let testName = reports[0].test_name;
            export_table_to_csv(html, `${testName}-Report_${testDate}.csv`);
      }

      const callPdf = (e) => {
            let id = "#school-report";
            let rclass = document?.getElementById("rclass");
            let classname = rclass.options[rclass.selectedIndex].getAttribute('data-class')
            let rschool = document?.getElementById("rschool");
            let schoolname = rschool.options[rschool.selectedIndex].getAttribute('data-school')
            makePdf(e, id, `${label} for class ${classname}`, schoolname)
      }

      return (
            <div>
                 <div className="col-md-12 pl-0">
                  {!params?.test_id && (
                        <>
                        <h4>{label}
                        <button className="btn btn-sm dark pull-right mr-2"
                        onClick={handleExport}>
                              <span className="fa fa-download mr-2"></span>
                              Export Report
                        </button>
                        {/* <button className="btn btn-sm dark pull-right mr-2"
                        onClick={(e)=>{callPdf(e)}}>
                              <span className="fa fa-download mr-2"></span>
                              Export Pdf
                        </button> */}
                        </h4>
                        <hr />
                        </>
                  )}
                  </div> 
                  <div className={`${!params?.test_id ? 'pl-0 pb-3 table table-responsive': ''}`} style={{ 
                        overflow: 'scroll hidden',
                        marginRight: '100px'
                  }}>
                        <table id="school-report">
                        
                        {!params?.test_id && (
                              // <thead>
                              <tr className="flex header pl-0">
                                    <th className="border col-md-3">Test Name</th>
                                    <th className="border col-md-2">Test Type</th>
                                    <th className="border col-md-3">Test Subjects</th>
                                    <th className="border col-md-2">Attempted Students</th>
                                    <th className="border col-md-2">Total Students</th>
                                    <th className="border col-md-3">Unattempted Students</th>
                                    <th className="border col-md-2">Test Window</th>
                                    <th className="border col-md-2">Test Duration</th>
                                    <th className="border col-md-2">Total Question</th>
                                    <th className="border col-md-3">Start Date</th>
                                    <th className="border col-md-4">End Date</th>
                                    <th className="border pl-3 hidden_col" style={{ 
                                          position: 'fixed', 
                                          width: '190px',
                                          right: '25px',
                                          background: 'white'
                                    }}>Action</th>
                              </tr> 
                              // </thead>  
                        )}
                        {!params?.test_id && (params?.test_type === 'single-test' || params?.test_type === 'mock-test' || params?.test_type === 'upload-test' || params?.test_type === 'combine-test') && reports?.map(rep => {
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
                              <tr className="pl-0 flex" key={rep?.test_id}>
                                    <td className="border col-md-3">{rep?.test_name}</td>  
                                    <td className="border col-md-2">{rep?.test_type}</td>  
                                    <td className="border col-md-3">{tsubjects}</td>  
                                    <td className="border col-md-2">{params?.test_type === 'mock-test' ? rep.attemptedStudents : rep?.attemptedStudentIds?.length}</td>  
                                    <td className="border col-md-2">{total_students}</td>  
                                    <td className="border col-md-3">{total_students - (params?.test_type === 'mock-test' ? rep.attemptedStudents : rep?.attemptedStudentIds?.length)}</td>  
                                    <td className="border col-md-2">{rep?.test_window}</td>  
                                    <td className="border col-md-2">{rep?.test_duration}</td>  
                                    <td className="border col-md-2">{rep?.total_question}</td>  
                                    <td className="border col-md-3">{new Date(rep?.start_date).toLocaleString()}</td>  
                                    <td className="border col-md-4">{test_window.toLocaleString()}</td>  
                                    <td className="border hidden_col"
                                    style={{ 
                                          position: 'fixed', 
                                          width: '190px',
                                          right: '25px',
                                          background: 'white'
                                    }}>
                                    <button className="dark bg-success btn btn-block btn-sm"
                                    style={{
                                          width: '100%'
                                    }}
                                    onClick={() => {
                                          history.push(`/admin/school-report/${params?.school_id}/${params?.class_id}/${params?.test_type}/student-report/${params?.test_type == 'upload-test'? rep?._id : rep?.test_id}`)
                                    }}>
                                          View Results
                                    </button>
                                    </td>  
                              </tr>      
                              )
                        })}
                        </table>
                        </div>
                        
            </div>
      )
}
