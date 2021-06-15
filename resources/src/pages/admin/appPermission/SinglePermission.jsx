import React from 'react'
import ActionMenu from './ActionMenu'
import * as helper from '../../../utils/helper';
export default function SinglePermission({permission}) {
    const method_name = helper.getMethodName(permission?.method_name);

    return (
        <div className="mb-1 col-md-3 pl-2 flex b1" id={permission?._id}>
            <div>
                {method_name === 'create' && (<span className={`bi bi-plus-circle-fill mt-1 mr-1`}></span>)}
                {method_name === 'update' && (<span className={`bi bi-pencil-square mt-1 mr-1`}></span>)}
                {method_name === 'upload' && (<span className={`bi bi-cloud-upload mt-1 mr-1`}></span>)}
                {method_name === 'delete' && (<span className={`bi bi-trash2-fill mt-1 mr-1`}></span>)}
                
                {method_name}
            </div>
            <ActionMenu  permission={permission}/>
        </div>
    )
}
