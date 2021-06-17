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
      function handleCheckAllSchool(){
            let moduleCheked = document.getElementById("checkAllSchool").checked;
            Array.from(document.getElementsByName('school')).map(elem => {
                  if(moduleCheked){
                        elem.checked = true;
                  }else{
                        elem.checked = false;

                  }
            })
      }
      async function handleSubmit(e){
            e.preventDefault();
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            
            let class_name = getFilteredData(SClass,'_id' ,class_id, 'class_name');
            let subject_name = getFilteredData(SSubjects,'subject_id' , subject_id, 'subject_name');
            let mainData = []

            Array.from(document.getElementsByName('test')).map(elem => {
                 if(elem.checked = true){
                  let finalData = [];
                  Array.from(document.getElementsByName('school')).map((elems) => {
                        if(elems.checked = true){
                              mainData.push({
                                    'school_id': elems.value,
                                    'class_id':  class_id,
                                    'class_name':  class_name,
                                    'subject_id':  subject_id,
                                    'subject_name':  subject_name,
                                    'test_id': elem.value
                               })
                        }
                  })
                   
                 }
            })
            
            console.log(mainData);
            // return;
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
                              value={class_id}
                              onChange={e => {
                                    history.push(`/admin/assign-test/${page_type}/${e.target.value}`)
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
                                    history.push(`/admin/assign-test/${page_type}/${class_id}/${e.target.value}`)
                              }}
                              >
                                    <option className="_">Subjects</option>
                                    {SSubjects?.map(subject => 
                                          <option value={subject?.subject_id} key={subject?.subject_id}>{subject?.subject_name}</option>
                                    )}
                              </select>
                        </div>
                        
                  </div>  
                  <hr className="mb-1 mt-1"/>  
                        <div className="row">

                        <div className="col-md-3">
                        <p className="mb-0 mt-0">
                        <label>
                              <input className="mr-2" id="checkAllSchool" type="checkbox" name="checkallSchool" 
                              onChange={handleCheckAllSchool}/>
                              <b>Check All School</b>
                        </label>
                        </p>     
                        <hr className="mb-1 mt-1"/> 
                        <div className="pt-2 pr-0 no-gutter" style={{ minHeight: '100px !important', height: 'auto',maxHeight: '250px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        {schools?.map(school => 
                        <div className="row col-md-12 pr-0">
                             <label>
                              <input type="checkbox" name="school" className="mr-2" value={school?._id}/>
                              {school?.school_name}</label> 
                        </div>
                        )}
                        </div>             
                        </div>             
                        
                        <div className="col-md-9 pl-0 pr-0">
                        <p className="mb-0 mt-0">
                        <label>
                              <input className="mr-2 ml-2" id="checkAll" type="checkbox" name="checkall" 
                              onChange={handleCheckAll}/>
                              <b>Check All Tests</b>
                        </label>
                        
                        </p>            
                        <table className="table table-responsive table-borded">
                        <thead>
                              <tr>
                                    <td style={{ width: '200px'}}>Test Name</td> 
                                    <td style={{ width: '200px'}}>Unit Name</td> 
                                    <td style={{ width: '150px'}}>Test Date</td> 
                                    <td style={{ width: '150px'}}>Duration</td> 
                                    <td style={{ width: '100px'}}>Total</td> 
                              </tr>
                        </thead>
                  
                        <tbody className="pt-2 pr-0 no-gutter" style={{ minHeight: '100px !important', height: 'auto',maxHeight: '250px', overflowY: 'scroll', overflowX: 'hidden'}}>
                              {unitTests?.map((tests, index) => {
                              return(
                              <tr key={tests?._id}>
                                    <td style={{ width: '200px'}}>
                                    <b>
                                    <label>
                                          <input className="mr-2" type="checkbox" name={`test`} value={`${tests?._id}`}
                                          />
                                          {tests?.test_name}</label>
                                    </b>
                                    </td>
                                    <td style={{ width: '200px'}}><b>{tests?.unit_name}</b></td>
                                    <td style={{ width: '150px'}}><b>{helper.getDateValue(tests?.test_date)}</b></td>
                                    <td style={{ width: '150px'}}><b>{tests?.test_duration} Min</b></td>
                                    <td style={{ width: '100px'}}><b>{tests?.total_question} Ques</b></td>
                              </tr>
                              )})}
                              </tbody>
                  </table>
                        </div>  
                        </div>                  
                  <div className="form-group mt-2">
                        <hr className="mb-2 mt-1"/>
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
