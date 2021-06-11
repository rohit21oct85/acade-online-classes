import React from 'react'
import ActionMenu from './ActionMenu'

export default function SinglePermission({permission}) {
    return (
        <div className="col-md-12 ml-5 flex mb-2" id={permission?._id}>
                <div>
                    <span>
                        <span className={`fa fa-gear mt-1 mr-1`}></span>
                        {permission?.method_name}
                    </span>
                </div>
                <div className="flex pr-2">
                    <div className="mr-5">
                        <span className={`fa fa-lock mt-1 mr-1`}></span>
                        {permission?.role_slug}
                    </div>
                    <ActionMenu  permission={permission}/>
                </div>
                
             
        </div>
    )
}
