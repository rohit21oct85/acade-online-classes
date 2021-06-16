import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';
import React, {useState, useContext} from 'react'
import useDeleteAssignedTest from '../hooks/useDeleteAssignedTest';
import useAssignedTestList from '../hooks/useAssignedTestList';

export default function AllAssignedTest({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data: TestLists, isLoading} = useAssignedTestList();
      const deleteMutation = useDeleteAssignedTest();
      const deleteQuestion = async (id) => {
            await deleteMutation.mutate(id)
      }

    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Assigned Test</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: '460px', overflowY: 'scroll', overflowX: 'hidden'}}>
            
        </div>
    </>
    )
}
