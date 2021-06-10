import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateStudent(formData) {
      
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
      return useMutation((formData) => {
            let student_id =  params?.student_id;
            return axios.patch(`${API_URL}v1/student/update/${student_id}`, formData, options)
        },{
            onSuccess: () => {
                let school_id =  params?.school_id;
                queryClient.invalidateQueries(`students-${school_id}`)
                history.push(`/admin/students-management`);
                addToast('Student Updated successfully', { appearance: 'success',autoDismiss: true });
            }
        });
      
}
