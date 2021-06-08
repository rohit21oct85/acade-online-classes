import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import useDeleteTeacherSubjectMapping from '../../../hooks/teacherSubjectMapping/useDeleteTeacherSubjectMapping';

export default function ActionMenu({mapping}) {
    const history = useHistory();
    let id = null
    const deleteMutation = useDeleteTeacherSubjectMapping(id);
    async function handleDelete(e){
        id = e;
        await deleteMutation.mutate(e);
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
            <button className="btn btn-sm dark"
            onClick={()=>handleDelete(mapping._id)}>
            {deleteMutation?.isLoading ?
            <span className="fa fa-spinner"></span>
            :<span className="fa fa-trash"></span>
            }    
            </button>
        </div>
    )
}
