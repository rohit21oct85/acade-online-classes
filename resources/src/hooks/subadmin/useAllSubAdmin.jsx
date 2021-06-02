import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useAllSubAdmin() {
    const {state } = useContext(AuthContext);
    return useQuery('sub-admins', async () => {
        if(state.access_token && state?.user_type == 'master_admin'){
            const result = await axios.get(`${API_URL}v1/admin/view-all`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
