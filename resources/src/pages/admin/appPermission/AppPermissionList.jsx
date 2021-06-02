import React from 'react'
import { useParams } from 'react-router';
import Loading from '../../../components/Loading';
import useAppPermission from '../../../hooks/permissions/useAppPermissions';
import SinglePermission from './SinglePermission';

export default function AppPermissionList() {
    const {data, isLoading} = useAppPermission();
    const params = useParams();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Permissions for
            <span className="badge-danger br-5 ml-2 p-1"
            style={{
                fontSize: '0.90rem'
            }}>{params?.role_slug?.replaceAll('-'," ")}</span>

            </p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
            
            {data?.map( permission => { 
                return (
                    <SinglePermission permission={permission} key={permission?._id}/>
                )
            })}         
            </div>
        </>
    )
}
