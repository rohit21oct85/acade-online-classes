import React from 'react'
import Loading from '../../../components/Loading';
import useAllSubAdmin from '../../../hooks/subadmin/useAllSubAdmin';
import SingleAdmin from './SingleAdmin';

export default function AllSubAdminList() {
    const {data, isLoading} = useAllSubAdmin();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App admins</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container pr-0">
            {data?.map( admin => { 
                return (
                    <SingleAdmin sub_admin={admin} key={admin?._id}/>
                )
            })}         
            </div>
        </>
    )
}
