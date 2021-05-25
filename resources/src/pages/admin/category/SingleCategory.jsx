import React from 'react'
import ActionMenu from './ActionMenu'
import * as utils from '../../../utils/utils';

export default function SingleCategory({category}) {
    return (
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
    )
}
