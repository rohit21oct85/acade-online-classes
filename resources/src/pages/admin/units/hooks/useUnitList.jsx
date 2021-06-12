
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useUnitList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let url = '';
    return useQuery(`units-${params.class_id}-${params?.subject_id}`, async () => {
        if(params.class_id && params.subject_id){
            url = `${API_URL}v1/unit/view-all/${params.class_id}/${params.subject_id}`;
        }
        const result = await axios.get(`${url}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+ state.access_token
            }
        });
        return result.data.data; 
    });
    
}
