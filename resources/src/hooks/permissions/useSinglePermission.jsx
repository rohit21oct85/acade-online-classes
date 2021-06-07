import {useParams, useLocation} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import API_URL from '../../helper/APIHelper'

export default function useSinglePermission(type) {
    const params = useParams();
    const location = useLocation();
    const {state } = useContext(AuthContext);

    const module_slug = location.pathname.split('/')[1];
    const role_slug = state?.user_type
    return useQuery(`single-permission-${module_slug}`, async () => {
        if(module_slug !== undefined){
            const result = await axios.get(`${API_URL}v1/permission/view/${module_slug}/${role_slug}/${type}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
