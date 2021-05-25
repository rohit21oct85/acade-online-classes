import React,{useReducer} from 'react'

const fullname =  localStorage.getItem('fullname');
const email = localStorage.getItem('email');
const role = localStorage.getItem('role');
const created_at = localStorage.getItem('created_at');
const isLoggedIn = localStorage.getItem('isLoggedIn')
const access_token =  localStorage.getItem('access_token');
const refresh_token =  localStorage.getItem('refresh_token');

const initialState = {
    isLoggedIn: isLoggedIn ? isLoggedIn : false,
    fullname: fullname? fullname: null,
    email: email ? email : null,
    role: role ? role : null,
    created_at: created_at ? created_at : null,
    access_token: access_token? access_token: null,
    refresh_token: refresh_token? refresh_token: null
}
export const AuthContext = React.createContext(initialState);

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn, 
                fullname: action.payload.fullname, 
                email: action.payload.email, 
                role: action.payload.role, 
                created_at: action.payload.created_at, 
                access_token: action.payload.access_token, 
                refresh_token: action.payload.refresh_token, 
            }
            
        case 'LOGOUT':
            localStorage.clear();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('fullname');
            localStorage.removeItem('email');    
            return {
                ...state,
                isLoggedIn: false,
                fullname: null,
                email: null,
                access_token: null,
                refresh_token: null,
            }    
        default:
            return state;
    }  
}

function AuthProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AuthContext.Provider value={{ state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
