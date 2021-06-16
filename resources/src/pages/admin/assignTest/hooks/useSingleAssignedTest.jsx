import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleAssignedTest() {
    const params = useParams();
    const sample_id = params?.sample_id
    const {state } = useContext(AuthContext);
    const key = params.sample_id ? `sample-${params.sample_id}` : `sample`
    return useQuery(`${key}`, async () => {
        if(sample_id !== undefined){
            const result = await axios.get(`${API_URL}v1/sample/view/${sample_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
