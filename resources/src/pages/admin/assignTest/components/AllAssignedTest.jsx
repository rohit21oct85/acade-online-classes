import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {AuthContext} from '../../../../context/AuthContext';
import React, {useState, useContext} from 'react'
import useDeleteAssignedTest from '../hooks/useDeleteAssignedTest';
import useAssignedTestList from '../hooks/useAssignedTestList';

import useAssignToClass from '../hooks/useAssignToClass';
import useAssignedMockTestList from '../hooks/useAssignedMockTestList';
import useUpdateAssignTest from '../hooks/useUpdateAssignTest';

export default function AllAssignedTest({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data: testLists, isLoading} = useAssignedTestList();
      const {data: assignMockTests} = useAssignedMockTestList();
      const [formData, setFormData] = useState({});
      
      const deleteMutation = useDeleteAssignedTest();
      const AssignMutation = useAssignToClass(formData);
      const updateMutation = useUpdateAssignTest(formData);
      const [startDate, setStartDate] = useState(new Date());
      const deleteAssignedTest = async (test_id) => {
            await deleteMutation.mutate(test_id)
      }
      console.log(assignMockTests)
      async function handleAssignTest(test_id){
            formData['_id'] = test_id
            formData['test_type'] = params?.test_type
            formData['school_id'] = params?.school_id
            if(params?.test_type !== 'mock-test'){
                formData['class_id'] = params?.class_id
            }
            await AssignMutation.mutate(formData, {
                onError: (error) => {
                    if(error.response.status == 405){
                        let message = 'Cannot assigned test, BCoz already one test is Assigned';
                        addToast(message, { appearance: 'error', autoDismiss: true });
                  }
                }
            })
      }
      const timeWindows = [
        {key:'1', value:'1 Hrs'},
        {key:'2', value:'2 Hrs'},
        {key:'3', value:'3 Hrs'},
        {key:'4', value:'4 Hrs'},
        {key:'5', value:'5 Hrs'},
        {key:'6', value:'6 Hrs'},
        {key:'7', value:'7 Hrs'},
        {key:'8', value:'8 Hrs'},
    ]
    const [testWindow, setTestWindow] = useState(null);
      async function handleUpdateTest(){
        formData['test_id'] = params?.test_id
        formData['school_id'] = params?.school_id
        formData['start_date'] = startDate
        formData['test_window'] = testWindow*60
        await updateMutation.mutate(formData);
      }
    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Assigned Test</p>
        <hr className="mt-1"/>
        {params?.test_type !== 'mock-test' && params?.class_id && (
        <Loading isLoading={isLoading} /> 
        )}
        {params?.test_id && 
        <div className="col-md-6 pl-0 pb-2">
            <form className="flex">
                
                <DatePicker 
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        isClearable showTimeSelect dateFormat="MM/d/yyyy h:mm aa"
                        minDate={new Date()}
                />  
                
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
                
                <div>
                <button className="dark bg-success"
                onClick={handleUpdateTest}>
                    <span className="fa fa-save pr-2"></span>
                    Update Test
                </button>
                
                <button className="ml-1 dark bg-danger"
                onClick={ () => { history.push(`/admin/assign-test/view/${params?.school_id}/${params?.test_type}/${params?.class_id}`)}}>
                    <span className="fa fa-times pr-2"></span>
                    Cancel
                </button>
                </div>
                
            </form>
        </div>
        }
        <div className="table-responsive pl-0" style={{ width: '100%', overflow: 'scroll hidden'}}>
        <table className="table table-responsive" style={{ width: '1350px'}}>
            <thead>
                <tr>
                    <td>School Name</td>
                    <td>Test Name</td>
                    <td>Test Duration/Window</td>
                    {params?.test_type !== 'mock-test' && <td>Subject Name</td>}
                    {!params?.test_id && (<>
                        <td>Start Test</td>
                        <td>End Test</td>
                    </>)}
                    
                    <td>Update Test Time</td>
                    <td>Assign to Class</td>
                </tr>
            </thead>
            <tbody style={{ minHeight: '100px !important', height: 'auto',maxHeight: '350px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {(params?.test_type === 'single-test' || params?.test_type === 'combine-test') && testLists?.map( test => {
                let subjects = '';
                if(test?.test_type === 'combine-test'){
                    subjects = Array.prototype.map.call(test?.test_subjects, function(item) { return item.subject_name; }).join(",");
                }else{
                    subjects = test?.subject_name
                }
                let test_window = new Date(test?.start_date)
                test_window.setMinutes( test_window.getMinutes() + test?.test_window );
                return(
                    <tr className={`${params?.test_id == test?.test_id ? 'light': ''}`}>
                        <td>{test?.school_name}</td>
                        <td>{test?.test_name} ({(test?.total_question)} Qes)</td>
                        <td>{test?.test_duration} Min / {test?.test_window} Min</td>
                        {params?.test_type !== 'mock-test' && <td>{subjects}</td>}
                        {!params?.test_id && (<>
                            <td>{new Date(test?.start_date).toLocaleString()}</td>
                            <td>{test_window.toLocaleString()}</td>
                        </>)}
                        
                        <td> <button className={`btn btn-sm dark`}
                            onClick={() => {
                                history.push(`/admin/assign-test/view/${params?.school_id}/${params?.test_type}/${params?.class_id}/${test?.test_id}`)
                            }}>
                                Update Mock Test
                            </button>
                        </td>
                        <td>
                             <button className={`btn btn-sm dark ${test?.assigned ? 'bg-danger':'bg-success'}`} disabled={test?.assigned}
                            onClick={() => handleAssignTest(test?._id)}>
                                {test?.assigned === true ? 'Already Assigned ':'Assign to Class'}
                            </button>
                        </td>
                    </tr>
                )
            })}
            {params?.test_type === 'mock-test' && assignMockTests?.map(test => {
                let test_window = new Date(test?.start_date)
                test_window.setMinutes( test_window.getMinutes() + test?.test_window );
                return(
                    <tr className={`${params?.test_id == test?.test_id ? 'light': ''}`}>
                        <td>{test?.school_name}</td>
                        <td>{test?.test_name}  ({(test?.total_question)} Qes)</td>
                        <td>{test?.test_duration} Min / {test?.test_window} Min</td>
                        <td>{new Date(test?.start_date).toLocaleString()}</td>
                        <td>{test_window.toLocaleString()}</td>
                        <td> <button className={`btn btn-sm dark`}
                            onClick={() => {
                                history.push(`/admin/assign-test/view/${params?.school_id}/${params?.test_type}/all-class/${test?.test_id}`)
                            }}>
                                Update Mock Test
                            </button>
                        </td>
                        <td>
                            {params?.test_type !== 'mock-test' ? 
                            <button className={`btn btn-sm dark ${test?.assigned ? 'bg-danger':'bg-success'}`} disabled={test?.assigned}
                            onClick={() => handleAssignTest(test?._id)}>
                                {test?.assigned === true ? 'Already Assigned ':'Assign to Class'}
                            </button>
                            :
                            <button className={`btn btn-sm dark ${test?.assigned ? 'bg-danger':'bg-success'}`} disabled={test?.assigned}
                            onClick={() => handleAssignTest(test?._id)}>
                                {test?.assigned === true ? 'Already Assigned ':'Assign Mock Test'}
                            </button>
                            }
                        </td>
                    </tr>
                )
            })}
            </tbody>
        
        </table>
        </div>
    </>
    )
}
