import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getFilteredData } from '../../../../utils/helper';
import useCreateAssignTest from '../hooks/useCreateAssignTest';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import * as helper from '../../../../utils/helper'

import useClassList from '../../class/hooks/useClassList';
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import useTeacherSubject from '../../../../hooks/teacherSubjectMapping/useTeacherSubject';
import useTestByClassSubject from '../../unitTest/hooks/useTestByClassSubject';

export default function CreateAssignTest() {
      const params = useParams();
      
      const history = useHistory();
      const page_type = params?.page_type;
      const school_id = params?.school_id;
      const class_id = params?.class_id;
      const subject_id = params?.subject_id;
      const teacher_id = params?.teacher_id;

      const {data: schools}    = useSchoolLists();
      const {data: SClass}     = useClassList();
      const {data: SSubjects}  = useClassSubjectList();
      const {data: teachers}   = useTeacherSubject();
      const {data: unitTests}      = useTestByClassSubject();

      const [formData, setFormData] = useState({});
      
      const createMutation = useCreateAssignTest(formData);
      function handleCheckAll(){
            let moduleCheked = document.getElementById("checkAll").checked;
            Array.from(document.getElementsByName('test')).map(elem => {
                  if(moduleCheked){
                        elem.checked = true;
                  }else{
                        elem.checked = false;

                  }
            })
      }
      async function handleSubmit(e){
            e.preventDefault();
            let school_id = params?.school_id
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            let teacher_id = params?.teacher_id
            
            let school_name = helper.getFilteredData(schools, '_id', school_id,'school_name');
            let class_name = getFilteredData(SClass,'_id' ,class_id, 'class_name');
            let subject_name = getFilteredData(SSubjects,'subject_id' , subject_id, 'subject_name');
            let teacher_name = getFilteredData(teachers,'teacher_id' , teacher_id, 'teacher_name');
            let mainData = []
            Array.from(document.getElementsByName('test')).map(elem => {
                 if(elem.checked = true){
                   mainData.push({
                        'school_id':  school_id,
                        'school_name':  school_name,
                        'class_id':  class_id,
                        'class_name':  class_name,
                        'subject_id':  subject_id,
                        'subject_name':  subject_name,
                        'teacher_id':  teacher_id,
                        'teacher_name':  teacher_name,
                        'test_id': elem.value
                   })
                 }
                 
            })
            console.log(mainData);
            await createMutation.mutate(mainData);
            
      }
      return (
            <div>
                  
                  <p className="form-heading">
                  <span className="fa fa-plus-circle mr-2"></span>Assign New Test
                  </p>
                  <hr className="mt-1"/>
            
            {params?.page_type === 'create' && (
                          
            <form>
                  <div className="row">
                        <div className="col-md-3">
                              <select className="form-control"
                              value={school_id}
                              onChange={e => {
                                    if(e.target.value !== '_')
                                    history.push(`/admin/assign-test/${page_type}/${e.target.value}`)
                              }}
                              >
                                    <option className="_">Schools</option>
                                    {schools?.map(school => 
                                          <option value={school?._id} key={school?._id}>{school?.school_name}</option>
                                    )}
                              </select>
                        </div>
                        
                        <div className="col-md-3">
                        <select className="form-control"
                              value={class_id}
                              onChange={e => {
                                    history.push(`/admin/assign-test/${page_type}/${school_id}/${e.target.value}`)
                              }}
                              >
                                    <option className="_">Classess</option>
                                    {SClass?.map(scl => 
                                          <option value={scl?._id} key={scl?._id}>{scl?.class_name}</option>
                                    )}
                              </select>
                        </div>
                        
                        <div className="col-md-3">
                        <select className="form-control"
                              value={subject_id}
                              onChange={e => {
                                    history.push(`/admin/assign-test/${page_type}/${school_id}/${class_id}/${e.target.value}`)
                              }}
                              >
                                    <option className="_">Subjects</option>
                                    {SSubjects?.map(subject => 
                                          <option value={subject?.subject_id} key={subject?.subject_id}>{subject?.subject_name}</option>
                                    )}
                              </select>
                        </div>
                        <div className="col-md-3">
                        <select className="form-control"
                              value={teacher_id}
                              onChange={e => {
                                    history.push(`/admin/assign-test/${page_type}/${school_id}/${class_id}/${subject_id}/${e.target.value}`)
                              }}
                              >
                                    <option className="_">Teacher</option>
                                    {teachers?.map(teach => 
                                          <option value={teach?.teacher_id} key={teach?.teacher_id}>{teach?.teacher_name}</option>
                                    )}
                              </select>
                        </div>


                  </div>   
                        <div className="col-md-12 mt-2 pl-0 pr-0">
                        <table className="table table-responsive table-borded">
                        <tr>
                              <td style={{ width: '150px'}}>
                                    <label>
                                          <input className="mr-2" id="checkAll" type="checkbox" name="checkall" 
                                          onChange={handleCheckAll}/>
                                          Test Name 
                                    </label>
                              </td> 
                              <td style={{ width: '200px'}}>Unit Name</td> 
                              <td style={{ width: '150px'}}>Test Date</td> 
                              <td style={{ width: '150px'}}>Duration</td> 
                              <td style={{ width: '100px'}}>Total</td> 
                        </tr>
                  
                        <div className="pt-2 pr-0 no-gutter" style={{ minHeight: '100px !important', height: 'auto',maxHeight: '250px', overflowY: 'scroll', overflowX: 'hidden'}}>
                              {unitTests?.map((tests, index) => {
                              return(
                              <tr key={tests?._id}>
                                    <td style={{ width: '150px'}}>
                                    <b>
                                          <label><input className="mr-2" type="checkbox" name={`test`} value={`${tests?._id}`}/>
                                          {tests?.test_name}</label>
                                    </b>
                                    </td>
                                    <td style={{ width: '200px'}}><b>{tests?.unit_name}</b></td>
                                    <td style={{ width: '150px'}}><b>{helper.getDateValue(tests?.test_date)}</b></td>
                                    <td style={{ width: '150px'}}><b>{tests?.test_duration} Min</b></td>
                                    <td style={{ width: '100px'}}><b>{tests?.total_question} Ques</b></td>
                              </tr>
                              )})}
                        </div>
                  </table>
                  </div>                  
                  <div className="form-group mt-2">
                        <hr className="mb-1 mt-1"/>
                        <button className="btn btn-sm dark"
                        disabled={createMutation?.isLoading}
                        onClick={handleSubmit}>
                        {(createMutation?.isLoading) 
                        ?
                        <><span className="bi bi-spinner mr-2"></span>
                        Processing...</>
                        :
                        <><span className="bi bi-save mr-2"></span>
                        Save Question</>      
                        }
                              
                        </button>
                  </div>

            </form>  
            )}    
            
            </div>
      )
}
