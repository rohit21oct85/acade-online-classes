import React from 'react'
import useCategory from '../../../hooks/useCategory';
import SingleCategory from './SingleCategory';
import Loading from '../../../components/Loading';

export default function AllCategoryList() {
    const {data, isLoading} = useCategory();
    return (
        <>
            <p className="form-heading">
                <span className="fa fa-plus-circle mr-2"></span>All Category</p>
            <hr className="mt-1"/>
            <Loading isLoading={isLoading} /> 
            <div className="col-md-12 row no-gutter data-container-category">
            {data?.map( category => { 
                return (
                    <SingleCategory category={category} key={category?._id}/>
                )
            })}         
            </div>
        </>
    )
}
