import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleSchool from '../../../hooks/useSingleSchool';

export default function CreateSchool() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleSchool();

    const [SingleSchool, setSingleSchool] = useState({});
      const initialData = {
            name: '',
            address: '',
            logo: '',
            zip_code: '',
            admin_email: '',
            admin_mobile: '',
      } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleSchool(data)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/school/create`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('schools')
        setLoading(false);
        setFormData(initialData);
        history.push(`${path}`);
        addToast('Category added successfully', { appearance: 'success',autoDismiss: true });
    }
    });
    
    const updateMutation = useMutation((formData) => {
        let school_id =  params?.school_id;
        return axios.patch(`${API_URL}v1/school/update/${school_id}`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('schools')
        setLoading(false);
        setFormData(initialData);
        history.push(`${path}`);
        addToast('Category Updated successfully', { appearance: 'success',autoDismiss: true });
    }
    });

      const saveSchool = async (e) => {
            e.preventDefault();
            setLoading(true);
            formData['name'] = params?.school_id ? SingleSchool?.name : formData?.name;
            formData['slug'] = utils.MakeSlug(params?.school_id ? SingleSchool?.name : formData?.name);
            // console.log(formData); return;
            if(params?.school_id){
                  await updateMutation.mutate(SingleSchool);
            }else{

                  await mutation.mutate(formData);
            }
      }
      async function handleChange(e){
            if(params?.school_id){
                  setSingleSchool({...SingleSchool, [e.target.name]: e.target.value})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value})
            }
      }
      async function onBlurHandle(e){
            e.preventDefault();
            let image = e.target.value
            let arrayImage = image.split('/');
            let key = arrayImage[5];
            if(image.length > 0){
                  let image_url = `https://drive.google.com/uc?export=view&id=${key}`
                  if(params?.school_id){
                        setSingleSchool({...SingleSchool, logo: image_url})
                  }else{
                        setFormData({...formData, logo: image_url})
                  }
            }
      }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New School</p>
            <hr className="mt-1"/>
            <form onSubmit={saveSchool}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={params?.school_id ? SingleSchool?.name : formData?.name}
                        onChange={handleChange}
                        placeholder="School Name"/>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="logo"
                        value={params?.school_id ? SingleSchool?.logo : formData?.logo}
                        onChange={handleChange}
                        onBlur={onBlurHandle}
                        placeholder="School logo image urls"/>
                        <span style={{ fontSize: '0.7rem'}}>
                              Note: Please copy public image url. 
                        </span>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="address"
                        value={params?.school_id ? SingleSchool?.address : formData?.address}
                        onChange={handleChange}
                        placeholder="address"/>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="zip_code"
                        value={params?.school_id ? SingleSchool?.zip_code : formData?.zip_code}
                        onChange={handleChange}
                        placeholder="zip_code"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="admin_email"
                        value={params?.school_id ? SingleSchool?.admin_email : formData?.admin_email}
                        onChange={handleChange}
                        placeholder="admin_email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="admin_mobile"
                        value={params?.school_id ? SingleSchool?.admin_mobile : formData?.admin_mobile}
                        onChange={handleChange}
                        placeholder="admin_mobile"/>
                </div>


                <div className="form-group flex">
                    <button className="btn btn-sm dark br-15">
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.school_id ? (
                                <><span className="fa fa-save mr-2"></span> Update School</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save School</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.school_id && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/school-management`)
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
