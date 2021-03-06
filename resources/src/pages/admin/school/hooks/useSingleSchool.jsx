import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleSchool(school_id) {
    const params = useParams();
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${school_id}`, async () => {
        if(school_id !== undefined){
            const result = await axios.get(`${API_URL}v1/school/view/${school_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
