import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({permission}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            <button className="btn btn-sm dark"
            onClick={ e => {
                e.preventDefault();
                history.push(`/admin/app-permissions/${permission?._id}`)
            }}>
            <span className="fa fa-pencil-square mr-2"></span>
                Edit
            </button>
        </div>
    )
}
