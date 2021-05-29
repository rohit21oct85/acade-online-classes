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
           
            <div className="col-md-12 row no-gutter data-container-category">
            {/* {data?.map( category => { 
                return (
                    <SingleCategory category={category} key={category?._id}/>
                )
            })}          */}
            <div className="lg-card">
            <div className="row">
                <div className="col-md-3 pr-0">
                    <div className="name-main">
                        <img src={category?.category_image} className="img-responsive category_icon"/>
                    </div>
                </div>
                
                <div className="col-md-9 pl-0">
                    <div className="name-main">
                        {category?.category_name}
                    </div>
                    <hr className="clearfix mt-1 mb-2"/>
                    <div className="name-main">
                        {utils.GetString(category?.category_details, 75)}
                    </div>
                </div>

            </div>
            
            <hr className="mt-1 mb-2"/> 
                <ActionMenu  category={category}/>
        </div>
            </div>
        </>
    )
}
