import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import * as utils from '../../../utils/utils'
import useSinglePermission from '../../../hooks/permissions/useSinglePermission.jsx';
import useCreatePermission from '../../../hooks/permissions/useCreatePermission.jsx';
import useUpdatePermission from '../../../hooks/permissions/useUpdatePermission';
import useAppPermissions from '../../../hooks/permissions/useAppPermissions'

import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import useAppRoles from '../../../hooks/roles/useAppRoles';
import useAppModule from '../../../hooks/modules/useAppModule';
import useSubAdminByRole from '../../../hooks/subadmin/useSubAdminByRole';

export default function CreateAppPermission() {
    const history = useHistory();
    const params  = useParams();
    const methods = [
        {
            key: 'create',
            value: 'Create'
        },
        {
            key: 'update',
            value: 'Update'
        },
        {
            key: 'delete',
            value: 'Delete'
        },
        {
            key: 'upload',
            value: 'Upload'
        }
    ]
    const [loading, setLoading] = useState(false);
    const {data} = useSinglePermission();
    const {data:permissions} = useAppPermissions();
    const {data:roles} = useAppRoles();
    const {data:modules} = useAppModule();
    const {data:subAdmins, isLoading: sAdminLoading} = useSubAdminByRole();

    const [formData, setFormData] = useState({});
    
    function clearFields(){
        Array.from(document.querySelectorAll('.checkbox')).map(checkbox => {
            checkbox.checked = false
        })
        
    }
    
    const createMutation = useCreatePermission(formData);
    const updateMutation = useUpdatePermission(formData);
    
    const saveAppPermission = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if(params?.permission_id){
            await updateMutation.mutate(formData);
        }else{
            let ArrayMethod = []
            Array.from(document.querySelectorAll('.module-methods')).map( method => {
                if(method.checked === true){
                    let data = method.value
                    let splitData = data.split('_')
                    ArrayMethod.push({
                        role_id: params?.role_id,
                        role_slug: params?.role_slug,
                        role: params?.role,
                        email: params?.admin_email,
                        module_slug: splitData[0],
                        module_icon: splitData[1],
                        method_name: splitData[2]
                    })
                }
            })
            
            let ArrayModule = []
            Array.from(document.querySelectorAll('.module')).map( method => {
                if(method.checked === true){
                    let data = method.value
                    let splitData = data.split('_')
                    ArrayModule.push({
                        role_id: params?.role_id,
                        role_slug: params?.role_slug,
                        role: params?.role,
                        email: params?.admin_email,
                        module_id: splitData[0],
                        module_name: splitData[1],
                        module_slug: splitData[2],
                        module_icon: splitData[3],
                    })
                }
            })

            await createMutation.mutate({module: ArrayModule, method: ArrayMethod});
        }
        clearFields();
    }
    
    function handleCheckBox(e){
        e.preventDefault();
        e.target.checked = true;
    }
    console.log(permissions)
    function checkMethods(slug){
        return permissions && permissions.some(permission => permission?.method_name == slug);
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
                        value={`${params?.role_id}-${params?.role_slug}-${params?.role}`}
                        onChange={
                            e => {
                                if(e.target.value !== '_'){
                                    let data = e.target.value;
                                    let role_id = data.split('-')[0]
                                    let role_slug = data.split('-')[1]
                                    let role = data.split('-')[2]
                                    history.push(`/admin/app-permissions/${role_id}/${role_slug}/${role}`)
                                }else{
                                    history.push(`/admin/app-permissions`)
                                }
                            }
                        }
                    >
                        <option value="_">Select Roles</option>
                        {roles?.map(role => {
                            if(role?.role_slug !== 'master_admin'){
                                return(
                                    <option value={`${role?._id}-${role?.role_slug}-${role?.role_id}`}
                                    key={role?._id}>{role?.role_name}</option>
                                );
                            }
                        })}
                    </select>
                </div>
                
                <div className="form-group">
                    <select 
                        className="form-control"
                        onChange={
                            e => {
                                if(e.target.value !== '_'){
                                    let data = e.target.value;
                                    history.push(`/admin/app-permissions/${params?.role_id}/${params?.role_slug}/${params?.role}/${data}`)
                                }else{
                                    history.push(`/admin/app-permissions`)
                                }
                            }
                        }
                        value={params?.admin_email}
                    >
                        <option value="_">{sAdminLoading ? 'loading...' : 'Select User'}</option>
                        {subAdmins?.map(admin => {
                            return(
                                <option value={admin.email}>{admin.first_name} {admin.last_name}</option>
                            )
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
                        {modules?.map((module, index) => {

                            if(module?.module_type !== 'master_admin')
                            
                            return(
                                <div className="card pt-0 pb-0 mb-2" key={module?._id}>
                                    <label className="pb-0 mb-0"
                                    htmlFor={`${module?.module_slug}`}>
                                    <span className={`bi ${module?.module_icon} mr-2 ml-2 `}></span>
                                    <input 
                                        type="checkbox" name={`method-${module?.module_slug}`} 
                                        id={`${module?.module_slug}`}
                                        className="module mr-2" 
                                        value={`${module?._id}_${module?.module_name}_${module?.module_slug}_${module?.module_icon}`}
                                    />
                                    {module?.module_name}
                                    </label>
                                    <hr className="mt-0 mb-1"/>
                                    <div className="flex ml-2 mr-2">
                                        {methods?.map( method => {
                                            return(
                                            <div className="col-md-3 pl-0" key={method?._id}>
                                              <label className="mb-0">
                                                <input type="checkbox" name={`method-${module?.module_slug}`} className="module-methods mr-1" 
                                                value={`${module?.module_slug}_${module?.module_icon}_${method?.key}-${module?.module_slug}`}
                                                />{method?.value}</label>
                                            </div>
                                            )
                                        })}
                                        
                                    </div>

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
