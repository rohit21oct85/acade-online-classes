import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import useDeletePermission from '../../../hooks/permissions/useDeletePermission';

export default function ActionMenu({permission}) {
    const history = useHistory();
    const [formData, setFormData] = useState();
    const deleteMutation = useDeletePermission(formData);
    async function handleDelete(id){
        let permission_id = id
        await deleteMutation.mutate({permission_id: permission_id});
        setTimeout(() => {
            document.getElementById(`${permission_id}`).style.display = "none";
        },1500)
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row'}}>
            <span style={{ cursor: 'pointer'}}
            className="text-danger"
            onClick={handleDelete.bind(this, permission?._id)}>
            {deleteMutation?.isLoading 
            ?
                <span className="fa fa-spinner"></span>
            :
                <span className="fa fa-trash"></span>
            }    
            </span>
        </div>
    )
}
