import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleAdmin({sub_admin}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div className="col-md-10">
                    <div className="flex">Name: <span>{sub_admin?.first_name} {sub_admin?.last_name}</span></div>
                    <div className="flex">Email: <span>{sub_admin?.email}</span></div>
                    <div className="flex">Role: <span>{sub_admin?.role}</span></div>
                </div>
                <ActionMenu  sub_admin={sub_admin}/>
            </div> 
        </div>
    )
}
