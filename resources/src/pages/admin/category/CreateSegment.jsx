import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleCategory from '../../../hooks/useSingleCategory';
import Loading from '../../../components/Loading';


export default function CreateSegment() {
    const {data} = useSingleCategory();
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;
    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);
    
    useEffect(getSegments,[data]);
    const [segments, setSegments] = useState([])

    const [loading, setLoading] = useState(false)
    async function getSegments(){
        const category_slug = params?.category_slug;
        if(category_slug && data?.segment_uploaded === false){
            setLoading(true)
            const response = await axios.get(`https://spares-mp.gomechanic.app/categories/?format=json`);
            let categoryData = response?.data?.data;
            let segmentData = categoryData.filter( category => category.segment_slug === category_slug);
            setSegments(segmentData)
            setLoading(false);
        }
    }
    const [formData] = useState({});
    const [formSubmit, setFormSubmit] = useState(false)
    const uploadSegments = async () => {
        setFormSubmit(true);
        formData['segment_uploaded'] = true;
        formData['segments'] = segments;
        await uploadMutation.mutate(formData);
    }
    const queryClient = useQueryClient();
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }
    const uploadMutation = useMutation((formData) => {
        let category_id =  params?.category_id;
        return axios.patch(`${API_URL}v1/category/update/${category_id}`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('category')
        setFormSubmit(false);
        addToast('Category Segment Updated successfully', { appearance: 'success',autoDismiss: true });
        history.push(`/category-management/${params?.category_id}`);
    }
    });

    const [singleSegment,setSingleSegment] = useState({});
    const [segmentName, setSegmentName] = useState('');
    const [segmentIcon, setSegmentIcon] = useState('');
    const [segmentDetails, setSegmentDetails] = useState('');
    useEffect(getSingleSegment, [data, params?.segment_id]);
    async function getSingleSegment(){
        if(params?.segment_id){
            const segmentData = await data?.segments?.filter(segment => segment?._id === params?.segment_id);
            setSingleSegment(segmentData && segmentData[0]);
        }
    }
    async function onBlurHandle(e){
        e.preventDefault();
        let image = e.target.value
        let key = image.split('/')[5];
        // console.log(key); return;
        if(image.length > 0){
            let image_url = `https://drive.google.com/uc?export=view&id=${key}`
            if(params?.category_id){
                setSingleSegment({...singleSegment, icon: image_url})
            }else{
                setCategoryImage(image_url)
            }
        }
    }
    const uploadSegment = useMutation((singleSegment) => {
        return axios.patch(`${API_URL}v1/category/update/segment/${params?.category_id}/${params?.segment_id}`, singleSegment, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('category')
        setFormSubmit(false);
        addToast('Category Segment Updated successfully', { appearance: 'success',autoDismiss: true });
        history.push(`/admin/category-management/${params?.category_id}/link-segment/${params?.category_slug}`);
    }
    });
    async function saveAppModule(e){
        e.preventDefault();
        console.log(singleSegment);
        await uploadSegment.mutate(singleSegment);
    }
    
    return (
        <div>
            {data?.segment_uploaded === false && (
                <div>
                    <p className="form-heading" style={{ fontSize: '1.2em', fontWeight: 'bold'}}>
                    Segments: {params?.category_slug} 
                    <button className="btn btn-sm dark pull-right"
                    onClick={uploadSegments}>
                        {formSubmit ? (
                            <Loading isLoading={formSubmit} />
                        ) : (
                            <span className="fa fa-save"></span>
                        )}
                        </button>    
                    </p>
                    <hr className="mt-1 mb-1"/>
                    {!formSubmit && (
                        <Loading isLoading={loading} />
                    )}
                    {segments?.map(seg => {
                        return (
                            <p className="card pl-1 mb-1">
                                {seg?.name}
                            </p>
                        )
                    })}
                </div>
            )}
            
            {data?.segment_uploaded === true && (
                <div>
                    <p>Segments: <span className="pull-right">{params?.category_slug}</span></p>
                    <hr className="mt-1 mb-1"/>
                    <form onSubmit={saveAppModule}>
                    <div className="form-group">
                        <input type="text" className="form-control"
                            value={params?.segment_id ? singleSegment?.name : segmentName} 
                            onChange={e => {
                                if(params?.segment_id){
                                    setSingleSegment({...singleSegment, name: e.target.value})
                                }else{
                                    setSegmentName(e.target.value);
                                }
                            }}
                            placeholder="Segment Name"/>
                    </div>
                    
                    <div className="form-group">
                        <input type="text" className="form-control" 
                            value={params?.segment_id ? singleSegment?.icon : segmentIcon} 
                            onChange={e => {
                                if(params?.segment_id){
                                    setSingleSegment({...singleSegment, icon: e.target.value})
                                }else{
                                    setSegmentIcon(e.target.value);
                                }
                            }}
                            onBlur={onBlurHandle}
                            placeholder="Segment Image Url"/>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" 
                            value={params?.segment_id ? singleSegment?.about : segmentDetails} 
                            onChange={e => {
                                if(params?.segment_id){
                                    setSingleSegment({...singleSegment, about: e.target.value})
                                }else{
                                    setSegmentDetails(e.target.value);
                                }
                            }}
                            placeholder="Segment Details"/>
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
                                {params?.segment_id ? (
                                    <><span className="fa fa-save mr-2"></span> Update Segment</>
                                    ):(
                                        
                                        <><span className="fa fa-save mr-2"></span> Save Segment</>
                                )}
                                </>
                            )}
                            
                        </button>
                        {params?.segment_id && (
                            <button className="btn btn-sm red ml-2"
                            onClick={e => {
                                e.preventDefault();
                                setSingleSegment({})
                                history.push(`/admin/category-management/${params?.category_id}/link-segments/${params?.category_slug}`)
                            }}>
                                <span className="fa fa-times mr-2"></span>
                                Cancel
                            </button>
                        )}
                    </div>

                </form> 
                </div>
            )}

        </div>
    )
}
