import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CreateStudent from './CreateStudent';
import UploadStudents from './UploadStudents';
import AllStudents from './AllStudents';

export default function StudentList() {
    const params = useParams();
    const history = useHistory();
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>Student List</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            <button className="btn btn-sm dark" onClick={e => { history.push(`/admin/students-management/upload`)}}>
                                <span className="fa fa-upload"></span>   Upload Students 
                            </button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-3">
                                { params.page_type == "upload" ? <UploadStudents /> : <CreateStudent /> }
                            </div>
                            
                            <div className="col-md-9 ">
                            <AllStudents />
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
