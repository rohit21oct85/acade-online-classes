import {useContext}  from 'react'
import { useParams } from 'react-router';
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSubjectClassList() {
    const {state } = useContext(AuthContext);
    const params   = useParams();
    return useQuery(`subject-class-${params?.subject_id}`, async () => {
        if(state.access_token && params?.subject_id){
            const result = await axios.get(`${API_URL}v1/subject/view-all-class/${params?.subject_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
