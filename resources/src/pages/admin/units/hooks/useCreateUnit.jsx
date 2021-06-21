import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useCreateList(formData) {
      
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
      let url = '';
      let key = '';
        if(params?.class_id && params?.subject_id){
            key = `units-${params.class_id}-${params?.subject_id}`;
        }else if(params?.class_id){
            key = `units-${params.class_id}`;
        }else{
            key = `units`;
        }
      return useMutation(formData => {
            return axios.post(`${API_URL}v1/unit/create`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                history.push(`${path}`);
                addToast('Unit added successfully', { appearance: 'success', autoDismiss: true });
            }
        });
      
}
