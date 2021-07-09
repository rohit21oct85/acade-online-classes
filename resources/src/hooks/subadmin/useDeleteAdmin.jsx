import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';

export default function useDeleteAdmin(formData) {
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
      const history = useHistory();
      
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }

      const { addToast } = useToasts();
      return useMutation(formData => {
                  return axios.post(`${API_URL}v1/admin/delete`, formData, options)
            },{
            onSuccess: () => {
                  queryClient.invalidateQueries('sub-admins')
                  addToast('Module deleted successfully', { appearance: 'success',autoDismiss: true });
                  history.push('/admin/manage-sub-admin');
            },
            onError: () => {
                  addToast('Error White Updating Modules', { appearance: 'error',autoDismiss: true });
            },
            retry: 3
      });
}
