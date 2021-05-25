import React from 'react'
import useClass from '../../../hooks/useClass';
import SingleClass from './SingleClass';
import Loading from '../../../components/Loading';

export default function AllClassList() {
    const {data, isLoading} = useClass();

    return (
        <>
        <p className="form-heading">{console.log(data)}
            <span className="fa fa-plus-circle mr-2"></span>All Classes</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        {data?.map( item => { 
            return (
                <SingleClass item={item} key={item?._id}/>
            )
        })}         
        </div>
    </>
    )
}
