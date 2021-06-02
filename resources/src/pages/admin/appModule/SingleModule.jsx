import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleModule({module}) {
    return (
        <div className="lg-card">
            <div className="admin-name"> 
                <div className="label-name">
                    <div className="row">
                        <div className="col-md-2 flex mr-3">
                            <button className={`${module?.module_type === 'master_admin' ? 'dark bg-success': 'dark'} mr-2`}>{module?.module_sequence}</button>
                            <span className={`fa ${module?.module_icon} mt-1 mr-1`}></span>
                        </div>
                        <div className="col-md-9">
                            <div>{module?.module_name}</div>
                            <div>{module?.module_type}</div>
                        </div>
                    </div>
                </div>
                <ActionMenu  module={module}/>
            </div> 
        </div>
    )
}
