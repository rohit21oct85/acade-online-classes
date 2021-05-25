import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory ,NavLink, useLocation, useParams } from "react-router-dom";
import './Nav.css';
import { Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext';
import useAppModule from '../hooks/useAppModule';
import Loading from './Loading';

export default function Navigation() {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();
    const { state, dispatch } = useContext(AuthContext);
    const {data, isLoading} = useAppModule();
    const [modules, setModules] = useState([]);
    useEffect(setAllModules,[state]);
    async function setAllModules(){
        if(state?.isLoggedIn == "true"){
            setModules(data);
        }
    }
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    
return (
<>

{state.isLoggedIn && (
<div className="login_menu col-lg-2 col-md-2 col-12" bg="dark" variant="dark" expand="lg">
    <div className="webLogo">
        <img src="/logo.png" style={{ width: '62%'}} alt="User"/>
    </div>
    <div className="user_area">
        <div className="col-md-12 user_icon">
            <div className="col-md-12 p-0">
                <img src="/profile.jpg" className="profileImage"/>
            </div>
        </div>

        <div className="user_options mt-1">
            <div className="col-md-12 p-0 user_details">
                <span className="user_name">{state?.email}</span>
            </div>
            <ul>
                <li as={Link}>
                    <button className="bg-warning dark br-10 pl-2 pr-2">
                    {(state.role === "1") ? (
                        <>
                        <span className="fa fa-lock mr-2"></span> Master Admin
                        </>
                    ):' Admin'}
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
                    <NavLink to="/admin/dashboard" > <span className="fa fa-dashboard"></span> Dashboard</NavLink>
                </Nav>
            </li>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/admin/app-module" > <span className="fa fa-gear"></span> App Module </NavLink>
                </Nav>
            </li>
            <Loading isLoading={isLoading}/>
            {data?.map( module => {
                return (
                <li key={module?._id} id={module?.module_slug}>
                    <Nav className="ml-auto">
                        <NavLink to={`/admin/${module?.module_slug}`}> <span className={`fa ${module?.module_icon}`}></span> {module?.module_name} </NavLink>
                    </Nav>
                </li>
                );
            })}
        </ul>
    </div>
            
            
</div>
)}
        
</>             
)
}
