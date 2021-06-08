import { useContext } from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';
import { useParams } from 'react-router';
export default function useDeleteTeacherSubjectMapping() {
      const params = useParams();
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
      const status =  useMutation((e) => {
            return axios.post(`${API_URL}v1/teacher-subject-mapping/delete`,{teacher_sub_id:e}, options)
        },{
        onSuccess: () => {
              console.log("Dsadasd")
            let school_id =  params?.school_id;
            let teacher_id =  params?.teacher_id;
            queryClient.invalidateQueries(`teacher-subject-mapping-${school_id}-${teacher_id}`)
            // history.push('/admin/mapping-teacher-subjects');
            addToast('Mapping deleted successfully', { appearance: 'success',autoDismiss: true });
        }
        });
      return status;
}
