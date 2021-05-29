import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import * as utils from '../../../utils/utils'
import useSinglePermission from '../../../hooks/permissions/useSinglePermission.jsx';
import useCreatePermission from '../../../hooks/permissions/useCreatePermission.jsx';
import useUpdatePermission from '../../../hooks/permissions/useUpdatePermission';
import useAppPermissions from '../../../hooks/permissions/useAppPermissions'
import useDeletePermission from '../../../hooks/permissions/useDeletePermission';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import useAppRoles from '../../../hooks/roles/useAppRoles';
import useAppModule from '../../../hooks/modules/useAppModule';

export default function CreateAppPermission() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    
    const {state} = useContext(AuthContext);

    const [RoleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);
    const {data} = useSinglePermission();
    const {data:permissions} = useAppPermissions();
    const {data:schools} = useSchoolLists()
    const {data:roles} = useAppRoles();
    const {data:modules} = useAppModule();
    const [appModules, setAppModules] = useState([]);
    const [singlePermission, setSinglePermission] = useState();
    
    
    
    const [formData, setFormData] = useState({});
    const AppModules = [];
    useEffect(setModule, [modules]);
    function setModule(){
        modules?.map(module => {
            module.isChecked = false;
        });
    }
    function clearFields(){
        setSinglePermission({})
    }
    
    const createMutation = useCreatePermission(formData);
    const updateMutation = useUpdatePermission(formData);
    const deleteMutation = useDeletePermission(formData);

    const saveAppPermission = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(AppModules); return;
        
        if(params?.permission_id){
            await updateMutation.mutate(formData);
        }else{
            await createMutation.mutate(formData);
        }
        clearFields();
    }
    async function handleDelete(e){
        e.preventDefault()
        setFormData({...formData, permission_id: params?.permission_id});
        await deleteMutation.mutate(formData);
    }

    async function handleCheckBox(e){
        e.preventDefault();
        let data = e.target.value;
        let module_id = data.split('_')[0]
        let module_slug = data.split('_')[1]
        document.getElementById(`${module_id}`).style.checked = true;
        AppModules.push({
            role_id: params?.role_id,
            role_slug: params?.role_slug,
            school_id: params?.school_id,
            school_slug: params?.school_slug,
            module_id: module_id,
            module_slug: module_slug,
        })
    }
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Permission</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppPermission}>
                <div className="form-group">
                    <select 
                        className="form-control"
                        value={`${params?.role_id}_${params?.role_slug}`}
                        onChange={
                            e => {
                                if(e.target.value !== '_'){
                                    let data = e.target.value;
                                    let role_id = data.split('_')[0]
                                    let role_slug = data.split('_')[1]
                                    history.push(`/admin/app-permissions/${role_id}/${role_slug}`)
                                }else{
                                    history.push(`/admin/app-permissions`)
                                }
                            }
                        }
                    >
                        <option value="_">Select Roles</option>
                        {roles?.map(role => {
                            if(role?.role_slug !== 'master-admin'){
                                return(
                                    <option value={`${role?._id}_${role?.role_slug}`}
                                    key={role?._id}>{role?.role_name}</option>
                                );
                            }
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <select className="form-control"
                    value={`${params?.school_id}_${params?.school_slug}`}
                    onChange={
                        e => {
                            if(e.target.value !== '_'){
                                let data = e.target.value;
                                let school_id = data.split('_')[0]
                                let school_slug = data.split('_')[1]
                                history.push(`/admin/app-permissions/${params?.role_id}/${params?.role_slug}/${school_id}/${school_slug}`)
                            }else{
                                history.push(`/admin/app-permissions`)
                            }
                        }
                    }
                    >
                        <option value="_">Select School</option>
                        {schools?.map(school => {
                            return(
                                <option value={`${school?._id}_${school?.slug}`}
                                key={school?._id}>{school?.name}</option>
                            );
                        })}
                    </select>
                </div>    
                            
                    
                <div className="form-group">
                    <div className="col-md-12 pl-0 pr-2"
                    style={{
                        minHeight: '280px',
                        maxHeight: '280px',
                        overflow: 'scroll'
                    }}>
                        {modules?.map(module => {
                            return(
                                <div className="card pl-2 pt-0 pb-0 mb-2" key={module?._id}>
                                    <label className="pb-0 mb-0">
                                    <input 
                                        className="mr-2"
                                        type="checkbox" 
                                        name={`module-${module?._id}`}
                                        value={`${module?._id}_${module?.module_slug}`}
                                        onChange={handleCheckBox}
                                    />    
                                    {module?.module_name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>                
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
                            {params?.permission_id ? (
                                <><span className="fa fa-save mr-2"></span> Update</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.school_id && params?.role_id && (
                        <button 
                        type="button"
                        className="btn btn-sm bg-warning ml-2 br-5"
                        onClick={e => {
                            e.preventDefault();
                            clearFields();
                            setSinglePermission({})
                            history.push(`/admin/app-permissions`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                    )}
                    {params?.permission_id && (
                        <>
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
