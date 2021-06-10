import React from 'react'
import { useParams } from 'react-router';
import Loading from '../../../components/Loading';
import useAppRoleModules from '../../../hooks/permissions/useAppRoleModules';
import useAppPermission from '../../../hooks/permissions/useAppPermissions';
import SinglePermission from './SinglePermission';
import useDeleteMoudlePermission from '../../../hooks/permissions/useDeleteMoudlePermission';

export default function AppPermissionList() {
    const {data, isLoading} = useAppPermission();
    const {data:modules} = useAppRoleModules();
    const params = useParams();
    const deleteMutation = useDeleteMoudlePermission();
    async function handleDeleteModule(id, slug){
        let module_id = id
        let module_slug = slug
        let email = params?.admin_email
        await deleteMutation.mutate({module_id, module_slug,email});
        setTimeout(() => {
            document.getElementById(`${module_id}`).style.display = "none";
        },1500)
    }
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>App Permissions for
            <span className="badge-danger br-5 ml-2 p-1"
            style={{
                fontSize: '0.90rem'
            }}>{params?.role_slug?.replaceAll('-'," ")}</span>
            
            <span className="badge-success br-5 ml-2 p-1"
            style={{
                fontSize: '0.90rem'
            }}>{params?.admin_email}</span>

            </p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            
            <div className="col-md-12 no-gutter data-container">
            
            {modules?.map( module => {
                let filter_methods = data?.filter( method => method?.module_slug === module?.module_slug);
                return (
                    <div className="col-md-12 pl-2 pr-0" id={`${module?._id}`} key={module?._id}>
                        <h4>
                            <span className={`bi ${module?.module_icon} mr-3 mb-2`}></span>
                            {module?.module_name}
                            <button className="dark btn-sm pull-right"
                            onClick={handleDeleteModule.bind(this, module?._id, module?.module_slug)}>
                                {deleteMutation?.isLoading 
                                ?
                                <span className="fa fa-spinner"></span>
                                :
                                <span className="fa fa-trash"></span>
                                }
                            </button>
                        </h4>
                        <hr className="mt-2 mb-2"/>
                        <div className="clearfix"></div>
                        <div className="col-md-12 row">
                        {filter_methods?.map( methos => 
                            <SinglePermission permission={methos} key={methos?._id}/>
                        )}
                        </div>
                    </div>
                )
            })}
            </div>
        </>
    )
}
