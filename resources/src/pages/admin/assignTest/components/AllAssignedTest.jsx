import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';
import React, {useState, useContext} from 'react'
import useDeleteAssignedTest from '../hooks/useDeleteAssignedTest';
import useAssignedTestList from '../hooks/useAssignedTestList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import * as helper from '../../../../utils/helper'

import useTestByClassSubject from '../../unitTest/hooks/useTestByClassSubject';

export default function AllAssignedTest({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data: testLists, isLoading} = useAssignedTestList();
      const {data:schools, isLoading: isSchoolLoading} = useSchoolLists();
      const {data: unitTests, isLoading: isUnitTestLoading}      = useTestByClassSubject();
      
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
        <div className="col-md-12 pr-2 pl-2 row no-gutter" style={{ minHeight: '100px !important', height: 'auto',maxHeight: '350px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {testLists?.map( test => {
                let school_name = '';
                let test_name = '';
                if(!isSchoolLoading){
                    school_name = helper.getFilteredData(schools, '_id', test?.school_id, 'school_name');
                }
                
                if(!isUnitTestLoading){
                    test_name = helper.getFilteredData(unitTests, '_id', test?.test_id, 'test_name');
                }

                return(
                    <div className="card col-md-12 mb-2 pt-2 pb-2">
                        <div className="flex">TetsName: {test_name}</div>
                        <div className="flex">School: {school_name}</div>
                        <div className="flex">Class: {test?.class_name}</div>
                        <div className="flex">Subject: {test?.subject_name}</div>
                    </div>
                )
            })}
        </div>
    </>
    )
}
