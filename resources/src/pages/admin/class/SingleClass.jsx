import React from 'react'
import ActionMenu from './ActionMenu'
import * as utils from '../../../utils/utils';

export default function SingleCategory({item}) {
    return (
        <div className="lg-card">{console.log(item?.class_name)}
            <div className="row">
                <div className="col-md-3 pr-0">
                    <div className="name-main">
                        <img src={item?.category_image} className="img-responsive category_icon"/>
                    </div>
                </div>
                
                <div className="col-md-9 pl-0">
                    <div className="name-main">
                        {item?.class_name}
                    </div>
                    <hr className="clearfix mt-1 mb-2"/>
                    <div className="name-main">
                        {item?.class_teacher}
                    </div>
                    <hr className="clearfix mt-1 mb-2"/>
                    <div className="name-main">
                        {item?.section}
                    </div>
                </div>

            </div>
            
            <hr className="mt-1 mb-2"/> 
                <ActionMenu  category={item}/>
        </div>
    )
}
