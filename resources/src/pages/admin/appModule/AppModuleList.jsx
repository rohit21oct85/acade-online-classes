import React from 'react'
import Loading from '../../../components/Loading';
import useAppModule from '../../../hooks/useAppModule';
import SingleModule from './SingleModule';

export default function AppModuleList() {
    const {data, isLoading} = useAppModule();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Modules</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
            
            {data?.map( module => { 
                return (
                    <SingleModule module={module} key={module?._id}/>
                )
            })}         
            </div>
        </>
    )
}
