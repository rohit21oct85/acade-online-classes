import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import API_URL from '../../helper/APIHelper'

export default function useSinglePermission() {
    const params = useParams();
    const permission_id = params?.permission_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-permission-${permission_id}`, async () => {
        if(permission_id !== undefined){
            const result = await axios.get(`${API_URL}v1/permission/view/${permission_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
