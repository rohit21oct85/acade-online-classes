import React , {useContext} from 'react';
import { Link } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.jsx';

export default function NotAuthorized() {
    const { state } = useContext(AuthContext);
    return (
        <>
        {state.isLoggedIn && (
            <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container pt-5 text-center">
                    <img src="/noentry.jpg" alt="Not authorized"/>
                    <p>You are not authorized to access this resource</p>
                    <Link to={`/admin/dashboard`}>
                        <span className="fa fa-home"></span>
                        <span className="ml-3">
                            Go to Dashboard
                        </span>
                    </Link>
                </div>
            </div>
            </div>
        )}
        </>
    );
}
 