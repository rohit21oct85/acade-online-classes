import React, { useContext } from 'react'
import {AuthContext} from '../../../context/AuthContext';

export default function SchoolAdminDashboard() {
      const {state} = useContext(AuthContext);

      return (
            <>
{state.isLoggedIn && (
   
<div className="col-lg-10 col-md-10 main_dash_area">
    <div className="main-area-all">
        <div className="dashboard_main-container">
            <div className="">
                  <div className="dash-main-head row">
                        <div className="col-md-12 pt-0">
                              <h2 style={{ padding: '7px 15px'}}> 
                              Welcome, {state?.school_slug?.replaceAll('-',' ')} 
                              <img 
                              className="img-responsive ml-2"
                              src={`https://drive.google.com/uc?export=view&id=${state?.school_logo}`} 
                              style={{ width: '50px'}}
                              />
                              </h2>
                        </div>
                  </div>
            </div>
            <div className="dash_over_view">
                <div className="row">
                    <div className="col-md-12 pl-0">

                    </div>
                </div>    
            </div>
        </div>
    </div>
    
</div>  
)}   
</>

            
            
      )
}
