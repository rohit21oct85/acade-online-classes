import useSubjectList from '../../subject/hooks/useSubjectList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import {AuthContext} from '../../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'

export default function AllSubjects({update, Delete}) {

    const history = useHistory();

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const queryClient = useQueryClient()

    const params = useParams();
    
    const {data, isLoading} = useSubjectList();
    const {data:schools, schoolIsLoading} = useSchoolLists();
    const school = schools?.filter( school => school?._id == params?.school_id)

    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const deleteMutation = useMutation((subject_id) => {
        return axios.delete(`${API_URL}v1/subject/delete/${subject_id}`, options)
    },{
        onSuccess: () => {
            // const key = params?.school_id ? `subjects-${params.school_id}` : `subjects`
            const key = `subjects`
            queryClient.invalidateQueries(key)
            addToast('Subject Deleted successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const deleteSubject = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>{(school && school[0]?.name) ? "School: "+school[0].name: "All Subjects"}</p>
        <hr className="mt-0"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Subject Name</th>
                        <th scope="col">Subject URL</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{key}</th>
                                <td>{item.subject_name}</td>
                                <td>{item.subject_slug}</td>
                                <td>
                                    {update === true && (<button className="btn bg-primary text-white btn-sm mr-2" 
                                        onClick={
                                            e => {
                                                // if(params.school_id){
                                                    // history.push(`/admin/subject-management/modify-subject/${params?.school_id}/${item?._id}`)
                                                // }else{
                                                    history.push(`/admin/subject-management/update/${item?._id}`)
                                                // }
                                            }
                                        }>
                                        <span className="fa fa-edit"></span>
                                    </button>)}

                                    {Delete === true && (<button className="btn bg-danger text-white btn-sm"
                                        onClick={() => deleteSubject(item?._id)}>
                                        <span className="fa fa-trash"></span>
                                    </button>)}
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
