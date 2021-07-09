import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';

import useSingleAdmin from '../../../hooks/subadmin/useSingleAdmin';
import useCreateAdmin from '../../../hooks/subadmin/useCreateAdmin';
import useUpdateAdmin from '../../../hooks/subadmin/useUpdateAdmin';
import useDeleteAdmin from '../../../hooks/subadmin/useDeleteAdmin';
import useAppRoles from '../../../hooks/roles/useAppRoles';
import * as helper from '../../../utils/helper'

export default function CreateNewAdmin() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;
    
    const [loading, setLoading] = useState(false);
    const {data} = useSingleAdmin();
    const {data:appRoles} = useAppRoles();
    const [singleAdmin, setSingleAdmin] = useState();
    const [formData, setFormData] = useState({});
    useEffect(setSubAdmin, [data]);
    function setSubAdmin(){
        setSingleAdmin(data)
    }
    function clearFields(){
        setFormData({})
        setLoading(false);
    }
    
    const createMutation = useCreateAdmin(formData);
    const updateMutation = useUpdateAdmin(formData);
    const deleteMutation = useDeleteAdmin(formData);
    
    const saveAppModule = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.admin_id){
            formData['first_name'] = formData?.first_name ?? singleAdmin?.first_name
            formData['last_name'] = formData?.last_name ?? singleAdmin?.last_name
            formData['admin_id'] = params?.admin_id
            formData['role'] = params?.role
            let role_name = helper.getFilteredData(appRoles, 'role_id',params?.role,'role_slug')
            if(formData['role_name'] === undefined){
                formData['role_name'] = role_name
            }else{
                formData['role_name'] = formData['role_name']
            }
            console.log(formData)
            await updateMutation.mutate(formData);
        }else{
            await createMutation.mutate(formData);
        }
        clearFields();
    }

    async function handleDelete(e){
        e.preventDefault();
        formData['admin_id'] = params?.admin_id;
        await deleteMutation.mutate(formData);
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>New SubAdmin</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppModule}>
                  
                  <div className="form-group">
                    <select className="form-control"
                    name="role_name"
                    value={params?.role}
                    onChange={e => {
                        if(params?.admin_id){
                            const role_name = helper.getFilteredData(appRoles, 'role_id',e.target.value,'role_slug')
                            setFormData({...formData, role: e.target.value,['role_name']: role_name})
                            history.push(`/admin/manage-sub-admin/${params?.page_type}/${e.target.value}/${params?.admin_id}`)
                        }else{
                            setFormData({...formData, [e.target.name]: e.target.value})
                        }
                    }}>
                          <option value="_">Select Roles</option>
                          {appRoles?.map(role => {
                                if(role?.role_id > 1)
                                return(
                                    <option value={role?.role_id} data-role_name={role?.role_name} key={role?._id}>{role?.role_name}</option>
                                )
                          })}
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control"
                        name="first_name" 
                        value={params?.admin_id ? singleAdmin?.first_name : formData?.first_name}
                        onChange={e => {
                            if(params?.admin_id){
                                setSingleAdmin({...singleAdmin, first_name: e.target.value})
                            }else{
                              setFormData({...formData, [e.target.name]: e.target.value})
                            }
                        }}
                        placeholder="First Name"/>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control"
                        name="last_name" 
                        value={params?.admin_id ? singleAdmin?.last_name : formData?.last_name}
                        onChange={e => {
                            if(params?.admin_id){
                                setSingleAdmin({...singleAdmin, last_name: e.target.value})
                            }else{
                              setFormData({...formData, [e.target.name]: e.target.value})
                            }
                        }}
                        placeholder="Last Name"/>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control"
                        name="email" 
                        value={params?.admin_id ? singleAdmin?.email : formData?.email}
                        onChange={e => {
                            if(params?.admin_id){
                                setSingleAdmin({...singleAdmin, email: e.target.value})
                            }else{
                              setFormData({...formData, [e.target.name]: e.target.value})
                            }
                        }}
                        placeholder="Email address"/>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control"
                        name="password" 
                        onChange={e => {
                            if(params?.admin_id){
                                setSingleAdmin({...singleAdmin, password: e.target.value})
                            }else{
                              setFormData({...formData, [e.target.name]: e.target.value})
                            }
                        }}
                        placeholder="password"/>
                  </div>
                        
                  <div className="form-group flex">
                    <button className="btn btn-sm dark br-5">
                        {(createMutation?.isLoading ||updateMutation?.isLoading ) ? (
                            <><span className="fa fa-spinner mr-2"></span></>
                        ) : (
                            <>
                            {params?.admin_id ? (
                                <><span className="fa fa-save mr-2"></span> Update</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.admin_id && (
                        <>
                        <button className="btn btn-sm dark bg-warning ml-2 br-5"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/manage-sub-admin`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                        <button className="btn btn-sm dark bg-danger ml-2 br-5"
                        onClick={handleDelete}
                        disbaled={deleteMutation?.isLoading?.toString()}
                        >

                            {deleteMutation?.isLoading ? 
                            <><span className="fa fa-spinner mr-2"></span> ... </>
                            :
                            <><span className="fa fa-trash mr-2"></span> Delete</>
                            }
                            
                        </button>
                        </>
                    )}
                </div>

            </form>  
        </>
    )
}
