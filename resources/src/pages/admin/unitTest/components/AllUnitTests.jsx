import useUnitTestList from '../hooks/useUnitTestList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'

import {AuthContext} from '../../../../context/AuthContext';

import React, {useState, useContext} from 'react'
import useDeleteSample from '../hooks/useDeleteUnitTest';
import * as helper from '../../../../utils/helper';
import useClassList from '../../class/hooks/useClassList';
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
export default function AllUnitTests({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data:sClassess} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();

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
        <div className="col-md-12 row">
        <div className="col-md-3 pl-0">
            <select className="form-control"
                    value={params?.class_id}
                    onChange={e => {
                        if(e.target.value === '_'){
                                history.push(`/admin/manage-unit-test/${params?.page_type}/`)  
                        }else{
                                history.push(`/admin/manage-unit-test/${params?.page_type}/${e.target.value}`)  
                        }
                    }}>
                        <option value="_">Select Class</option>
                        {sClassess?.map(sclass => {
                                return(
                                    <option value={sclass?._id} key={sclass?._id}>{sclass?.class_name} Th</option>
                                );
                        })}
                    </select>
            </div>
            <div className="col-md-3 pl-0">
                    <select className="form-control"
                    value={params?.subject_id}
                    onChange={e => {

                        if(e.target.value === '_'){
                            history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}`)                          
                        }else{
                               
                            history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${e.target.value}`)                          
                        }
                    }}>
                        <option value="_">{subjectLoading ? 'Loading...':'Select Subjects'}</option>
                        {subjects?.map(subject => {
                                return(
                                    <option value={subject?.subject_id} data-subject_name={subject.subject_name} key={subject?.subject_id}>{subject?.subject_name}</option>
                                );
                        })}
                    </select>
            </div>
        </div>
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
                                <div className="flex">Test Window: <b>{tests?.test_window} hr</b></div>
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
