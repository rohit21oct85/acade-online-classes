import React,{useContext} from 'react';
import { Route, Redirect, useLocation } from "react-router-dom"
import {AuthContext} from '../context/AuthContext.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {state} = useContext(AuthContext);
    return (
        <Route {...rest} render={props => 
            (
                state.isLoggedIn == 'true' ? <Component {...props} /> : <Redirect to={{ pathname: '/admin/login' }} />
            )
        
        } />
    )
}
export default PrivateRoute;