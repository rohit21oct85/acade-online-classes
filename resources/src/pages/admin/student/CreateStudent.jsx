import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleStudent from '../../../hooks/useSingleStudent';

export default function CreateStudent() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleStudent();

    const [SingleStudent, setSingleStudent] = useState({});

    const initialData = {
        student_name: '',
        class_id: '',
        class_name: '',
        class_id: '',
        class_id: '',
        class_id: '',
    } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleStudent(data)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/student/create`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('students')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Student added successfully', { appearance: 'success',autoDismiss: true });
        }
    });
    
    const updateMutation = useMutation((formData) => {
        let student_id =  params?.student_id;
        return axios.patch(`${API_URL}v1/student/update/${student_id}`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('students')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Student Updated successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const saveStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.student_id){
                await updateMutation.mutate(SingleStudent);
        }else{

                await mutation.mutate(formData);
        }
    }

    async function handleChange(e){
        if(params?.student_id){
                setSingleStudent({...SingleStudent, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Student</p>
            <hr className="mt-1"/>
            <form onSubmit={saveStudent}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="student_name"
                        value={params?.student_id ? SingleStudent?.student_name : formData?.student_name}
                        onChange={handleChange}
                        placeholder="Student Name"/>
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
                            {params?.student_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Student</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Student</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.student_id && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/students-management`)
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