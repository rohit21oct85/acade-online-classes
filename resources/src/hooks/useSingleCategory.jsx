import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import API_URL from '../helper/APIHelper'

export default function useSingleCategory() {
    const params = useParams();
    const category_id = params?.category_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-category-${category_id}`, async () => {
        if(category_id !== undefined){
            const result = await axios.get(`${API_URL}v1/category/view/${category_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
