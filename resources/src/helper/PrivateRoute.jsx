import React,{useContext} from 'react';
import { Route, Redirect } from "react-router-dom"
import {AuthContext} from '../context/AuthContext.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {state} = useContext(AuthContext);
    return (
        <Route {...rest} render={props => (
            state.isLoggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
        )} />
    )
    
}

export default PrivateRoute;