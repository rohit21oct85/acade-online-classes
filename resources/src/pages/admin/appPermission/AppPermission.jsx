import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateAppPermission from './CreateAppPermission';
import AppPermissionList from './AppPermissionList.jsx';

import './style.css'

export default function AppPermission() {
    const history = useHistory();

     return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>
                        <span className="bi bi-gear-wide-connected text-warning mr-2"></span> 
                        App Permissions</h2>
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
                                <CreateAppPermission />
                            </div>
                            <div className="col-md-9">
                                <AppPermissionList />
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
