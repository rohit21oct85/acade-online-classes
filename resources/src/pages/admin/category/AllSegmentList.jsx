import React from 'react'
import Loading from '../../../components/Loading';
import useSingleCategory from '../../../hooks/useSingleCategory'
import * as utils from '../../../utils/utils'
import ActionSegmentMenu from './ActionSegmentMenu';

export default function AllSegmentList() {
    const {data, isLoading} = useSingleCategory();
    return (
        <div>
            <p>All Segments List</p>
            <hr className="mt-1 mb-1"/>
            <Loading isLoading={isLoading}/>

            <div className="row col-md-12 data-container-category" >
            {data?.segments?.map(segment => {
                return(
                    <div className="lg-card" key={segment?._id}>
                        <div className="row">
                            <div className="col-md-3 pr-0">
                                <div className="name-main">
                                    <img src={segment?.icon} className="img-responsive category_icon"/>
                                </div>
                            </div>
                            
                            <div className="col-md-9 pl-0">
                                <div className="name-main">
                                    {segment?.name}
                                </div>
                                <hr className="clearfix mt-1 mb-2"/>
                                <div className="name-main">
                                    {utils.GetString(segment?.about, 75)}
                                </div>
                            </div>

                        </div>
                        
                        <hr className="mt-1 mb-2"/> 
                        <ActionSegmentMenu segment={segment}/>
                    </div>
                )
            })}
            </div>

        </div>
    )
}
