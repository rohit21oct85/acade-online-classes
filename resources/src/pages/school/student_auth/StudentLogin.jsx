import React , {useState, useEffect,useRef, useContext} from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom'


import {AuthContext} from '../../../context/AuthContext';
import './StudentLogin.css';
import axios from 'axios'
import API_URL from '../../../helper/APIHelper.jsx';
import { useToasts } from 'react-toast-notifications';

export default function StudentLogin() {
    const history = useHistory();
    const location = useLocation();
    const { addToast } = useToasts();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const {dispatch,state } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if(email === ''){
            addToast('Please enter email address', { appearance: 'error',autoDismiss: true });
            return false;
        }else if(password === ''){
            addToast('Please enter password', { appearance: 'error',autoDismiss: true });
            passwordRef.current.focus()
            return false;
        }else{
            setLoading(true);
            const formData = {email: emailRef.current.value , password: passwordRef.current.value};
            const response = await axios.post(`${API_URL}v1/admin/login`, formData);
            // console.log(response)
            if(response.response && response.response.status){
                addToast('Please enter valid email or password', { appearance: 'error',autoDismiss: true });
                setLoading(false);
            }else{
                let access_token = response.data.accessToken
                let refresh_token = response.data.refreshToken
                let fullname = response.data.admin.fullname
                let email = response.data.admin.email
                let role = response.data.admin.role
                let user_type = 'student'
                let created_at = response.data.admin.created_at
                
                let isLoggedIn = true;
                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('fullname', fullname);
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);
                localStorage.setItem('user_type', user_type);
                localStorage.setItem('created_at', created_at);
                localStorage.setItem('isLoggedIn', isLoggedIn);
                const payloadData = {
                    isLoggedIn,
                    fullname,
                    email,
                    role,
                    user_type,
                    created_at,
                    access_token,
                    refresh_token
                }
                if(isLoggedIn){
                    dispatch({type: 'LOGIN', payload: payloadData});

                    if(role === "1"){
                        history.push(`/school/admin/dashboard`)
                    }
                    else if(role === "2"){
                        history.push('/school/teachers/dashboard')
                    }   
                    else if(role === "3"){
                        history.push('/school/students/dashboard')
                    }   
                }
            }
            
        }   
    }
    
    useEffect(checkLoggedInUser,[state]);
    async function checkLoggedInUser(){
        if(state?.isLoggedIn === true){
            if(state?.role === "3"){
                history.push('/school/students/dashboard')
            }   
        }else{
            if(location?.pathname == '/school/student/login'){
                history.push('/school/student/login');
            }
        }
    }

    return (
        <div className="container-fluid p-0 m-0 text-center StudentLoginBg" style={{
            background: `url('/bg.jpg')`
        }}>
            <div className="col-md-4" style={{ 
                position: 'absolute'
            }}>
                <NavLink to="/">
                    <img className="logo" alt="company Logo" src="/logo.png"/>
                </NavLink>
            </div>
            <div className="row no-gutter">
                <div className="col-md-3 StudentLoginDiv">
                    <h4>School Student Login </h4>    
                    <hr />
                
                <form autoComplete="Off" onSubmit={submitForm}>
                    <div className="form-group text-left">
                        <label> <span className="fa fa-send mr-2"></span> Email address</label>
                        <input className="form-control" type="email" autoComplete="off" ref={emailRef} placeholder="Enter email" />
                        <p className="text-muted mt-2">
                            We'll never share your email with anyone else.
                        </p>
                    </div>
                    <hr />
                    <div className="form-group text-left">
                        <label> <span className="fa fa-lock mr-2"></span> Password</label>
                        <input className="form-control" type="password" autoComplete="Off" ref={passwordRef} placeholder="Password" />
                        <p className="text-muted mt-2">
                            We'll never share your password with anyone else.
                        </p>
                    </div>
                    <hr />
                    <button 
                        className="btn btn-md btn-block btn-success dark w-100" 
                        type="submit"
                    >
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"> </span> Authenticating...
                            </>
                        ):(
                            <>
                            <span className="fa fa-lock mr-2"> </span> Login Your Account
                            </>
                        )}
                    </button>
                    <hr />
                    </form>
                </div>
            </div>
            
        </div>
    )
}
 