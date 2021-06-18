import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleSubject from '../../subject/hooks/useSingleSubject';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import { MakeSlug } from '../../../../utils/utils'

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
    
    const {data : schools, isLoading } = useSchoolLists();

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
            queryClient.invalidateQueries(`subjects`)
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Subject added successfully', { appearance: 'success',autoDismiss: true });
        }
    });
    
    const updateMutation = useMutation((SingleSubject) => {
        let subject_id =  params?.subject_id;
        return axios.patch(`${API_URL}v1/subject/update/${subject_id}`, SingleSubject, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries(`subjects`)
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
                SingleSubject.subject_slug = utils.MakeSlug(SingleSubject.subject_name)
                // console.log(SingleSubject); return;
                await updateMutation.mutate(SingleSubject);
        }else{
            if(formData.subject_name == ''){
                setLoading(false);
                addToast('Please Enter a Subject Name', { appearance: 'error',autoDismiss: true });                
            }else{
                await mutation.mutate(formData);
            }
        }
    }

    async function handleChange(e){
        if(params?.subject_id){
                setSingleSubject({...SingleSubject, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value, ['subject_slug']: MakeSlug(e.target.value)})
        }
    }

    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.subject_id){
                setSingleSubject({...SingleSubject, [e.target.name]: e.target.value})
                history.push(`/admin/subjects-management/select-school/${e.target.value}/${params.subject_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/subjects-management/select-school/${e.target.value}`)
            }
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
                    {(
                        <button className="btn btn-sm dark bg-danger  ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/subject-management`)
                        }}>
                            <span className="fa fa-times"></span>
                        </button>
                    )}
                </div>

            </form>  
        </>
    )
}