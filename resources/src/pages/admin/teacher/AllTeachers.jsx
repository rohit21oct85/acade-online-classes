import useTeacherList from '../../../hooks/teachers/useTeacherList';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import Loading from '../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import {AuthContext} from '../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'

export default function AllTeachers() {

    const history = useHistory();

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const params = useParams();
    
    const queryClient = useQueryClient()

    const {data, isLoading} = useTeacherList();
    const {data:schools, schoolIsLoading} = useSchoolLists();
    const school = schools?.filter( school => school?._id == params?.school_id)

    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const deleteMutation = useMutation((teacher_id) => {
        return axios.delete(`${API_URL}v1/teacher/delete/${teacher_id}`, options)
    },{
        onSuccess: () => {
            const key = params?.school_id ? `teachers-${params.school_id}` : `teachers`
            queryClient.invalidateQueries(key)
            addToast('Teacher Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteTeacher = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>{(school && school[0]?.name) ? "School: "+school[0].name: "All Teachers"}</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Class</th>
                        <th scope="col">Section</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.name}</td>
                                <td>{item.subject}</td>
                                <td>{item.class}</td>
                                <td>{item.section}</td>
                                <td>{item.mobile}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                if(params.school_id){
                                                    history.push(`/admin/teachers-management/modify-teacher/${params?.school_id}/${item?._id}`)
                                                }else{
                                                    history.push(`/admin/teachers-management/modify-teacher/${item.school_id}/${item?._id}`)
                                                }
                                            }
                                        }>
                                        <span className="fa fa-edit"></span>
                                    </button>
                                    <button className="btn bg-danger text-white btn-sm"
                                        onClick={() => deleteTeacher(item?._id)}>
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
