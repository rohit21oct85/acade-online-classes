
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useQuestionList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = params.qbank_id ? `questions-${params.qbank_id}` : `questions`
    return useQuery(key, async () => {
        if(state.access_token){
            const result = await axios.get(`${API_URL}v1/questions/view-all`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        
            
        }
    });
    
}
