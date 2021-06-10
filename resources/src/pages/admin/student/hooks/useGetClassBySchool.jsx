
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useGetClassBySchoolList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    return useQuery('students', async () => {
        if(state.access_token){
            const result = await axios.get(`${API_URL}v1/class/get-class-by-school`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
