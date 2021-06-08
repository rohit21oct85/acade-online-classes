import React, {useState, useEffect} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'

import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';

import useSinglePrincipal from '../../../hooks/principals/useSinglePrincipal';
import useCreatePrincipal from '../../../hooks/principals/useCreatePrincipal';
import useUpdatePrincipal from '../../../hooks/principals/useUpdatePrincipal';
import useDeletePrincipal from '../../../hooks/principals/useDeletePrincipal';

import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import useAccess from '../../../hooks/useAccess';

export default function CreatePrincipal() {
    const history = useHistory();
    const params  = useParams();
    const del = useAccess('delete');


    const { addToast } = useToasts();
    const {data} = useSinglePrincipal(params?.principal_id);
    const [SinglePrincipal, setSinglePrincipal] = useState({});
    const salutations = [
        {key: 'mr', value:'Mr'},
        {key: 'mrs', value:'Mrs'},
        {key: 'miss', value:'Miss'}
    ];
    const initialData = {title:'',name: '',address: '',state:'',city:'',password:'',
            pincode: '',
            email: '',mobile: ''}         
    const [formData, setFormData] = useState({});
    useEffect(()=>{
        setFormData(initialData);
        setSinglePrincipal(initialData);
    },[params?.page_type])
    useEffect(setModule, [data]);

    function setModule(){
        if(data !== undefined){
            setSinglePrincipal(data)
        }
    }
    const createMutation = useCreatePrincipal(formData);
    const updateMutation = useUpdatePrincipal(SinglePrincipal);
    const deleteMutation = useDeletePrincipal(formData);
    const { data: schools, schoolIsLoading} = useSchoolLists(formData);
    
    const savePrincipal = async (e) => {
        e.preventDefault();
        formData['name'] = params?.principal_id ? SinglePrincipal?.name : formData?.name;
        console.log(formData)
        // formData['slug'] = utils.MakeSlug(params?.principal_id ? SinglePrincipal?.name : formData?.name);
        if(params?.principal_id){
                await updateMutation.mutate(SinglePrincipal);
        }else{
            formData.school_id = params.school_id ? params.school_id : ''
            if(formData.school_id == ''){
                addToast('Please Select a School', { appearance: 'error',autoDismiss: true });
            }else if(formData?.name == ''){
                addToast('Please Enter Principal name', { appearance: 'error',autoDismiss: true });        
            }else if(formData?.email == ''){
                addToast('Please provide admin email', { appearance: 'error',autoDismiss: true });        
            }
            else if(digits_only(formData?.pincode) === false){
                addToast('Please enter numbers only', { appearance: 'error',autoDismiss: true });        
            }
            else if(formData?.pincode?.length < 6){
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
            if(params?.principal_id){
                formData['principal_id'] = params?.principal_id
                await deleteMutation.mutate(formData);
            }
      }
      
      async function handleChange(e){
            if(params?.principal_id){
                  setSinglePrincipal({...SinglePrincipal, [e.target.name]: e.target.value})
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
        else if(e.target.name === 'pincode' && e.target.value?.length < 6){
            console.log("asA")
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
                  if(params?.principal_id){
                        setSinglePrincipal({...SinglePrincipal})
                  }else{
                        setFormData({...formData})
                  }
            }
      }

    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.principal_id){
                setSinglePrincipal({...SinglePrincipal, [e.target.name]: e.target.value})
                    history.push(`/admin/principal-management/create/${e.target.value}/${params?.principal_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/principal-management/create/${e.target.value}`)
                }
        }
    }
    
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Principal</p>
            <hr className="mt-1"/>
            <form onSubmit={savePrincipal}>
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
                    <select className="form-control"
                        name="title"
                        onChange={handleChange}
                        value={params?.principal_id ? SinglePrincipal?.title : formData?.title}
                        >
                            <option>Select Salutation</option>
                            {salutations?.map(salute => {
                                return(
                                    <option value={salute?.key}>{salute?.value}</option>
                                )
                            })}    
                        </select>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={params?.principal_id ? SinglePrincipal?.name : formData?.name}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Principal Name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="email"
                        value={params?.principal_id ? SinglePrincipal?.email : formData?.email}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password"
                        value={params?.principal_id ? SinglePrincipal?.password : formData?.password}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Password"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="mobile"
                        value={params?.principal_id ? SinglePrincipal?.Mobile : formData?.Mobile}
                        onChange={handleChange}
                        onBlur={handleOnlyNumbers}
                        autoComplete="no-Mobile"
                        placeholder="Mobile"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="address"
                        value={params?.principal_id ? SinglePrincipal?.address : formData?.address}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="address"/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="city"
                                value={params?.principal_id ? SinglePrincipal?.city : formData?.city}
                                onChange={handleChange}
                                autoComplete="no-password"
                                placeholder="city"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="state"
                                value={params?.principal_id ? SinglePrincipal?.state : formData?.state}
                                onChange={handleChange}
                                autoComplete="no-password"
                                placeholder="state"/>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="pincode"
                        maxLength={6}
                        value={params?.principal_id ? SinglePrincipal?.pincode : formData?.pincode}
                        onChange={handleChange}
                        autoComplete="no-password"
                        onBlur={handleOnlyNumbers}
                        placeholder="pincode"/>
                </div>
                

                <div className="form-group flex">
                    <button className="btn btn-sm dark br-5">
                        {(createMutation.isLoading || updateMutation.isLoading) ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            </>
                        ) : (
                            <>
                            {params?.principal_id ? (
                                <><span className="fa fa-save mr-2"></span>Update</>
                                ):(
                                <><span className="fa fa-save mr-2"></span>Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    <div>                
                    <button className="btn btn-sm bg-danger br-5 text-white ml-2"
                        onClick={e => {
                            e.preventDefault();
                            setFormData({});
                            setSinglePrincipal({});
                            history.push(`/admin/principal-management`)
                        }}>
                        <span className="fa fa-times"></span>
                    </button>

                    {params?.principal_id && del == true && (
                        <button className="btn btn-sm bg-danger br-5 text-white ml-2"
                        onClick={handleDelete}>
                            {deleteMutation.isLoading ?
                            <><span className="fa fa-spinner"></span></>
                            :
                            <span className="fa fa-trash"></span>
                            }
                        </button>
                    )}
                    </div>
                </div>

            </form>  
        </>
    )
}
