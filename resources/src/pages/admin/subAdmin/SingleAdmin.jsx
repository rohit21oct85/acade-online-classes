import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleAdmin({sub_admin}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div>
                    <div className="label-name">
                        <span className={`bi bi-person-circle mt-1 mr-3`}></span>
                        {sub_admin?.first_name} {sub_admin?.last_name}
                    </div>
                    <div className="label-name">
                        <span className={`fa fa-send mt-1 mr-3`}></span>
                        {sub_admin?.email}
                    </div>
                    <div className="label-name">
                        <span className={`fa fa-lock mt-1 mr-3`}></span>
                        {sub_admin?.role === 2 && 'sub_admin'}
                        {sub_admin?.role === 3 && 'mapping admin'}
                    </div>

                </div>
                <ActionMenu  sub_admin={sub_admin}/>
            </div> 
        </div>
    )
}
