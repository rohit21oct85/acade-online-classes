import React from 'react'
import Loading from '../../../components/Loading';
import useAppPermission from '../../../hooks/permissions/useAppPermissions';
import SingleRole from './SingleRole';

export default function AppPermissionList() {
    const {data, isLoading} = useAppPermission();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Permissions</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
            
            {data?.map( permission => { 
                return (
                    <SingleRole permission={permission} key={permission?._id}/>
                )
            })}         
            </div>
        </>
    )
}
