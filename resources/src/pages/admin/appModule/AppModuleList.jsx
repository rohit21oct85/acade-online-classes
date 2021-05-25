import React from 'react'
import useAppModule from '../../../hooks/useAppModule';
import SingleModule from './SingleModule';

export default function AppModuleList() {
    const {data, isLoading} = useAppModule();
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Modules</p>
            <hr className="mt-1"/>
            {isLoading && (<div class="spinner-border" role="status"> <span class="sr-only">Loading...</span> </div>)}
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
