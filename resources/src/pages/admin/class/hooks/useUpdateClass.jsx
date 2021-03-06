// import React, { useContext, useState } from 'react'
// import {useLocation, useParams, useHistory} from 'react-router-dom'
// import {useMutation, useQueryClient} from 'react-query'
// import axios from 'axios'
// import API_URL from '../../helper/APIHelper';
// import { useToasts } from 'react-toast-notifications';
// import {AuthContext} from '../../context/AuthContext';

// export default function useUpdateClass(formData) {
//       const params = useParams();
//       const location = useLocation();
//       const path = location.pathname;
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
//       const status =  useMutation((formData) => {
//             let class_id =  params?.class_id;
//             return axios.patch(`${API_URL}v1/class/update/${class_id}`, formData, options)
//         },{
//         onSuccess: () => {
//             queryClient.invalidateQueries('classes')
//             addToast('Class Updated successfully', { appearance: 'success',autoDismiss: true });
//             history.push('/admin/class-management');
//         }
//         });
//       return status;
// }
