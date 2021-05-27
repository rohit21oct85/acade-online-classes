import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';

import useSingleSchool from '../../../hooks/schools/useSingleSchool';
import useCreateSchool from '../../../hooks/schools/useCreateSchool';
import useUpdateSchool from '../../../hooks/schools/useUpdateSchool';
import useDeleteSchool from '../../../hooks/schools/useDeleteSchool';



export default function CreateSchool() {
    const history = useHistory();
    const params  = useParams();
    const { addToast } = useToasts();
    const {data} = useSingleSchool(params?.school_id);
    const [SingleSchool, setSingleSchool] = useState({});
    const initialData = {name: '',address: '',
            logo: '',zip_code: '',
            admin_email: '',admin_mobile: ''}         
    const [formData, setFormData] = useState({});
    useEffect(()=>{
        setFormData(initialData);
        setSingleSchool(initialData);
    },[params?.page_type])
    useEffect(setModule, [data]);

    function setModule(){
        if(data !== undefined){
            setSingleSchool(data)
        }
    }
    const createMutation = useCreateSchool(formData);
    const updateMutation = useUpdateSchool(SingleSchool);
    const deleteMutation = useDeleteSchool(formData);
    
    const saveSchool = async (e) => {
        e.preventDefault();
        formData['name'] = params?.school_id ? SingleSchool?.name : formData?.name;
        formData['slug'] = utils.MakeSlug(params?.school_id ? SingleSchool?.name : formData?.name);
        if(params?.school_id){
                await updateMutation.mutate(SingleSchool);
        }else{
            if(formData?.name == ''){
                addToast('Please Enter school name', { appearance: 'error',autoDismiss: true });        
            }else if(formData?.admin_email == ''){
                addToast('Please provide admin email', { appearance: 'error',autoDismiss: true });        
            }
            else if(digits_only(formData?.zip_code) === false){
                addToast('Please enter numbers only', { appearance: 'error',autoDismiss: true });        
            }
            else if(formData?.zip_code?.length < 6){
                addToast('Please provide valid zip code', { appearance: 'error',autoDismiss: true });        
            }
            else if(formData?.mobile?.length < 10){
                addToast('Please enter valid mobile number', { appearance: 'error',autoDismiss: true });        
            }
            else if(digits_only(formData?.mobile) === false){
                addToast('Please enter valid mobile number', { appearance: 'error',autoDismiss: true });        
            }
            else{
                await createMutation.mutate(formData);
            }
        }
      }
      async function handleDelete(e){
            if(params?.school_id){
                formData['school_id'] = params?.school_id
                await deleteMutation.mutate(formData);
            }
      }
      
      async function handleChange(e){
            if(params?.school_id){
                  setSingleSchool({...SingleSchool, [e.target.name]: e.target.value})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value})
            }
      }
      function digits_only(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
      async function handleOnlyNumbers(e){
        if(digits_only(e.target.value) === false){
            addToast(`Please provide valid ${e.target.name}`, { appearance: 'error',autoDismiss: true });        
            document.getElementsByName(`${e.target.name}`)[0].innerText = ""
            document.getElementsByName(`${e.target.name}`)[0].focus()
        }
        else if(e.target.name === 'mobile' && e.target.value?.length < 10){
            addToast(`Please provide valid ${e.target.name}`, { appearance: 'error',autoDismiss: true });        
            document.getElementsByName(`${e.target.name}`)[0].innerHTML = null
            document.getElementsByName(`${e.target.name}`)[0].focus()
        }
        else if(e.target.name === 'zip_code' && e.target.value?.length < 6){
            addToast(`Please provide valid ${e.target.name}`, { appearance: 'error',autoDismiss: true });        
            document.getElementsByName(`${e.target.name}`)[0].innerHTML = null
            document.getElementsByName(`${e.target.name}`)[0].focus()
        }
      }
      async function validateEmail(e) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result= re.test(String(e.target.value).toLowerCase());
        if(result === false){
            addToast(`Please provide valid ${e.target.name}`, { appearance: 'error',autoDismiss: true });        
            document.getElementsByName(`${e.target.name}`)[0].innerHTML = null
            document.getElementsByName(`${e.target.name}`)[0].focus()
        }
    }
      async function onBlurHandle(e){
            e.preventDefault();
            let image = e.target.value
            let arrayImage = image.split('/');
            let key = arrayImage[5];
            if(image.length > 0){
                //   let image_url = `https://drive.google.com/uc?export=view&id=${key}`
                  if(params?.school_id){
                        setSingleSchool({...SingleSchool, logo: key})
                  }else{
                        setFormData({...formData, logo: key})
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
                        autoComplete="no-password"
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
                        autoComplete="no-password"
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
                        autoComplete="no-password"
                        placeholder="address"/>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="zip_code"
                        maxLength={6}
                        value={params?.school_id ? SingleSchool?.zip_code : formData?.zip_code}
                        onChange={handleChange}
                        autoComplete="no-password"
                        onBlur={handleOnlyNumbers}
                        placeholder="zip_code"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="admin_email"
                        value={params?.school_id ? SingleSchool?.admin_email : formData?.admin_email}
                        onChange={handleChange}
                        onBlur={validateEmail}
                        autoComplete="no-password"
                        placeholder="admin_email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="admin_mobile"
                        value={params?.school_id ? SingleSchool?.admin_mobile : formData?.admin_mobile}
                        onChange={handleChange}
                        maxLength={10}
                        onBlur={handleOnlyNumbers}
                        autoComplete="no-password"
                        placeholder="admin_mobile"/>
                </div>


                <div className="form-group flex">
                    <button className="btn btn-sm dark br-5">
                        {(createMutation.isLoading || updateMutation.isLoading) ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            </>
                        ) : (
                            <>
                            {params?.school_id ? (
                                <><span className="fa fa-save mr-2"></span>Update</>
                                ):(
                                <><span className="fa fa-save mr-2"></span>Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.school_id && (
                        <>
                        <button className="btn btn-sm bg-danger br-5 text-white ml-2"
                        onClick={e => {
                            e.preventDefault();
                            setFormData({});
                            setSingleSchool({});
                            history.push(`/admin/school-management`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                        
                        <button className="btn btn-sm bg-warning br-5 text-white ml-2"
                        onClick={handleDelete}>
                            {deleteMutation.isLoading ?
                            <><span className="fa fa-spinner mr-2"></span></>
                            :
                            <span className="fa fa-trash mr-2"></span>
                            }
                            Delete
                        </button>
                        </>
                    )}
                </div>

            </form>  
        </>
    )
}
