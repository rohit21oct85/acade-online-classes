import {useContext}  from 'react'
import{useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useAppRoleModules() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const role_slug = params?.role_slug
    const admin_email = params?.admin_email
    return useQuery([`role-modules-${role_slug}-${admin_email}`], async () => {
        if(state?.access_token && role_slug !== undefined){
            const result = await axios.get(`${API_URL}v1/permission/module/${role_slug}/${admin_email}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
