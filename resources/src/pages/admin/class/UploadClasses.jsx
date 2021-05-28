import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';

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

    const {data : schools, isLoading } = useSchoolLists();

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
            let school_id =  params?.school_id;
            queryClient.invalidateQueries(`classes-${school_id}`)
            setLoading(false);
            history.push(`${path}`);
            addToast('Classes added successfully', { appearance: 'success', autoDismiss: true });
        }
    });

    const handleChange = (e) => {
        setSchool(e.target.value)
        setSelectedSchool(true);
    }

    const uploadFile = async(e) => {
        e.preventDefault();
        if(!selectedSchool){
            addToast('Please Select a School', { appearance: 'error', autoDismiss: true });
            return;
        }
        formDataUpload.append('file',file);
        formDataUpload.append('school_id',school);
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
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChange}>
                        <option>Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.name}</option>
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
                    <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/class-management`)
                        }}>
                        <span className="fa fa-times mr-2"></span>
                        Cancel
                    </button>
                </div>

            </form>  
        </>
    )
}