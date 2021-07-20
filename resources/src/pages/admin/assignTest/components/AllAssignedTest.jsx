import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';
import React, {useState, useContext} from 'react'
import useDeleteAssignedTest from '../hooks/useDeleteAssignedTest';
import useAssignedTestList from '../hooks/useAssignedTestList';

import useAssignToClass from '../hooks/useAssignToClass';
import useAssignedMockTestList from '../hooks/useAssignedMockTestList';

export default function AllAssignedTest({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data: testLists, isLoading} = useAssignedTestList();
      const {data: assignMockTests} = useAssignedMockTestList();
      const [formData, setFormData] = useState({});
      
      const deleteMutation = useDeleteAssignedTest();
      const AssignMutation = useAssignToClass(formData);

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

    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Assigned Test</p>
        <hr className="mt-1"/>
        {params?.test_type !== 'mock-test' && params?.class_id && (
        <Loading isLoading={isLoading} /> 
        )}
        <div className="table-responsive pl-0" style={{ width: '100%', overflow: 'scroll hidden'}}>
        <table className="table table-responsive" style={{ width: '1350px'}}>
            <thead>
                <tr>
                    <td>School Name</td>
                    <td>Test Name</td>
                    <td>Test Duration/Window</td>
                    {params?.test_type !== 'mock-test' && <td>Subject Name</td>}
                    <td>Start Test</td>
                    <td>End Test</td>
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
                    <tr>
                        <td>{test?.school_name}</td>
                        <td>{test?.test_name} ({(test?.total_question)} Qes)</td>
                        <td>{test?.test_duration} Min / {test?.test_window} Min</td>
                        {params?.test_type !== 'mock-test' && <td>{subjects}</td>}
                        <td>{new Date(test?.start_date).toLocaleString()}</td>
                        <td>{test_window.toLocaleString()}</td>
                        <td> <button className={`btn btn-sm dark`}
                            onClick={() => {
                                history.push(`/admin/assign-test/update/${params?.school_id}/${params?.test_type}/${test?.test_id}`)
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
                    <tr>
                        <td>{test?.school_name}</td>
                        <td>{test?.test_name}  ({(test?.total_question)} Qes)</td>
                        <td>{test?.test_duration} Min / {test?.test_window} Min</td>
                        <td>{new Date(test?.start_date).toLocaleString()}</td>
                        <td>{test_window.toLocaleString()}</td>
                        <td> <button className={`btn btn-sm dark`}
                            onClick={() => {
                                history.push(`/admin/assign-test/update/${params?.school_id}/${params?.test_type}/${test?.test_id}`)
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
