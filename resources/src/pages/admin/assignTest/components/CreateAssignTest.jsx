import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getFilteredData } from '../../../../utils/helper';
import useCreateAssignTest from '../hooks/useCreateAssignTest';
import * as helper from '../../../../utils/helper'

import useAssignedTestList from '../hooks/useAssignedTestList';
import useUnitTestList from '../../unitTest/hooks/useUnitTestList';
import useClassList from '../../class/hooks/useClassList';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSchoolLists from '../../school/hooks/useSchoolLists';
import useSubjectList from '../../subject/hooks/useSubjectList';
import { useToasts } from 'react-toast-notifications';
import useMockTestList from '../../mockTest/hooks/useMockTestList';
import useSingleAssignedTest from '../hooks/useSingleAssignedTest';

export default function CreateAssignTest() {
      const params = useParams();
      const { addToast } = useToasts();

      const history = useHistory();
      const page_type = params?.page_type;
      const school_id = params?.school_id;
      const class_id = params?.class_id;
      
      const {data:SClass} = useClassList();
      const {data:schools} = useSchoolLists()
      const {data:subjects} = useSubjectList();
      const {data: unitTests}      = useUnitTestList();

      const {data: testLists, isLoading} = useAssignedTestList();
      const {data: mockTests} = useMockTestList();
      const {data: singleTest} = useSingleAssignedTest();
      // console.log(unitTests);
      const timeWindows = [
            {key:'60', value:'1 Hrs'},
            {key:'120', value:'2 Hrs'},
            {key:'180', value:'3 Hrs'},
            {key:'240', value:'4 Hrs'},
            {key:'300', value:'5 Hrs'},
            {key:'360', value:'6 Hrs'},
            {key:'420', value:'7 Hrs'},
            {key:'480', value:'8 Hrs'},
            {key:'540', value:'9 Hrs'},
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
                        if(+testWindow < +testData?.test_duration){
                              let message = `test window: ${testWindow} Min should geater than selected \n test duration: ${testData?.test_duration} Min`;
                              addToast(message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 5000});
                        }else{
                              formData['test_name'] = testData?.test_name
                              formData['test_window'] = testWindow
                              formData['test_type'] = testData?.test_type
                              formData['test_duration'] = testData?.test_duration
                              formData['start_date'] = startDate
                              formData['attemptedStudentIds'] = []
                              await createMutation.mutate(formData, {
                                    onError: (error) => {
                                          let test_name = error.response.data.data.test_name
                                          let start_date = new Date(error.response.data.data.start_date)
                                          let test_window = error.response.data.data.test_window
                                          start_date = start_date.setMinutes( start_date.getMinutes() + test_window );
                                          if(error.response.status == 405){
                                                let message = `This test cant be assigned at this time. Because \n Test Name: ${test_name} \n is scheduled at start Time: ${new Date(error.response.data.data.start_date).toLocaleString()} \n End Time: ${new Date(start_date).toLocaleString()}`;
                                                addToast(message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 5000});
                                          }
                                    }
                              });
                        }
                  }else{
                        let class_name = getFilteredData(SClass,'_id' ,class_id, 'class_name');
                        let test_name = getFilteredData(unitTests,'_id' ,formData['test_id'], 'test_name');
                        let testData = helper.getCollectionData(unitTests, '_id', formData['test_id']);
                        let subject = helper.getCollectionData(subjects,'subject_name',testData?.subject_name,'_id')
                        if(+testWindow < +testData?.test_duration){
                              let message = `test window: ${testWindow} Min should geater than selected \n test duration: ${testData?.test_duration} Min`;
                              addToast(message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 5000});
                        }else{
                              formData['class_id'] = class_id
                              formData['class_name'] = class_name
                              formData['test_name'] = test_name
                              formData['test_window'] = testWindow
                              formData['test_type'] = testData?.test_type
                              formData['test_subjects'] = testData?.test_subjects
                              formData['subject_id'] = subject?._id
                              formData['subject_name'] = testData?.subject_name
                              formData['test_duration'] = testData?.test_duration
                              formData['total_question'] = testData?.total_question
                              formData['total_marks'] = testData?.total_marks
                              formData['start_date'] = startDate
                              // console.log(formData); return;
                              await createMutation.mutate(formData, {
                                    onError: (error) => {
                                          let test_name = error.response.data.data.test_name
                                          let start_date = new Date(error.response.data.data.start_date)
                                          let test_window = error.response.data.data.test_window
                                          start_date = start_date.setMinutes( start_date.getMinutes() + test_window );
                                          if(error.response.status == 405){
                                                let message = `This test cant be assigned at this time. Because \n Test Name: ${test_name} \n is scheduled @ \n\n start Time: ${new Date(error.response.data.data.start_date).toLocaleString()} and End Time: ${new Date(start_date).toLocaleString()}`;
                                                addToast(message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 5000});
                                          }
                                    }
                              });
                        }
                        
                  }
      
                  
            }

            
            
      }
      return (
            <div>
                  
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Assign New Test
            </p>
            <hr />
            {(params?.page_type === 'create' || params?.page_type === 'update') && (
                          
            <form>
                  <div className="row col-md-12 mb-2">
                        <div className="col-md-2 pl-0">
                        <DatePicker 
                              selected={startDate}
                              value={new Date(singleTest?.start_date)}
                              onChange={(date) => setStartDate(date)}
                              isClearable showTimeSelect dateFormat="MM/d/yyyy h:mm aa"
                              minDate={new Date()}
                        />  
                        </div>
                        
                            
                        <div className="col-md-2 pl-0">
                              <select 
                              value={testWindow ?? Math.round(singleTest?.test_window/60)}
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
                        <div className="col-md-12 pl-0 mt-3" style={{ overflowX: 'scroll', width: '1200px'}}>
                        <table className="table table-responsive table-borded" style={{
                              width: '1200px'
                        }}>
                              
                              {params?.test_type === 'mock-test' ? 
                              (
                                    <tr>
                                          <th>Test Name</th> 
                                          <th>Duration</th> 
                                          <th>Window</th> 
                                          <th>Test Type</th> 
                                          <th>Published</th> 
                                    </tr>
                              )
                              :
                              (
                                    <tr>
                                          <th>Test Name</th> 
                                          <th>Duration</th> 
                                          <th>Marks</th> 
                                          <th>Question</th> 
                                          <th>Test Type</th> 
                                          <th>Test Subjects</th> 
                                          <th>Assigned</th>
                                    </tr>
                              )
                              }
                              
                        <tbody className="pt-2 pr-0 no-gutter" style={{ height: 'auto',maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden'}}>
                              {(params?.test_type === 'single-test' || params?.test_type === 'combine-test') && unitTests?.map((tests, index) => {
                              let assigned = checkAssigned(tests?._id);      
                              let subjects = '';
                              if(tests?.test_type === 'combine-test'){
                                    subjects = Array.prototype.map.call(tests?.test_subjects, function(item) { return item.subject_name; }).join(",");
                              }else{
                                    subjects = tests?.subject_name
                              }
                              if(!assigned)
                              return(
                              <tr key={tests?._id}>
                                    <td>
                                    <b>
                                    <label>
                                          <input type="radio" name={`test`}
                                          value={tests?._id}
                                          data-testName={tests?.test_name}
                                          onChange={e => setFormData({...formData, test_id: e.target.value})}
                                          className="mr-2"
                                          />
                                          {tests?.test_name}</label>
                                    </b>
                                    </td>
                                    <td><b>{tests?.test_duration} Min</b></td>
                                    <td><b>{tests?.total_marks}</b></td>
                                    <td><b>{tests?.total_question} Ques</b></td>
                                    <td><b>{tests?.test_type === 'combine-test' ? 'combine-test': 'single-test'}</b></td>
                                    <td><b>{subjects}</b></td>
                                    <td><b>{assigned?.toString()}</b></td>
                                    
                              </tr>
                              )})}
                              
                              {params?.test_type === 'mock-test' && mockTests?.map(mtes => {
                                    return(
                                          <tr key={mtes?._id}>
                                               <td>
                                                      <label>
                                                      <input className="mr-2" type="radio" name={`test`}
                                                      value={mtes?._id}
                                                      onChange={e => setFormData({...formData, test_id: e.target.value})}
                                                      className="mr-2"
                                                      />
                                                      {mtes?.test_name}</label>
                                                </td>
                                                <td><b>{mtes?.test_duration} Min</b></td>
                                                <td><b>{mtes?.test_type}</b></td>
                                                <td><b>{mtes?.status?.toString()}</b></td>
                                                <td><b>{new Date(mtes?.create_at)?.toLocaleString()}</b></td>
                                          </tr>
                                    )
                              })}
                              </tbody>
                              </table>  
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
                        Save Assign Test</>      
                        }
                              
                        </button>
                  </div>

            </form>  
            )}    
            
            </div>
      )
}
