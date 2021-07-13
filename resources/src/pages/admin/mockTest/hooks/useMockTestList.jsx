
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useLocation, useParams} from 'react-router-dom'

export default function useMockTestList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const location = useLocation();
    const path = location.pathname.split('/')
    let key = '';
    let url = '';
    let mock_test_for = localStorage.getItem('mock_test_for');
    if(path[2] == 'assign-test'){
        url = `${API_URL}v1/mock-test/view-all/${mock_test_for}/active`
    }else{
        url = `${API_URL}v1/mock-test/view-all/${params?.question_for}`
    }
    key = `mock-questions-${params?.question_for}`;
   
    
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
