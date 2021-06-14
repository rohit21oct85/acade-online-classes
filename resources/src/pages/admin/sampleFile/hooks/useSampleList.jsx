
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useSampleList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let key = '';
    key = `samples`;
    
    return useQuery(`${key}`, async () => {
        if(
            state.access_token && 
            params?.sample_id 
        ){
            const result = await axios.get(`${API_URL}v1/sample/view-all/${params?.class_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        
            
        }
    });
    
}
