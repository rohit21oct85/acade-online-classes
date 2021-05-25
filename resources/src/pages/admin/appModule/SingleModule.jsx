import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleModule({module}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div className="name-main">
                    <span className={`fa ${module?.module_icon} mt-1 mr-2`}></span>
                    {module?.module_name}
                </div>
                <ActionMenu  module={module}/>
            </div> 
        </div>
    )
}
