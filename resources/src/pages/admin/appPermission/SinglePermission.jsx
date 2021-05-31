import React from 'react'
import ActionMenu from './ActionMenu'

export default function SinglePermission({permission}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div className="label-name">
                    Module Name: 
                </div>
                
                <div className="label-name">
                    <span className={`fa ${permission?.module_icon} mt-1 mr-2`}></span>
                    {permission?.module_slug}
                </div>

                <ActionMenu  permission={permission}/>
            </div> 
        </div>
    )
}
