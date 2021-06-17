import useSubjectChapterList from '../hooks/useSubjectChapterList';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';
import { MakeSlug } from '../../../../utils/utils';
import * as helper from '../../../../utils/helper'

import React, {useState, useContext} from 'react'
import useDeleteSubjectChapter from '../hooks/useDeleteSubjectChapter';

export default function AllSubjectChapterMapping({update, Delete}) {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const params = useParams();
    const {data:chapters, isLoading} = useSubjectChapterList();
    const deleteMutation = useDeleteSubjectChapter();
    const deleteChapter = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <div>
            <span className="fa fa-plus-circle mr-2"></span>All Chapters
        </div>
        <hr className="mt-1 mb-1"/>
        {params?.unit_id && params?.unit_slug && (

        <div className="row pl-0 pr-0">
            <div className="col-md-6">
            <b className="mr-0">Unit ID: </b>
            {params?.unit_id}
            </div>
            
            <div>
            <b className="mr-2">Unit Name: </b>
            {params?.unit_slug}
            </div>

        </div>
        )}
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Unit No / Name</th>
                        <th scope="col">Chapter No / Name</th>
                        <th scope="col">Class</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chapters && chapters?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <td style={{ width: '200px'}}>{helper.romanize(item?.unit_no)}-{item.unit_name}</td>
                                <td style={{ width: '300px'}}>{item.chapter_no}-{item.chapter_name}</td>
                                <td>{item.class_name}</td>
                                <td>{item.subject_name}</td>
                                <td>
                                    {update === true && (
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                        history.push(`/admin/mapping-subject-chapters/update/${item.class_id}/${MakeSlug(item.class_name)}/${item?.subject_id}/${MakeSlug(item?.subject_name)}/${item?.unit_id}/${item?.unit_name}/${item?._id}`)
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                    )}

                                    {Delete === true && (
                                        <button className="btn bg-danger text-white block btn-sm"
                                            onClick={() => deleteChapter(item?._id)}>
                                            {deleteMutation?.isLoading ?
                                            <span className="fa fa-spinner"></span>
                                            :
                                            <span className="fa fa-trash"></span>
                                            }    
                                        </button>
                                    )}
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
