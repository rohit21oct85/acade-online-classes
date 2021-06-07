import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({sub_admin}) {

    const history = useHistory();

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
            <button className="btn btn-sm dark"
            onClick={ e => {
                e.preventDefault();
                history.push(`/admin/manage-sub-admin/${sub_admin?._id}`)
            }}>
            <span className="fa fa-pencil-square text-white"></span>
            </button>

        </div>
    )
}
