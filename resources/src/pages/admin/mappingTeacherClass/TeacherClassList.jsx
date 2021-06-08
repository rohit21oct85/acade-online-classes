import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateTeacherClassMap from './CreateTeacherClassMap';
import AllTeacherClassMapping from './AllTeacherClassMapping';

export default function TeacherClassList() {
    const params = useParams();
    const history = useHistory();
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Teacher List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                                <CreateTeacherClassMap />
                            </div>
                            
                            <div className="col-md-9 ">
                                <AllTeacherClassMapping />
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
