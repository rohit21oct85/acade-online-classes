import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleUnit() {
    const params = useParams();
    const unit_id = params?.unit_id
    const {state } = useContext(AuthContext);
    const key = params.unit_id ? `units-${params.unit_id}` : `units`
    return useQuery(`${key}`, async () => {
        if(unit_id !== undefined){
            const result = await axios.get(`${API_URL}v1/unit/view/${unit_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
