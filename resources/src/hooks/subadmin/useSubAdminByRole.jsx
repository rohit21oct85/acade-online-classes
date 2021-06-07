import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'
import { useParams } from 'react-router-dom';

export default function useSubAdminByRole() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const role = params?.role
    return useQuery(`sub-admins-${role}`, async () => {
        if(state.access_token && state?.user_type == 'master_admin'){
            const result = await axios.get(`${API_URL}v1/admin/role-view-all/${role}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
