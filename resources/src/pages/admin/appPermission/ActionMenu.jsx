import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import useDeletePermission from '../../../hooks/permissions/useDeletePermission';

export default function ActionMenu({permission}) {
    const history = useHistory();
    const [formData, setFormdata] = useState();
    const deleteMutation = useDeletePermission(formData);
    async function handleDelete(e){
        e.preventDefault();
        
        setFormData({...formData, permission_id: permission?._id});
        await deleteMutation.mutate(formData);
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
            <button className="btn btn-sm dark"
            onClick={handleDelete}>
            {deleteMutation?.isLoading ?
            <span className="fa fa-spinner"></span>
            :<span className="fa fa-trash"></span>
            }    
            </button>
        </div>
    )
}
