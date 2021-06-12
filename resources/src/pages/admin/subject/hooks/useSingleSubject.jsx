import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleSubject() {
    const params = useParams();
    const subject_id = params?.subject_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${subject_id}`, async () => {
        if(subject_id !== undefined){
            const result = await axios.get(`${API_URL}v1/subject/view/${subject_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
