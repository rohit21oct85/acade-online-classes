import { useContext } from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';
import { useParams } from 'react-router';
     
export default function useDeleteClassSubjectMapping() {
      const location = useLocation();
      const path  = location.pathname;
      const params = useParams();
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
      const status =  useMutation((e) => {
            return axios.post(`${API_URL}v1/class-subject-mapping/delete`,{class_subject_id:e}, options)
        },{
        onSuccess: () => {
            let class_id =  params?.class_id;
            queryClient.invalidateQueries(`class-subject-mapping-${class_id}`)
            // history.push('/admin/mapping-teacher-class');
            addToast('Mapping deleted successfully', { appearance: 'success',autoDismiss: true });
        }
        });
      return status;
}
