import useStudentList from '../../../hooks/useStudentList';
import Loading from '../../../components/Loading';
import {useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import {AuthContext} from '../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'

export default function AllStudents() {

    const {data, isLoading} = useStudentList();
    
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

    const deleteMutation = useMutation((student_id) => {
        return axios.delete(`${API_URL}v1/student/delete/${student_id}`, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('students')
            addToast('Student Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteStudent = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>All Students</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Class Name</th>
                        <th scope="col">Guardian Name</th>
                        <th scope="col">Guardian Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.student_name}</td>
                                <td>{item.class_name}</td>
                                <td>{item.guardian_name}</td>
                                <td>{item.guardian_phone_no}</td>
                                <td>
                                    <button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                    history.push(`/admin/students-management/modify-student/${item?._id}`)
                                            }
                                        }>
                                        <span className="fa fa-edit"></span>
                                    </button>
                                    <button className="btn bg-danger text-white btn-sm"
                                        onClick={() => deleteStudent(item?._id)}>
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
