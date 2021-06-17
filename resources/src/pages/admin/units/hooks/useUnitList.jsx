
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
    let key = '';
    if(params?.class_id && params?.subject_id){
        key = `units-${params.class_id}-${params?.subject_id}`;
        url = `${API_URL}v1/unit/view-all/${params?.class_id}/${params?.subject_id}`;
    }else if(params?.class_id){
        key = `units-${params.class_id}`;
        url = `${API_URL}v1/unit/view-all/${params?.class_id}`;
    }else{
        key = `units`;
        url = `${API_URL}v1/unit/view-all/`;
    }
    return useQuery(key, async () => {
        const result = await axios.get(`${url}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+ state.access_token
            }
        });
        return result.data.data; 
    });
    
}
