import {useContext}  from 'react'
import{useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useAppPermissions() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const school_slug = params?.school_slug
    const role_slug = params?.role_slug
    return useQuery([`permissions-${school_slug}-${role_slug}`], async () => {
        if(state?.access_token && school_slug !== undefined && role_slug !== undefined){
            const result = await axios.get(`${API_URL}v1/permission/view-all/${school_slug}/${role_slug}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
