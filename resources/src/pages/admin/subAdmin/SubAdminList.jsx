import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateNewAdmin from './CreateNewAdmin';
import AllSubAdminList from './AllSubAdminList';

import './style.css'
export default function SubAdminList() {
    const params = useParams();
    const history = useHistory();
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Sub Admin List</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark" onClick={e => { history.push(`/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                                <CreateNewAdmin />
                            </div>
                            <div className="col-md-9">
                                <AllSubAdminList />
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
