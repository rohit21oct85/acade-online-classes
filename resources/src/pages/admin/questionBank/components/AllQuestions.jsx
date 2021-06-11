import useQuestionList from '../hooks/useQuestionList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';

import React, {useState, useContext} from 'react'
import useDeleteQuestion from '../hooks/useDeleteQuestion';

export default function AllQuestions({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data, isLoading} = useQuestionList();
      const deleteMutation = useDeleteQuestion();
      const deleteQuestion = async (id) => {
            await deleteMutation.mutate(id)
      }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>All Questions</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
            
        </div>
    </>
    )
}
