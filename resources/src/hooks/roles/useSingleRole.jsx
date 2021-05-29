import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import API_URL from '../../helper/APIHelper'

export default function useSingleRole() {
    const params = useParams();
    const role_id = params?.role_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${role_id}`, async () => {
        if(role_id !== undefined){
            const result = await axios.get(`${API_URL}v1/role/view/${role_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
