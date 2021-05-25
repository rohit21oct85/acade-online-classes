import React,{useContext} from 'react';
import { Route, Redirect } from "react-router-dom"
import {AuthContext} from '../context/AuthContext.jsx';

const AdminRoute = ({ component: Component, ...rest }) => {
    const {state} = useContext(AuthContext);
    return (
        <Route {...rest} render={props => (
            (state.role == "1") ? <Component {...props} /> : <Redirect to={{ pathname: '/403' }} />
        )} />
    )
    
}



export default AdminRoute;