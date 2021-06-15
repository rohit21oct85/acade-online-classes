import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleUnitTest() {
    const params = useParams();
    const test_id = params?.test_id
    const {state } = useContext(AuthContext);
    const key = params.test_id ? `unit-tests-${params.test_id}` : `unit-tests`
    return useQuery(`${key}`, async () => {
        if(test_id !== undefined){
            const result = await axios.get(`${API_URL}v1/unit-test/view/${test_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
