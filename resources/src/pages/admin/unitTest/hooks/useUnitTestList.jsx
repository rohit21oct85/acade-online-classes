
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useUnitTestList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let key = '';
    key = `unit-tests-${params?.class_id}-${params?.subject_id}`;
    
    return useQuery(`${key}`, async () => {
        if(
            state.access_token && 
            params?.class_id && 
            params?.subject_id &&
            params?.unit_id
        ){
            const result = await axios.get(`${API_URL}v1/unit-test/view-all/${params?.class_id}/${params?.subject_id}/${params?.unit_test}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        
            
        }
    });
    
}
