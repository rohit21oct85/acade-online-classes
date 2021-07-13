import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useAttemptTestList() {
    const {state } = useContext(AuthContext);
    return useQuery('schools', async () => {
        if(state.access_token){
            const result = await axios.get(`${API_URL}v1/school/view-all`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
