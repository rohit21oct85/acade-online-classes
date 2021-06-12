import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useDeleteUnit(formData) {
      const params = useParams()

      const location = useLocation();
      const path  = location.pathname;
      
      const history = useHistory();
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      const status =  useMutation((formData) => {
            return axios.post(`${API_URL}v1/unit/delete`,formData, options)
        },{
            onSuccess: () => {
                  queryClient.invalidateQueries(`units-${params?.class_id}-${params?.subject_id}`)
                  addToast('Unit Deleted successfully', { appearance: 'success',autoDismiss: true });
            }
        });
      return status;
}
