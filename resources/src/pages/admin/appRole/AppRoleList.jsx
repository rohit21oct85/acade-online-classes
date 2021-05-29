import React from 'react'
import Loading from '../../../components/Loading';
import useAppRole from '../../../hooks/roles/useAppRoles';
import SingleRole from './SingleRole';

export default function AppRoleList() {
    const {data, isLoading} = useAppRole();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Roles</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
            
            {data?.map( role => { 
                return (
                    <SingleRole role={role} key={role?._id}/>
                )
            })}         
            </div>
        </>
    )
}
