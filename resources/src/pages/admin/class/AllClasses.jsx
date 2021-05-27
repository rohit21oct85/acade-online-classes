import useClassList from '../../../hooks/classes/useClassList';
import Loading from '../../../components/Loading';
import {useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import {AuthContext} from '../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'
import {useParams} from 'react-router-dom'

export default function AllClasses() {
    const params = useParams();

    const {data, isLoading} = useClassList();
    
    const [schooloradmin, setSchoolOrAdmin] = useState("admin");

    const history = useHistory();

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const queryClient = useQueryClient()

    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const deleteMutation = useMutation((class_id) => {
        return axios.delete(`${API_URL}v1/class/delete/${class_id}`, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('classes')
            addToast('Class Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteClass = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>All Classes</p>
        <hr className="mt-1"/>
        {/* <Loading isLoading={isLoading} />  */}
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Class Name</th>
                        <th scope="col">Section</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.class_name}</td>
                                <td>{item.section}</td>
                                <td>{item.capacity}</td>
                                <td>
                                    <button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                if(params.school_id){
                                                    history.push(`/admin/class-management/modify-class/${params?.school_id}/${item?._id}`)
                                                }else{
                                                    history.push(`/admin/class-management/modify-class/${item?._id}`)
                                                }
                                            }
                                        }>
                                        <span className="fa fa-edit"></span>
                                    </button>
                                    <button className="btn bg-danger text-white btn-sm"
                                        onClick={() => deleteClass(item?._id)}>
                                        <span className="fa fa-trash"></span>
                                    </button>
                                </td>
                                </tr>
                            )
                        })}      
                </tbody>
            </table>   
        </div>
    </>
    )
}
