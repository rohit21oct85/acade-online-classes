import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleRole({role}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div className="name-main">
                    RoleName: {role?.role_name}
                </div>
                
                <div className="name-main">
                    RoleID: {role?.role_id}
                </div>

                <ActionMenu  role={role}/>
            </div> 
        </div>
    )
}
