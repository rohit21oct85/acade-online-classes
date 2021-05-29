import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleSubject from '../../../hooks/subjects/useSingleSubject';

export default function CreateSubject() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleSubject();

    const [SingleSubject, setSingleSubject] = useState({});

    const initialData = {
        subject_name: '',
        subject_slug: '',
    } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleSubject(data)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/subject/create`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('subjects')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Subject added successfully', { appearance: 'success',autoDismiss: true });
        }
    });
    
    const updateMutation = useMutation((formData) => {
        let subject_id =  params?.subject_id;
        return axios.patch(`${API_URL}v1/subject/update/${subject_id}`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('subjects')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Subject Updated successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const saveSubject = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.subject_id){
                await updateMutation.mutate(SingleSubject);
        }else{

                await mutation.mutate(formData);
        }
    }

    async function handleChange(e){
        if(params?.subject_id){
                setSingleSubject({...SingleSubject, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Subejct</p>
            <hr className="mt-1"/>
            <form onSubmit={saveSubject}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="subject_name"
                        value={params?.subject_id ? SingleSubject?.subject_name : formData?.subject_name}
                        onChange={handleChange}
                        placeholder="Subject Name"/>
                </div>
            
                <div className="form-group flex">
                    <button className="btn btn-sm dark">
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.subject_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Subject</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Subject</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.subject_id && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/subject-management`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                    )}
                </div>

            </form>  
        </>
    )
}