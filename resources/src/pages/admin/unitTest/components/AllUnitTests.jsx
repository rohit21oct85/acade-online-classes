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
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: 'auto !important',maxheight: '250px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {data?.map(tests => {
                return(
                    <div className="card col-md-12 mb-2 col-md-6 no-gutter" style={{ height: '200px !important'}} key={tests?._id}>
                        <div className="flex">
                            <span>Name: <b>{tests?.test_name}</b></span>
                            <span>Duration: <b>{tests?.test_duration} Min</b></span>
                        </div>
                        <div>Class: <b>{tests?.class_name}</b></div>
                        <div>Subject: <b>{tests?.subject_name}</b></div>
                        <div>Test Date: <b>{helper.getDateValue(tests?.test_date)}</b></div>
                    </div>
                )
            })}
        </div>
    </>
    )
}
