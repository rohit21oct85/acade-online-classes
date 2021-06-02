import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({sub_admin}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            <span className="fa fa-pencil-square mr-2 text-success pointer" 
                onClick={ e => {
                    e.preventDefault();
                    history.push(`/admin/manage-sub-admin/${sub_admin?._id}`)
                }}
            ></span>
        </div>
    )
}
