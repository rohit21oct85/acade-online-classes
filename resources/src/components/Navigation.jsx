import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory ,NavLink, useLocation, useParams } from "react-router-dom";
import './Nav.css';
import { Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext';
import useAppModule from '../hooks/modules/useAppModule';
import Loading from './Loading';
import useOtherModule from '../hooks/modules/useOtherModule';

export default function Navigation() {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();

    const { state, dispatch } = useContext(AuthContext);
    const {data, isLoading} = useAppModule();
    const {data:modules, isLoading: moduleIsLoading} = useOtherModule()
    
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/admin/login')
        
    }
return (
<>

{state.isLoggedIn && (
<div className="login_menu col-lg-2 col-md-2 col-12" bg="dark" variant="dark" expand="lg">
    <div className="webLogo row" style={{ paddingLeft: '30px'}}>
        <img src="/logo.png" className="mr-2" style={{ width: '15%'}} alt="User"/>
        <h4>AcadeLearn</h4>
    </div>
    <div className="user_area">
        <div className="col-md-12 user_icon">
            <div className="col-md-12 p-0">
                <img src={`/profile.jpg`} className="profileImage"/>

            </div>
        </div>

        <div className="user_options mt-1">
            <div className="col-md-12 p-0 user_details">
                <span className="user_name">{state?.email}</span>
            </div>
            <ul>
                <li as={Link}>
                    <button className="bg-success dark br-10 pl-2 pr-2">
                        <span className="fa fa-lock mr-2"></span> {state?.user_type?.replace('_'," ")}
                    </button>
                </li>
                <li as={Link} onClick={logout} alt="Logout">
                    <button className="bg-danger dark br-10  pl-2 pr-2">
                        <span className="fa fa-power-off mr-2"></span>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <div className="navbar_menus">
        <ul>
            <li>
                <Nav className="ml-auto">
                    <NavLink to={`/admin/dashboard`}> <span className={`bi bi-speedometer text-warning`}></span> Dashboard </NavLink>
                </Nav>
            </li>
            {state?.user_type == 'master_admin' && isLoading && <Loading isLoading={isLoading}/>}

            {state?.user_type == 'master_admin' && data?.map( module => {
                if(module?.module_type === 'master_admin')
                {
                    return (
                    <li key={module?._id} id={module?.module_slug}>
                        <Nav className="ml-auto">
                            <NavLink to={`/admin/${module?.module_slug}`}> <span className={`bi ${module?.module_icon}`}></span> {module?.module_name} </NavLink>
                        </Nav>
                    </li>
                    );
                }
            })}
            
            {state?.user_type == 'master_admin' && data?.map( module => {
                if(module?.module_type === 'sub_admin')
                {
                    return (
                    <li key={module?._id} id={module?.module_slug}>
                        <Nav className="ml-auto">
                            <NavLink to={`/admin/${module?.module_slug}`}> <span className={`bi ${module?.module_icon}`}></span> {module?.module_name} </NavLink>
                        </Nav>
                    </li>
                    );
                }
            })}

            {state?.user_type == state.user_type && state?.user_type !== 'master_admin' && moduleIsLoading && <Loading isLoading={isLoading}/>}
            {state?.user_type === state.user_type && state?.user_type !== 'master_admin' && modules?.map( module => {
                if(module?.role_slug == state.user_type)
                {
                    return (
                    <li key={module?._id} id={module?.module_slug}>
                        <Nav className="ml-auto">
                            <NavLink to={`/admin/${module?.module_slug}`}> <span className={`bi ${module?.module_icon}`}></span> {module?.module_slug} </NavLink>
                        </Nav>
                    </li>
                    );
                }
            })}

            
            


        </ul>
    </div>
            
            
</div>
)}
        
</>             
)
}
