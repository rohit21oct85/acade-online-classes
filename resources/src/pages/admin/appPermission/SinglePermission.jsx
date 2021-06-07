import React from 'react'
import ActionMenu from './ActionMenu'

export default function SinglePermission({permission}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div>
                    <div className="label-name">
                        <span className={`fa fa-send mt-1 mr-2`}></span>
                        {permission?.email}
                    </div>
                    <div className="label-name">
                        <span className={`fa ${permission?.module_icon} mt-1 mr-2`}></span>
                        {permission?.module_slug}
                    </div>
                    <div className="label-name">
                        <span className={`fa fa-lock mt-1 mr-3`}></span>
                        {permission?.role_slug}
                    </div>
                    <div className="label-name">
                        <span className={`fa fa-gear mt-1 mr-3`}></span>
                        {permission?.method_name}
                    </div>
                </div>
                <ActionMenu  permission={permission}/>
            </div> 
        </div>
    )
}