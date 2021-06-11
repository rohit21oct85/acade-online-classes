import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleSubjectChapter() {
    const params = useParams();
    const subject_chapter_id = params?.subject_chapter_id
    const {state } = useContext(AuthContext);
    const key = params.subject_chapter_id ? `subject-chapter-mapping-${params.subject_chapter_id}` : `subject-chapter-mapping`
    return useQuery(`${key}`, async () => {
        if(subject_chapter_id !== undefined){
            const result = await axios.get(`${API_URL}v1/chapter/view/${subject_chapter_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
