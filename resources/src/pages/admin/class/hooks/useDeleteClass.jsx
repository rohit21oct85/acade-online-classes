// import { useContext } from 'react'
// import {useLocation, useHistory} from 'react-router-dom'
// import {useMutation, useQueryClient} from 'react-query'
// import axios from 'axios'
// import API_URL from '../../helper/APIHelper';
// import { useToasts } from 'react-toast-notifications';
// import {AuthContext} from '../../context/AuthContext';

// export default function useDeleteClass() {
//       const location = useLocation();
//       const path  = location.pathname;
      
//       const history = useHistory();
//       const queryClient = useQueryClient()
//       const {state} = useContext(AuthContext);
//       const options = {
//             headers: {
//                   'Content-Type': 'Application/json',
//                   'Authorization':'Bearer '+state.access_token
//             }
//       }      
//       const { addToast } = useToasts();
//       const status =  useMutation((id) => {
//             return axios.delete(`${API_URL}v1/class/delete/${id}`, options)
//         },{
//         onSuccess: () => {
//             queryClient.invalidateQueries('classes')
//             history.push('/admin/class-management');
//             addToast('Class deleted successfully', { appearance: 'success',autoDismiss: true });
//         }
//         });
//       return status;
// }
