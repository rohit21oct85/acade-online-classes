import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleModule from '../../../hooks/useSingleModule';

export default function CreateAppModule() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);
    const [moduleName, setModuleName] = useState("");
    const [moduleIcon, setModuleIcon] = useState("");
    const [loading, setLoading] = useState(false);
    const {data} = useSingleModule();
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
    }
    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }
    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/module/create`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('app-modules')
        setLoading(false);
        clearFields();
        history.push(`${path}`);
        addToast('App Module added successfully', { appearance: 'success',autoDismiss: true });
    }
    });
    
    const updateMutation = useMutation((formData) => {
        let module_id =  params?.module_id;
        return axios.patch(`${API_URL}v1/module/update/${module_id}`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('app-modules')
        setLoading(false);
        clearFields();
        history.push(`${path}`);
        addToast('App Module Updated successfully', { appearance: 'success',autoDismiss: true });
        history.push(`/admin/app-module`)
    }
    });

    const saveAppModule = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        formData['module_name'] = params?.module_id ? singleModule?.module_name : moduleName;
        formData['module_slug'] = utils.MakeSlug(params?.module_id ? singleModule?.module_name : moduleName);
        formData['module_icon'] = params?.module_id ? singleModule?.module_icon : moduleIcon;
        if(params?.module_id){
            await updateMutation.mutate(formData);
        }else{
            await mutation.mutate(formData);
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Create App Module</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppModule}>
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
                <div className="form-group flex">
                    <button className="btn btn-sm dark">
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.module_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Module</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Module</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.module_id && (
                        <button className="btn btn-sm dark ml-2"
                        onClick={e => {
                            e.preventDefault();
                            clearFields();
                            setSingleModule({})
                            history.push(`/admin/app-module`)
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
