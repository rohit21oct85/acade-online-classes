import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getFilteredData } from '../../../../utils/helper';
import useCreateAssignTest from '../hooks/useCreateAssignTest';
import * as helper from '../../../../utils/helper'

import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import useAssignedTestList from '../hooks/useAssignedTestList';
import useUnitTestList from '../../unitTest/hooks/useUnitTestList';
import useClassList from '../../class/hooks/useClassList';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSchoolLists from '../../school/hooks/useSchoolLists';
import useSubjectList from '../../subject/hooks/useSubjectList';
import { useToasts } from 'react-toast-notifications';
import useMockTestList from '../../mockTest/hooks/useMockTestList';

export default function CreateAssignTest() {
      const params = useParams();
      const { addToast } = useToasts();

      const history = useHistory();
      const page_type = params?.page_type;
      const school_id = params?.school_id;
      const class_id = params?.class_id;
      const startTimes = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","13:00 PM","14:00 PM","15:00 PM","16:00 PM","17:00 PM","18:00 PM"]
      
      const {data:SClass} = useClassList();
      const {data:schools} = useSchoolLists()
      const {data:subjects} = useSubjectList();
      const {data: unitTests}      = useUnitTestList();
      const {data: testLists, isLoading} = useAssignedTestList();
      const {data: mockTests} = useMockTestList();
      const timeWindows = [
            {key:'2', value:'2 Hrs'},
            {key:'3', value:'3 Hrs'},
            {key:'4', value:'4 Hrs'},
            {key:'5', value:'5 Hrs'},
            {key:'6', value:'6 Hrs'}
      ]
      const [formData, setFormData] = useState({});
      const createMutation = useCreateAssignTest(formData);
      const [startDate, setStartDate] = useState(new Date());
      const [testWindow, setTestWindow] = useState(null);
      
      function checkAssigned(test_id){
            if(!isLoading && testLists !== 'undefined'){
                  return testLists?.some(test => test?.test_id == test_id && test?.school_id === params?.school_id);
            }
      }
      async function handleSubmit(e){
            e.preventDefault();
            let school_id = params?.school_id
            let class_id = params?.class_id
            if(!school_id || school_id == "undefined"){
                  addToast('please select school', { appearance: 'error', autoDismiss: true });
            }
            else if((!class_id || class_id == "undefined") && params?.test_type !== 'mock-test'){
                  addToast('please select class', { appearance: 'error', autoDismiss: true });
            }
            else if(!testWindow){
                  addToast('please select test window', { appearance: 'error', autoDismiss: true });
            }
            else if(!formData['test_id']){
                  addToast('please select tests', { appearance: 'error', autoDismiss: true });
            }
            else{
                  let school_name = getFilteredData(schools,'_id' ,school_id, 'school_name');
                  formData['school_name'] = school_name
                  formData['school_id'] = school_id
                  if(params?.test_type === 'mock-test'){
                        let testData = helper.getCollectionData(mockTests, '_id', formData['test_id']);
                        formData['test_name'] = testData?.test_name
                        formData['test_window'] = +testWindow*60
                        formData['test_type'] = testData?.test_type
                        formData['test_duration'] = testData?.test_duration
                        formData['start_date'] = startDate
                        await createMutation.mutate(formData, {
                              onError: (error) => {
                                    if(error.response.status == 405){
                                          let message = 'Test cant be assigned at this time\n Some test with the same timing already assigned.\n Change test timing and assign again';
                                          addToast(message, { appearance: 'error', autoDismiss: true });
                                    }
                              }
                        });

                        
                  }else{
                        let class_name = getFilteredData(SClass,'_id' ,class_id, 'class_name');
                        let test_name = getFilteredData(unitTests,'_id' ,formData['test_id'], 'test_name');
                        let testData = helper.getCollectionData(unitTests, '_id', formData['test_id']);
                        let subject = helper.getCollectionData(subjects,'subject_name',testData?.subject_name,'_id')
                        formData['class_id'] = class_id
                        formData['class_name'] = class_name
                        formData['test_name'] = test_name
                        formData['test_window'] = +testWindow*60
                        formData['test_type'] = testData?.test_type
                        formData['test_subjects'] = testData?.test_subjects
                        formData['subject_id'] = subject?._id
                        formData['subject_name'] = testData?.subject_name
                        formData['test_duration'] = testData?.test_duration
                        formData['total_question'] = testData?.total_question
                        formData['start_date'] = startDate
                        // console.log(formData); return;
                        await createMutation.mutate(formData, {
                              onError: (error) => {
                                    if(error.response.status == 405){
                                          let message = 'Test cant be assigned at this time\n Some test with the same timing already assigned.\n Change test timing and assign again';
                                          addToast(message, { appearance: 'error', autoDismiss: true });
                                    }
                              }
                        });
                  }
      
                  
            }

            
            
      }
      return (
            <div>
                  
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Assign New Test
            </p>
            <hr />
            {params?.page_type === 'create' && (
                          
            <form>
                  <div className="row col-md-12 mb-2">
                        <div className="col-md-2 pl-0">
                        <DatePicker 
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              isClearable showTimeSelect dateFormat="MM/d/yyyy h:mm aa"
                              minDate={new Date()}
                        />  
                        </div>
                        
                            
                        <div className="col-md-2 pl-0">
                              <select 
                              value={testWindow}
                              onChange={e => setTestWindow(e.target.value)}
                              >
                                    <option>Select Time Window</option>
                                    {timeWindows?.map(times => {
                                          return(
                                                <option value={times?.key}>{times?.value}</option>
                                          )
                                    })}
                              </select>
                        </div> 

                  </div>  
                  <div className="row col-md-12 mt-3">
                        <div className="table table-responsive table-borded">
                              {params?.test_type === 'mock-test' ? 
                              (
                                    <div className="flex">
                                          <div style={{ width: '220px'}}>Test Name</div> 
                                          <div style={{ width: '110px'}}>Duration</div> 
                                          <div style={{ width: '110px'}}>Test Type</div> 
                                          <div style={{ width: '110px'}}>Published</div> 
                                    </div>
                              )
                              :
                              (
                                    <div className="flex">
                                          <div style={{ width: '220px'}}>Test Name</div> 
                                          <div style={{ width: '110px'}}>Duration</div> 
                                          <div style={{ width: '110px'}}>Question</div> 
                                          <div style={{ width: '110px'}}>Test Type</div> 
                                          <div style={{ width: '110px'}}>Test Subjects</div> 
                                          <div style={{ width: '110px'}}>Assigned</div> 
                                    </div>
                              )
                              }
                              
                        
                  
                        <div className="pt-2 pr-0 no-gutter" style={{ height: '200px',maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden'}}>
                              {unitTests?.map((tests, index) => {
                              let assigned = checkAssigned(tests?._id);      
                              let subjects = '';
                              if(tests?.test_type === 'combine-test'){
                                    subjects = Array.prototype.map.call(tests?.test_subjects, function(item) { return item.subject_name; }).join(",");
                              }else{
                                    subjects = tests?.subject_name
                              }
                              if(!assigned)
                              return(
                              <div className="flex" key={tests?._id}>
                                    <div style={{ width: '220px'}}>
                                    <b>
                                    <label>
                                          <input className="mr-2" type="radio" name={`test`}
                                          value={tests?._id}
                                          data-testName={tests?.test_name}
                                          onChange={e => setFormData({...formData, test_id: e.target.value})}
                                          />
                                          {tests?.test_name}</label>
                                    </b>
                                    </div>
                                    <div style={{ width: '120px'}}><b>{tests?.test_duration} Min</b></div>
                                    <div style={{ width: '120px'}}><b>{tests?.total_question} Ques</b></div>
                                    <div style={{ width: '110px'}}><b>{tests?.test_type === 'combine-test' ? 'combine-test': 'single-test'}</b></div>
                                    <div style={{ width: '110px'}}><b>{subjects}</b></div>
                                    <div style={{ width: '100px'}}><b>{assigned?.toString()}</b></div>
                              </div>
                              )})}
                              {params?.test_type === 'mock-test' && mockTests?.map(mtes => {
                                    return(
                                          <div className="flex" key={mtes?._id}>
                                               <div style={{ width: '220px'}}>
                                                      <label>
                                                      <input className="mr-2" type="radio" name={`test`}
                                                      value={mtes?._id}
                                                      onChange={e => setFormData({...formData, test_id: e.target.value})}
                                                      />
                                                      {mtes?.test_name}</label>
                                                </div>
                                                <div style={{ width: '120px'}}><b>{mtes?.test_duration} Min</b></div>
                                                <div style={{ width: '110px'}}><b>{mtes?.test_type}</b></div>
                                                <div style={{ width: '110px'}}><b>{mtes?.status?.toString()}</b></div>
                                          </div>
                                    )
                              })}
                              </div>
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
