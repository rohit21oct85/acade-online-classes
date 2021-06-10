import useUnitList from '../hooks/useUnitList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
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
      const {data, isLoading} = useUnitList();
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
            
        </div>
    </>
    )
}
