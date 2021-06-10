import { useContext } from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';

export default function useDeletePermission() {
      const location = useLocation();
      const path  = location.pathname;
      const params  = useLocation();
      
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
            return axios.post(`${API_URL}v1/permission/delete`,formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries(`role-permissions-${params?.role_slug}-${params?.admin_email}`);
            queryClient.invalidateQueries(`role-modules-${params?.role_slug}-${params?.admin_email}`);

            addToast('Permission deleted successfully', { appearance: 'success',autoDismiss: true });
            history.push(`${path}`);
        }
        });
      return status;
}
