import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';

import useSingleSchool from '../hooks/useSingleSchool';
import useCreateSchool from '../hooks/useCreateSchool';
import useUpdateSchool from '../hooks/useUpdateSchool';
import useDeleteSchool from '../hooks/useDeleteSchool';
import useCheckSubDomain from '../hooks/useCheckSubDomain';



export default function CreateSchool() {
    const history = useHistory();
    const params  = useParams();
    const { addToast } = useToasts();
    const {data} = useSingleSchool(params?.school_id);
    const [SingleSchool, setSingleSchool] = useState({});
    const initialData = {name: '',address: '',
            school_logo: '',pincode: '',
            contact_email: '',conatct_mobile: ''}         
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
    const checkMutation = useCheckSubDomain(formData);
    
    const saveSchool = async (e) => {
        e.preventDefault();
        formData['school_name'] = params?.school_id ? SingleSchool?.school_name : formData?.school_name;
        formData['slug'] = utils.MakeSlug(params?.school_id ? SingleSchool?.school_name : formData?.school_name);
        console.log(formData)
        if(params?.school_id){
            await updateMutation.mutate(SingleSchool);
        }else{
            if(formData?.school_name == ''){
                addToast('Please Enter school name', { appearance: 'error',autoDismiss: true });        
            }else if(formData?.contact_email == ''){
                addToast('Please provide contact email', { appearance: 'error',autoDismiss: true });        
            }
            else if(digits_only(formData?.pincode) === false){
                addToast('Please enter numbers only', { appearance: 'error',autoDismiss: true });        
            }
            else if(formData?.pincode?.length < 6){
                addToast('Please provide valid zip code', { appearance: 'error',autoDismiss: true });        
            }
            else if(formData?.contact_mobile?.length < 10){
                addToast('Please enter validcontact_ mobile number', { appearance: 'error',autoDismiss: true });        
            }
            else if(digits_only(formData?.contact_mobile) === false){
                addToast('Please enter valid mobile number', { appearance: 'error',autoDismiss: true });        
            }
            else{
                await createMutation.mutate(formData);
            }
        }
        setFormData({});
        setSingleSchool({});
      }
      async function handleDelete(e){
            e.preventDefault();
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
        else if(e.target.name === 'pincode' && e.target.value?.length < 6){
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
            let arrayImage = image.split('/d/');
            let arrayImage2 = arrayImage[1].split('/');
            let key = arrayImage2[0];
            if(image.length > 0){
                //   let image_url = `https://drive.google.com/uc?export=view&id=${key}`
                  if(params?.school_id){
                        setSingleSchool({...SingleSchool, school_logo: key})
                  }else{
                        setFormData({...formData, school_logo: key})
                  }
            }
      }
      const handleCheckSubDomain = async (e) => {
        e.preventDefault();  
        try {
            if(e.target.value !== ""){
                await checkMutation.mutate({sub_domain: e.target.value});
                if(checkMutation?.status == "success"){
                    if(checkMutation?.data?.data?.count == "1"){
                        setDomain(1)
                        e.target.value = "";
                        e.target.focus();
                    }else{
                        setDomain(0)
                        
                    }
                }
            }
        } catch (error) {
            console.log(error.message)
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
                        name="school_name"
                        value={params?.school_id ? SingleSchool?.school_name : formData?.school_name}
                        onChange={handleChange}
                        autoComplete="Off"
                        placeholder="School Name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="sub_domain"
                        value={params?.school_id ? SingleSchool?.sub_domain : formData?.sub_domain}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Sub domain"/>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="school_logo"
                        value={params?.school_id ? SingleSchool?.school_logo : formData?.school_logo}
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
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="city"
                                value={params?.school_id ? SingleSchool?.city : formData?.city}
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
                                value={params?.school_id ? SingleSchool?.state : formData?.state}
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
                        value={params?.school_id ? SingleSchool?.pincode : formData?.pincode}
                        onChange={handleChange}
                        autoComplete="no-password"
                        onBlur={handleOnlyNumbers}
                        placeholder="pincode"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="contact_name"
                        value={params?.school_id ? SingleSchool?.contact_name : formData?.contact_name}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="contact_name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        className="form-control" 
                        name="contact_email"
                        value={params?.school_id ? SingleSchool?.contact_email : formData?.contact_email}
                        onChange={handleChange}
                        onBlur={validateEmail}
                        autoComplete="no-password"
                        placeholder="contact_email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="contact_mobile"
                        value={params?.school_id ? SingleSchool?.contact_mobile : formData?.contact_mobile}
                        onChange={handleChange}
                        maxLength={10}
                        onBlur={handleOnlyNumbers}
                        autoComplete="no-password"
                        placeholder="contact_mobile"/>
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
                        <button 
                        type="button"
                        className="btn btn-sm bg-danger br-5 text-white ml-2"
                        onClick={e => {
                            e.preventDefault();
                            setFormData({});
                            setSingleSchool({});
                            history.push(`/admin/school-management`)
                        }}>
                            <span className="fa fa-times"></span>
                        </button>
                        
                        <button 
                        type="button"
                        className="btn btn-sm bg-warning br-5 text-white ml-2"
                        onClick={handleDelete}>
                            {deleteMutation.isLoading ?
                            <><span className="fa fa-spinner mr-2"></span></>
                            :
                            <span className="fa fa-trash"></span>
                            }
                        </button>
                        </>
                    )}
                </div>

            </form>  
        </>
    )
}
