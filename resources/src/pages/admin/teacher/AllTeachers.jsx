import useTeacherList from '../../../hooks/teachers/useTeacherList';
import Loading from '../../../components/Loading';
import {useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import {AuthContext} from '../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'

export default function AllTeachers() {

    const {data, isLoading} = useTeacherList();
    
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

    const deleteMutation = useMutation((teacher_id) => {
        return axios.delete(`${API_URL}v1/teacher/delete/${teacher_id}`, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('teachers')
            addToast('Teacher Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteTeacher = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>All Teachers</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Class Assigned</th>
                        <th scope="col">Phone no</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.class_assigned}</td>
                                <td>{item.phone_no}</td>
                                <td>
                                    <button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                    history.push(`/admin/teachers-management/modify-teacher/${item?._id}`)
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
