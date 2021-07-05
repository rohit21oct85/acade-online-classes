import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';
import React, {useState, useContext} from 'react'
import useDeleteAssignedTest from '../hooks/useDeleteAssignedTest';
import useAssignedTestList from '../hooks/useAssignedTestList';

import useAssignToClass from '../hooks/useAssignToClass';

export default function AllAssignedTest({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data: testLists, isLoading} = useAssignedTestList();
      
      const [formData, setFormData] = useState({});
      
      const deleteMutation = useDeleteAssignedTest();
      const AssignMutation = useAssignToClass(formData);

      const deleteAssignedTest = async (test_id) => {
            await deleteMutation.mutate(test_id)
      }

      async function handleAssignTest(test_id){
            formData['_id'] = test_id
            formData['school_id'] = params?.school_id
            formData['class_id'] = params?.class_id
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
        <Loading isLoading={isLoading} /> 
        <table className="table table-bordered">
            <thead>
                <tr>
                    <td>School Name</td>
                    <td>Test Name</td>
                    <td>Test Duration/Window</td>
                    <td>Subject Name</td>
                    <td>Start Test</td>
                    <td>End Test</td>
                    <td>Assign to Class</td>
                </tr>
            </thead>
            <tbody style={{ minHeight: '100px !important', height: 'auto',maxHeight: '350px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {testLists?.map( test => {
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
                        <td>{test?.test_duration}Sec / {test?.test_window} Min</td>
                        <td>{subjects}</td>
                        <td>{new Date(test?.start_date).toLocaleString()}</td>
                        <td>{test_window.toLocaleString()}</td>
                        <td>

                            <button className={`btn btn-sm dark ${test?.assigned ? 'bg-danger':'bg-success'}`} disabled={test?.assigned}
                            onClick={() => handleAssignTest(test?._id)}>
                                {test?.assigned ? 'Already Assigned ':'Assign to Class'}
                            </button>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        
        </table>
    </>
    )
}
