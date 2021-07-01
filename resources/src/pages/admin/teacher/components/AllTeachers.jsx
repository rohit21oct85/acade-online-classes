import useTeacherList from '../hooks/useTeacherList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'
import useDeleteTeacher from '../hooks/useDeleteTeacher';

export default function AllTeachers({update, Delete}) {

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

    const deleteMutation = useDeleteTeacher();

    const deleteTeacher = async (id) => {
        await deleteMutation.mutate(id)
    }

    function getSchoolName(arr, id){
        if(data?.length > 0 && !isLoading){
            let dataSchool = arr?.filter(el => el?._id === id);
            return dataSchool && dataSchool[0]?.school_name;
        }else{
            return '';
        }
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
                        <th scope="col">#EmpID</th>
                        <th scope="col">School Name</th>
                        <th scope="col">Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Class</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => {
                            let school_name = getSchoolName(schools, item?.school_id);
                            let tclass = '';
                            
                            tclass = Array.prototype.map.call(item?.classess, function(items) { if(items.checked === true){return items.class_name+', '} });
                            
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{item.EmpID}</th>
                                <td>{school_name}</td>
                                <td>{item.name}</td>
                                <td>{item.subject_name}</td>
                                <td>{tclass}</td>
                                <td>{item.mobile}</td>
                                <td>{item.email}</td>
                                <td>
                                    {update && (
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                    if(params.school_id){
                                                        history.push(`/admin/teachers-management/update/${params?.school_id}/${params?.subject_id}/${params?.subject_name}/${item?._id}`)
                                                    }else{
                                                        history.push(`/admin/teachers-management/update/${item.school_id}/${item?.subject_id}/${item?.subject_name}/${item?._id}`)
                                                    }
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                    )}
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
