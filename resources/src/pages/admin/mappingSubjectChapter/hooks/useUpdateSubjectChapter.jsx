import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateSubjectChapter(formData) {
      
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
      const key = params.subject_chapter_id ? `subject-chapter-mapping-${params.subject_chapter_id}` : `subject-chapter-mapping`
      return useMutation((formData) => {
            let subject_chapter_id =  params?.subject_chapter_id;
            return axios.patch(`${API_URL}v1/chapter/update/${subject_chapter_id}`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
            //     setLoading(false);
            //     setFormData(initialData);
            //     history.push(`${path}`);
                addToast('Chapter Updated successfully', { appearance: 'success',autoDismiss: true });
            }
        });
}
