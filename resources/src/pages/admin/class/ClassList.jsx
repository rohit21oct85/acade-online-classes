import React, { useEffect,useState } from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import CreateClass from './CreateClass';
import UploadClasses from './UploadClasses';
import AllClasses from './AllClasses';

export default function ClassList() {
    const params = useParams();
    const history = useHistory();
    const location = useLocation();

    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Class List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            <button className="btn btn-sm dark" onClick={e => { 
                                if(params.page_type == undefined){
                                    history.push(`/admin/class-management/upload`)
                                }else if(params.page_type == "upload"){
                                    history.push(`/admin/class-management`)
                                }
                                }}>
                                <span className="fa fa-upload"></span>   Upload Classes 
                            </button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                                { params.page_type == "upload" ? <UploadClasses /> : <CreateClass /> }
                            </div>
                            <div className="col-md-9 ">
                            <AllClasses />
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
