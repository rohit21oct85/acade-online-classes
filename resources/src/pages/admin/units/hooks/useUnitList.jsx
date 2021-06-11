
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useUnitList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = params?.subject_id ? `units-${params?.subject_id}` : `units`
    return useQuery(key, async () => {
        if(params.class_id && params.subject_id){
            const result = await axios.get(`${API_URL}v1/unit/view-all/${params.class_id}/${params.subject_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        }else{
            const result = await axios.get(`${API_URL}v1/unit/view-all`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
