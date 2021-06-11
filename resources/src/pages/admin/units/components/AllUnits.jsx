import useUnitList from '../hooks/useUnitList';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';

import React, {useState, useContext} from 'react'
import useDeleteUnit from '../hooks/useDeleteUnit';

export default function AllUnits({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data:units, isLoading} = useUnitList();
      const deleteMutation = useDeleteUnit();
      const deleteUnit = async (id) => {
            await deleteMutation.mutate(id)
      }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>All Units</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Unit No</th>
                        <th scope="col">Unit Name</th>
                        <th scope="col">Class Name</th>
                        <th scope="col">Subject Name</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units && units?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <td>{item.unit_no}</td>
                                <td>{item.unit_name}</td>
                                <td>{item.class_name}</td>
                                <td>{item.subject_name}</td>
                                <td>
                                    {update === true && (
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                        history.push(`/admin/manage-units/update/${item.class_id}/${item?.subject_id}/${item?._id}`)
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                    )}

                                    {Delete === true && (
                                        <button className="btn bg-danger text-white btn-sm"
                                            onClick={() => deleteUnit(item?._id)}>
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
