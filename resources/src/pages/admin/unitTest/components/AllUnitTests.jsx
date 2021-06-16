import useUnitTestList from '../hooks/useUnitTestList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';

import React, {useState, useContext} from 'react'
import useDeleteSample from '../hooks/useDeleteUnitTest';
import * as helper from '../../../../utils/helper';
export default function AllUnitTests({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data, isLoading} = useUnitTestList();
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
        <div className="col-md-12 pr-0 row no-gutter" style={{ minHeight: '200px !important', height: 'auto',maxHeight: '380px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {data?.map(tests => {
                return(
                    <div className="card flex col-md-12 mb-2 col-md-6 no-gutter" style={{ height: '200px !important'}} key={tests?._id}>
                        <div className="row">
                        <div className="col-md-2 pl-0 pr-0 text-center dark" style={{
                            paddingTop: '6%',
                            paddingBottom: '6%'
                        }}>
                            <b>{tests?.class_name} Th</b>
                            <br />
                            <b>{tests?.subject_name}</b>
                        </div>
                        <div className="col-md-10">
                                <div className="flex">Name: <b>{tests?.test_name}</b></div>
                                <div className="flex">Unit: <b>{tests?.unit_name}</b></div>
                                <div className="flex">Test Date: <b>{helper.getDateValue(tests?.test_date)}</b></div>
                                <div className="flex">Duration: <b>{tests?.test_duration} Min</b></div>
                                <div className="flex">Total Question: <b>{tests?.total_question} Ques</b></div>
                        </div>
                        </div>

                    </div>
                )
            })}
        </div>
    </>
    )
}
