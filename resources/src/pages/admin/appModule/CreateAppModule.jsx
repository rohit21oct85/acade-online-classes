import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useAppModule from '../../../hooks/modules/useAppModule';
import useSingleModule from '../../../hooks/modules/useSingleModule';
import useCreateModule from '../../../hooks/modules/useCreateModule';
import useUpdateModule from '../../../hooks/modules/useUpdateModule';
import useDeleteModule from '../../../hooks/modules/useDeleteModule';

export default function CreateAppModule() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);
    const types = [
        {
            key: 'master_admin', value: 'Master Admin'
        },
        
        {
            key: 'sub_admin', value: 'Sub Admin'
        },
        
        {
            key: 'app_module', value: 'App Module'
        },

    ]
    const [moduleName, setModuleName] = useState("");
    const [moduleIcon, setModuleIcon] = useState("");
    const [moduleSequence, setModuleSequence] = useState("");
    const [moduleType, setModuleType] = useState("");
    const [loading, setLoading] = useState(false);
    const {data} = useSingleModule();
    const {data:appModules} = useAppModule();
    const [singleModule, setSingleModule] = useState();
    const [formData, setFormData] = useState({});
    useEffect(setModule, [data]);
    function setModule(){
        setSingleModule(data)
    }
    function clearFields(){
        setModuleName('');
        setModuleIcon('');
        setSingleModule({})
        setLoading(false);
    }
    
    const createMutation = useCreateModule(formData);
    const updateMutation = useUpdateModule(formData);
    const deleteMutation = useDeleteModule(formData);
    
    const saveAppModule = async (e) => {
        e.preventDefault();
        setLoading(true);
        formData['module_name'] = params?.module_id ? singleModule?.module_name : moduleName;
        formData['module_slug'] = utils.MakeSlug(params?.module_id ? singleModule?.module_name : moduleName);
        formData['module_icon'] = params?.module_id ? singleModule?.module_icon : moduleIcon;
        formData['module_sequence'] = params?.module_id ? singleModule?.module_sequence : moduleSequence;
        if(params?.module_id){
            formData['module_type'] = singleModule?.module_type;
        }else{
            formData['module_type'] = moduleType;
        }
        if(params?.module_id){
            await updateMutation.mutate(formData);
        }else{
            await createMutation.mutate(formData);
        }
        clearFields();
    }

    async function handleDelete(e){
        e.preventDefault();
        formData['module_id'] = params?.module_id;
        await deleteMutation.mutate(formData);
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Create App Module</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppModule}>
            <div className="form-group p-rel">
                    <select 
                    name="module_type"
                    className="form-control"
                    value={singleModule?.module_type}
                    onChange={e => {
                        if(params?.module_id){
                            setSingleModule({...singleModule, module_type: e.target.value})
                        }else{
                            setModuleType(e.target.value)
                        }
                    }}
                    >
                        <option>Select Module Type</option>
                        {types?.map(type => {
                            return(
                                <option value={type?.key}>{type?.value}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" 
                        value={params?.module_id ? singleModule?.module_name : moduleName}
                        onChange={e => {
                            if(params?.module_id){
                                setSingleModule({...singleModule, module_name: e.target.value})
                            }else{
                                setModuleName(e.target.value)
                            }
                        }}
                        placeholder="Module Name"/>
                </div>
                <div className="form-group p-rel">
                    <input type="text" className={`form-control ${params?.module_id ? 'pl6x': ''}`} 
                        value={params?.module_id ? singleModule?.module_icon: moduleIcon}
                        placeholder="Module Icon"
                        onChange={e => {
                            if(params?.module_id){
                                setSingleModule({...singleModule, module_icon: e.target.value})
                            }else{
                                setModuleIcon(e.target.value)
                            }
                        }}/>
                        <span className={`fa p-abs tl10 ${singleModule?.module_icon}`}></span>
                </div>
                
                <div className="form-group p-rel">
                    <select 
                    name="module_sequence"
                    className="form-control"
                    value={singleModule?.module_sequence}
                    onChange={e => {
                        if(params?.module_id){
                            setSingleModule({...singleModule, module_sequence: e.target.value})
                        }else{
                            setModuleSequence(e.target.value)
                        }
                    }}
                    >
                        <option>Select Sequence</option>
                        {appModules?.map((module, index) => {
                            return(
                                <option value={index} key={index}>{index}</option>
                            )
                        })}
                    </select>
                </div>

                <div className="form-group flex">
                    <button className="btn btn-sm dark br-5">
                        {loading ? (
                            <><span className="fa fa-spinner mr-2"></span></>
                        ) : (
                            <>
                            {params?.module_id ? (
                                <><span className="fa fa-save mr-2"></span> Update</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.module_id && (
                        <>
                        <button className="btn btn-sm dark bg-warning ml-2 br-5"
                        onClick={e => {
                            e.preventDefault();
                            clearFields();
                            setSingleModule({})
                            history.push(`/admin/app-module`)
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
