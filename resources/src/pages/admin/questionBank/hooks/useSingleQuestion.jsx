import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleQuestion() {
    const params = useParams();
    const qbank_id = params?.qbank_id
    const {state } = useContext(AuthContext);
    const key = params.qbank_id ? `questions-${params.qbank_id}` : `questions`
    return useQuery(`${key}`, async () => {
        if(qbank_id !== undefined){
            const result = await axios.get(`${API_URL}v1/question-bank/view/${qbank_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
