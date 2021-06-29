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
            await AssignMutation.mutate(formData)
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
                    <td>Date and Time</td>
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
                return(
                    <tr>
                        <td>{test?.school_name}</td>
                        <td>{test?.test_name} ({(test?.total_question)} Qes)</td>
                        <td>{test?.test_duration}Sec / {test?.test_window} Sec</td>
                        <td>{subjects}</td>
                        <td>{test?.start_date}</td>
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
