import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import * as utils from '../../../utils/utils'
import useSingleRole from '../../../hooks/roles/useSingleRole.jsx';
import useCreateRole from '../../../hooks/roles/useCreateRole.jsx';
import useUpdateRole from '../../../hooks/roles/useUpdateRole';
import useAppRoles from '../../../hooks/roles/useAppRoles'
import useDeleteRole from '../../../hooks/roles/useDeleteRole';

export default function CreateAppRole() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    
    const {state} = useContext(AuthContext);

    const [RoleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);
    const {data} = useSingleRole();
    const {data:roles} = useAppRoles();
    const [singleRole, setSingleRole] = useState();
    useEffect(()=> {
        setRoleId(roles && roles?.length);
    },[roles])
    const [RoleId, setRoleId] = useState();
    
    async function increment(e){
        e.preventDefault();
        if(params?.role_id){
            setSingleRole({...singleRole, role_id: singleRole?.role_id+1})
        }else{
            if(RoleId === undefined){
                setRoleId(1)
            }else{
                setRoleId(+RoleId + 1)
            }
        }
    }
    

    async function decrement(e){
        e.preventDefault();
        if(params?.role_id){
            if(RoleId === singleRole?.role_id){
                setSingleRole({...singleRole, role_id: RoleId})
            }else{
                setSingleRole({...singleRole, role_id: RoleId -1})
            }
        }else{
            if(RoleId > 1){
                setRoleId(RoleId-1)
            }
        }
    }

    const [formData, setFormData] = useState({});
    useEffect(setModule, [data]);
    function setModule(){
        setRoleId(data?.role_id)
        setSingleRole(data)
    }
    function clearFields(){
        setRoleName('');
        setRoleId(roles && roles?.length);
        setSingleRole({})
    }
    
    const createMutation = useCreateRole(formData);
    const updateMutation = useUpdateRole(formData);
    const deleteMutation = useDeleteRole(formData);

    const saveAppRole = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if(singleRole?.role_name !== RoleName && params?.role_id){
            formData['role_name'] = singleRole?.role_name;
            formData['role_slug'] = utils.MakeSlug(singleRole?.role_name);
        }else{
            formData['role_name'] = RoleName;   
            formData['role_slug'] = utils.MakeSlug(RoleName);
        }
        
        if(singleRole?.role_id !== RoleId && params?.role_id){
            formData['role_id'] = RoleId;
        }else if(singleRole?.role_id === RoleId && params?.role_id){
            formData['role_id'] = singleRole?.role_id;
        }else{
            formData['role_id'] = RoleId;   
        }
        // console.log(formData); return;
        
        if(params?.role_id){
            await updateMutation.mutate(formData);
        }else{
            await createMutation.mutate(formData);
        }
        clearFields();
    }
    async function handleDelete(e){
        e.preventDefault()
        setFormData({...formData, role_id: params?.role_id});
        await deleteMutation.mutate(formData);
    }
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Create App Role</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppRole}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        value={params?.role_id ? singleRole?.role_name : RoleName}
                        onChange={e => {
                            if(params?.role_id){
                                setSingleRole({...singleRole, role_name: e.target.value})
                            }else{
                                setRoleName(e.target.value)
                            }
                        }}
                        placeholder="Role Name"/>
                </div>                
                <div className="form-group p-rel flex">
                    <input className="form-control" type="text" value={params?.role_id ? singleRole?.role_id: RoleId} readOnly/>
                    <button onClick={increment} type="button" className="bi bi-arrow-up dark btn btn-sm" style={{ fontSize: '0.9rem'}} activestyle="outline: none"></button>
                    <button onClick={decrement} type="button" className="bi bi-arrow-down red btn btn-sm" style={{ fontSize: '0.9rem'}} activestyle="outline: none"></button>
                </div>
                <div className="form-group flex">
                    <button className="btn btn-sm dark br-5"
                    disabled={(createMutation?.isLoading || updateMutation?.isLoading)}>
                        {(createMutation?.isLoading || updateMutation?.isLoading) ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.role_id ? (
                                <><span className="fa fa-save mr-2"></span> Update</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.role_id && (
                        <>
                        <button 
                        type="button"
                        className="btn btn-sm bg-warning ml-2 br-5"
                        onClick={e => {
                            e.preventDefault();
                            clearFields();
                            setSingleRole({})
                            history.push(`/admin/app-roles`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                        <button 
                        type="button"
                        className="btn btn-sm dark bg-danger ml-2 br-5"
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
