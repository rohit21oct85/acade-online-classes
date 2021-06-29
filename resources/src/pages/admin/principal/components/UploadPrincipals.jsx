import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSchoolLists from '../../school/hooks/useSchoolLists';

export default function UploadPrincipals() {
    const [loading, setLoading] = useState(false);

    const [btnDisabled, setBtnDisbaled] = useState(true)
    
    const params = useParams();

    const {state} = useContext(AuthContext);

    const { addToast } = useToasts();

    const [file, setFile] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [clas, setClas] = useState(null);
    const { data: schools, schoolIsLoading} = useSchoolLists();
    const history = useHistory();
    const [formData, setFormData] = useState({})
    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }
    const formDataUpload = new FormData();

    async function handelChangeUpload(e){
        const filename = e.target.files[0].name;
        console.log('file onchange ' ,  filename);
        const ext = filename.split('.')[1];
        console.log(ext)
        if(ext === "csv"){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('file', e.target.files[0]);
            
        }else{
            setBtnDisbaled(true);
            addToast('Only .csv files are allowed', { appearance: 'error', autoDismiss: true });
        }
    }

    const uploadMutation = useMutation(formDataUpload => {
        console.log(formDataUpload.file)
        return axios.post(`${API_URL}v1/principal/upload`, formDataUpload, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries(`principals`)
            setLoading(false);
            history.push(`/admin/principal-management/`)
            addToast('Principal added successfully', { appearance: 'success', autoDismiss: true });
        }
    });

    const uploadFile = async(e) => {
        e.preventDefault();
        formDataUpload.append('file',file);
        formDataUpload.append('school_id', formData.school_id);
        await uploadMutation.mutate(formDataUpload);
    }
    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.principal_id){
                setSinglePrincipal({...SinglePrincipal, [e.target.name]: e.target.value})
                history.push(`/admin/principal-management/update/${e.target.value}/${params?.principal_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/principal-management/${params?.page_type}/${e.target.value}`)
            }
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Upload Principals
            <a href="/sampledata/principal.csv" title="download sample file" className="btn-sm pull-right dark bg-success br-15" download>
               <span className="fa fa-download"></span>
            </a>
            </p>
            <hr className="mt-1"/>
            <form onSubmit={uploadFile} method="POST" encType="multipart/form-data">
            <div className="form-group">
                    <select 
                        className="form-control" aria-label="Default select example" 
                        name="school_id" 
                        onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!schoolIsLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.school_name}</option>
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
                            history.push(`/admin/principal-management`)
                        }}>
                        <span className="fa fa-times"></span>
                    </button>
                </div>

            </form>  
        </>
    )
}