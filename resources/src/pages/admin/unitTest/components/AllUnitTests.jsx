import useSampleList from '../hooks/useUnitTestList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';

import React, {useState, useContext} from 'react'
import useDeleteSample from '../hooks/useDeleteUnitTest';

export default function AllUnitTests({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data, isLoading} = useSampleList();
      const deleteMutation = useDeleteSample();
      const deleteQuestion = async (id) => {
            await deleteMutation.mutate(id)
      }

    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Unit Tests</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: '460px', overflowY: 'scroll', overflowX: 'hidden'}}>
            
        </div>
    </>
    )
}
