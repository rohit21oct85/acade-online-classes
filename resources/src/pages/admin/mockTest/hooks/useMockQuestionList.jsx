
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useMockQuestionList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let key = '';
    let url = '';
    
    key = `mock-questions-${params?.question_for}`;
    url = `${API_URL}v1/mock-test/all-question/${params?.question_for}`
    
    return useQuery(`${key}`, async () => {
        
            const result = await axios.get(`${url}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        
    });
    
}
