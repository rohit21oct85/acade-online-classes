import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateCategory from './../category/CreateCategory';
import AllClassList from './AllClassList';
import CreateSegment from './../category/CreateSegment';
import AllSegmentList from './../category/AllSegmentList';  

export default function CategoryList() {
    const params = useParams();
    const history = useHistory();
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                    {params?.action_type == 'link-segments' ? (
                            <h2>All Segments - {params?.category_slug}</h2>
                        ):(
                            <h2>Category List</h2>
                        )}
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                        {params?.action_type == 'link-segments' ? (
                            <button className="btn btn-sm dark" onClick={e => { history.push(`/category-management/${params?.category_id}`)}}>
                                <span className="fa fa-arrow-left"></span>
                            </button>
                        ) : (
                            <button className="btn btn-sm dark" onClick={e => { history.push(`/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                        )}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                                {params?.action_type == 'link-segments' ? (
                                    <CreateSegment />
                                ) : (
                                    <CreateCategory />
                                )}
                            </div>
                            
                            <div className="col-md-9 ">
                            {params?.action_type == 'link-segments' ? (
                                    <AllSegmentList />
                                ) : (

                                    <AllClassList />
                                )}
                                
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
