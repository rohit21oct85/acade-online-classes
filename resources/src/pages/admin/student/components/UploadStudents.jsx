import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import * as helper from '../../../../utils/helper'
import { useToasts } from 'react-toast-notifications';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import useClassList from '../../class/hooks/useClassList';
import useUploadStudent from '../hooks/useUploadStudent';

export default function UploadStudents() {
    const [loading, setLoading] = useState(false);

    const [btnDisabled, setBtnDisbaled] = useState(true)
    
    const params = useParams();

    const {state} = useContext(AuthContext);

    const { addToast } = useToasts();

    const [file, setFile] = useState(null);
    const [school, setSchool] = useState(null);
    const [clas, setClas] = useState(null);
    
    const history = useHistory();

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }
    const formDataUpload = new FormData();
    
    const {data : schools, schoolIsLoading } = useSchoolLists();
    const {data : classes, classesIsLoading } = useClassList();

    async function handelChangeUpload(e){
        const filename = e.target.files[0].name;
        console.log('file onchange ' ,  filename);
        const ext = filename.split('.')[1];
        console.log(ext)
        if(ext === "csv"){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('file', e.target.files[0]);
            formDataUpload.append('test', "testdata");
        }else{
            setBtnDisbaled(true);
            addToast('Only .csv files are allowed', { appearance: 'error', autoDismiss: true });
        }
    }

    const uploadMutation = useUploadStudent(formDataUpload);

    const uploadFile = async(e) => {
        e.preventDefault();
        let short = helper.getFilteredData(schools, '_id', params?.school_id, 'short');
        formDataUpload.append('file',file);
        formDataUpload.append('school_id',params?.school_id);
        formDataUpload.append(['class_id'], params?.class_id)
        formDataUpload.append('short',short);

        if(!params?.school_id){
            addToast('Please Select a School', { appearance: 'error', autoDismiss: true });
        }else{
            await uploadMutation.mutate(formDataUpload);
        }
    }

    async function handleChangeSchool(e){
        if(params?.student_id){
            setSingleStudent({...SingleStudent, [e.target.name]: e.target.value})
        }else{
            formDataUpload.append(['school_id'], e.target.value)
            history.push(`/admin/students-management/upload/${e.target.value}`)
            setSchool(e.target.value)
        }
    }
    
    async function handleChangeClass(e){
        if(params?.student_id){
            setSingleStudent({...SingleStudent, [e.target.name]: e.target.value})
        }else{
            formDataUpload.append(['class_id'], e.target.value)
            history.push(`/admin/students-management/upload/${params?.school_id}/${e.target.value}`)
        }
    }


    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Upload Students</p>
            <hr className="mt-1"/>
            <a href="/sampledata/students.csv" download>
            Download Sample File
            </a>
            <hr className="mt-1"/>
            <form onSubmit={uploadFile} method="POST" encType="multipart/form-data">
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id}>
                        <option>Select School</option>
                        {!schoolIsLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div>
                
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="class_id" onChange={handleChangeClass} value={params.class_id}>
                        <option>Select Class</option>
                        {classes?.map(sclass => {
                        return (
                            <option value={sclass._id} key={sclass._id}>{sclass.class_name} Th</option>
                        )
                        })}
                    </select>
                </div>
                
                <div className="form-group">
                    <input 
                        type="file" 
                        className="form-control" 
                        name="file"
                        onChange={handelChangeUpload}
                        placeholder="Upload .csv"/>
                        <small id="passwordHelpInline" class="text-muted">
                            Upload Classes File in .csv format only.
                        </small>
                </div>
            
                <div className="form-group flex">
                    <button className="btn btn-sm dark" disabled={btnDisabled}>
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                                <><span className="fa fa-save mr-2"></span> Upload</>
                            </>
                        )}
                        
                    </button>
                    <button className="btn btn-sm dark bg-danger ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/students-management`)
                        }}>
                        <span className="fa fa-times"></span>
                        
                    </button>
                </div>

            </form>  
        </>
    )
}