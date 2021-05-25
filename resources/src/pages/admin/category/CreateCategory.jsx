import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleCategory from '../../../hooks/useSingleCategory';

export default function CreateCategory() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;
    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [categoryName, setCategoryName] = useState("");
    const [categoryDetails, setCategoryDetails] = useState("");
    const [categoryImage, setCategoryImage] = useState("");
    const [loading, setLoading] = useState(false);
    const {data} = useSingleCategory();
    const [singleCategory, setSingleCategory] = useState();
    const [formData, setFormData] = useState({});
    useEffect(setModule, [data]);
    function setModule(){
        setSingleCategory(data)
    }
    function clearFields(){
        setCategoryName('');
        setCategoryDetails('');
        setCategoryImage('');
        setSingleCategory({})
    }
    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }
    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/category/create`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('category')
        setLoading(false);
        clearFields();
        history.push(`${path}`);
        addToast('Category added successfully', { appearance: 'success',autoDismiss: true });
    }
    });
    
    const updateMutation = useMutation((formData) => {
        let category_id =  params?.category_id;
        return axios.patch(`${API_URL}v1/category/update/${category_id}`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('category')
        setLoading(false);
        clearFields();
        history.push(`${path}`);
        addToast('Category Updated successfully', { appearance: 'success',autoDismiss: true });
        history.push(`/category-management`)
    }
    });

    const saveAppModule = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        formData['category_name'] = params?.category_id ? singleCategory?.category_name : categoryName;
        formData['category_image'] = params?.category_id ? singleCategory?.category_image : categoryImage;
        formData['category_details'] = params?.category_id ? singleCategory?.category_details : categoryDetails;
        formData['category_slug'] = utils.MakeSlug(params?.category_id ? singleCategory?.category_name : categoryName);
        // console.log(formData); return;
        if(params?.category_id){
            await updateMutation.mutate(formData);
        }else{
            await mutation.mutate(formData);
        }
    }
    async function onBlurHandle(e){
        e.preventDefault();
        let image = e.target.value
        let key = image.split('/')[5];
        // console.log(); return;
        if(image.length > 0){
            let image_url = `https://drive.google.com/uc?export=view&id=${key}`
            if(params?.category_id){
                setSingleCategory({...singleCategory, category_image: image_url})
            }else{
                setCategoryImage(image_url)
            }
        }
    }
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Category</p>
            <hr className="mt-1"/>
            <form onSubmit={saveAppModule}>
                <div className="form-group">
                    <input type="text" className="form-control" 
                        value={params?.category_id ? singleCategory?.category_name : categoryName}
                        onChange={e => {
                            if(params?.category_id){
                                setSingleCategory({...singleCategory, category_name: e.target.value})
                            }else{
                                setCategoryName(e.target.value)
                            }
                        }}
                        placeholder="Category Name"/>
                </div>
                
                <div className="form-group">
                    <input type="text" className="form-control" 
                        value={params?.category_id ? singleCategory?.category_image : categoryImage}
                        onChange={e => {
                            if(params?.category_id){
                                setSingleCategory({...singleCategory, category_image: e.target.value})
                            }else{
                                setCategoryImage(e.target.value)
                            }
                        }}
                        onBlur={onBlurHandle}
                        placeholder="Category Image Url"/>
                        <span style={{ fontSize: '0.7rem'}}>
                        Note: Please Copy Image Link From Google Drive. 
                        </span>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" 
                        value={params?.category_id ? singleCategory?.category_details : categoryDetails}
                        onChange={e => {
                            if(params?.category_id){
                                setSingleCategory({...singleCategory, category_details: e.target.value})
                            }else{
                                setCategoryDetails(e.target.value)
                            }
                        }}
                        placeholder="Category Details"/>
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
                            {params?.category_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Category</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Category</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.category_id && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            clearFields();
                            setSingleCategory({})
                            history.push(`/category-management`)
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
