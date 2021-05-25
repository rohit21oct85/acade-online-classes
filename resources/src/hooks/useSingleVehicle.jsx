import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import API_URL from '../helper/APIHelper'

export default function useSingleVehicle() {
    const params = useParams();
    const vehicle_id = params?.vehicle_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-vehicle-${vehicle_id}`, async () => {
        if(vehicle_id !== undefined){
            const result = await axios.get(`${API_URL}v1/vehicle/view/${vehicle_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
