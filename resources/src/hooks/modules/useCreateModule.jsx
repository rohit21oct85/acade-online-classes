import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';

export default function useCreateModule(formData) {
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
                  return axios.post(`${API_URL}v1/module/create`, formData, options)
            },{
            onSuccess: () => {
                  queryClient.invalidateQueries('app-modules')
                  addToast('App Module added successfully', { appearance: 'success',autoDismiss: true });
                  history.push(`${path}`);
            },
            onError: () => {
                  addToast('Error White Creating Modules', { appearance: 'error',autoDismiss: true });
            },
            retry: 3
      });
}
