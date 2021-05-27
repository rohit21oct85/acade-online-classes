import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useSingleSchool() {
    const params = useParams();
    const class_id = params?.class_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${class_id}`, async () => {
        if(class_id !== undefined){
            const result = await axios.get(`${API_URL}v1/class/view/${class_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
