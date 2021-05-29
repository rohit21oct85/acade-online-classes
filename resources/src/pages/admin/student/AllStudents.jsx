import useStudentList from '../../../hooks/students/useStudentList';
import useClassList from '../../../hooks/classes/useClassList';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import Loading from '../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import {AuthContext} from '../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'

export default function AllStudents() {
    
    const history = useHistory();

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const queryClient = useQueryClient()

    const params = useParams();
    
    const {data, isLoading} = useStudentList();
    const {data:schools, schoolIsLoading} = useSchoolLists();
    const {data:classes, classIsLoading} = useClassList();
    const school = schools?.filter( school => school?._id == params?.school_id)
    const clas = classes?.filter( item => item?._id == params?.class_id)

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
            const key = (params.school_id && params.class_id) ? `students-${params.school_id}-${params.class_id}` : `students`
            queryClient.invalidateQueries(key)
            addToast('Student Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteStudent = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>{(school && school[0]?.name) ? "School: "+school[0].name+" - Class: "+ (clas && clas[0]?.class_name ? clas[0].class_name : '') : "All Students"}</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Guardian Name</th>
                        <th scope="col">Guardian Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.guardian_name}</td>
                                <td>{item.guardian_phone_no}</td>
                                <td>
                                    <button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                    history.push(`/admin/student-management/modify-student/${item.school_id}/${item.class_id}/${item?._id}`)
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
