import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useLogoutUser(formData) {
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
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
            
            return axios.post(`${API_URL}v1/school/logout-user`, formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries(`reports-${params?.school_id}-${params?.user_type}-${params?.user_id}`)
            addToast('Logout successfully', { appearance: 'success',autoDismiss: true });
            history.push(`${path}`);
        }
        });
      return status;
}
