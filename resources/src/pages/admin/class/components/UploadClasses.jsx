import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';

export default function UploadClasses() {
    const formDataUpload = new FormData();

    const [loading, setLoading] = useState(false);

    const [btnDisabled, setBtnDisbaled] = useState(true)

    const {state} = useContext(AuthContext);

    const { addToast } = useToasts();

    const [file, setFile] = useState(null);
    const [school, setSchool] = useState();

    const [selectedSchool, setSelectedSchool] = useState(false);
    
    const [schooloradmin, setSchoolOrAdmin] = useState("admin");

    const history = useHistory();

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    async function handelChangeUpload(e){
        const filename = e.target.files[0].name;
        console.log('file onchange ' ,  filename);
        const ext = filename.split('.')[1];
        console.log(ext)
        if(ext === "csv"){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('test', "testdata");
            // formDataUpload.append('file', e.target.files[0]);
        }else{
            setBtnDisbaled(true);
            addToast('Only .csv files are allowed', { appearance: 'error', autoDismiss: true });
        }
    }

    const mutation = useMutation(formDataUpload => {
        return axios.post(`${API_URL}v1/class/upload`, formDataUpload, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries(`classes`)
            setLoading(false);
            addToast('Classes added successfully', { appearance: 'success', autoDismiss: true });
        }
    });

    const handleChange = (e) => {
        setSchool(e.target.value)
        setSelectedSchool(true);
    }

    const uploadFile = async(e) => {
        e.preventDefault();
        formDataUpload.append('file',file);
        // formDataUpload.append('school_id',school);
        await mutation.mutate(formDataUpload);
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Upload Classes</p>
            <hr className="mt-1"/>

            <a href="/sampledata/classes.csv" download>
            Download Sample File
            </a>
            <hr className="mt-1"/>
            <form onSubmit={uploadFile} method="POST" encType="multipart/form-data">
                
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
                            history.push(`/admin/class-management`)
                        }}>
                        <span className="fa fa-times"></span>
                    </button>
                </div>

            </form>  
        </>
    )
}