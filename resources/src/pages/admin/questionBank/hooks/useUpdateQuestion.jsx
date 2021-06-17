import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateQuestion(formData) {
      
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
      const key = params.qbank_id ? `questions-${params.qbank_id}` : `questions`
      return useMutation((formData) => {
            let qbank_id =  params?.qbank_id;
            return axios.post(`${API_URL}v1/question-bank/update/${qbank_id}`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                history.push(`${path}`);
                addToast('Question Updated successfully', { appearance: 'success',autoDismiss: true });
            }
        });
}
