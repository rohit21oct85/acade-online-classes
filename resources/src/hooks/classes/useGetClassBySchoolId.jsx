
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'
import {useHistory, useParams, useLocation} from 'react-router-dom'

export default function useGetClassBySchoolId(id) {
    const {state } = useContext(AuthContext);
    const params = useParams();
//     console.log(params)
    return useQuery(`classes-${id}`, async () => {
        if(state.access_token){
            // return axios.get(`${API_URL}v1/class/class-by-school-id/${id}`, options)
            const result = await axios.get(`${API_URL}v1/class/class-by-school-id/${id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        }
    });
}
