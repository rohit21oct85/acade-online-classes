import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useToasts } from "react-toast-notifications";

import useSchoolLists from '../../../hooks/schools/useSchoolLists'
import useSchoolAdminLists from "../../../hooks/schools_admin/useSchoolAdminLists";
import useCreateSchoolAdmin from "../../../hooks/schools_admin/useCreateSchoolAdmin";
import useSingleSchoolAdmin from "../../../hooks/schools_admin/useSingleSchoolAdmin";
import useUpdateSchoolAdmin from "../../../hooks/schools_admin/useUpdateSchoolAdmin";
import useDeleteSchoolAdmin from "../../../hooks/schools_admin/useDeleteSchoolAdmin";

export default function CreateSchoolAdmin() {
  const history = useHistory();
  const params = useParams();
  const { addToast } = useToasts();
  const initialData = {
    first_name: "",
    last_name: "",
    admin_email: "",
    password: "",
  };
    const { data: schoolLists } = useSchoolLists();
    const { data } = useSingleSchoolAdmin();
    const [SingleSchoolAdmin, setSingleSchoolAdmin] = useState({});
    const [formData, setFormData] = useState({});
    
    const createMutation = useCreateSchoolAdmin(formData);
    const updateMutation = useUpdateSchoolAdmin(SingleSchoolAdmin);
    const deleteMutation = useDeleteSchoolAdmin(formData);

    const saveSchool = async (e) => {
        e.preventDefault();
        formData["first_name"] = params?.school_admin_id
        ? SingleSchoolAdmin?.first_name
        : formData?.first_name;
        formData["last_name"] = params?.school_admin_id
        ? SingleSchoolAdmin?.last_name
        : formData?.last_name;
        formData["password"] = params?.school_admin_id
        ? SingleSchoolAdmin?.password
        : formData?.password;

        formData["email"] = params?.school_admin_id
        ? SingleSchoolAdmin?.email
        : params?.school_admin_email

        formData['school_id'] = params?.school_id
        formData['role'] = 1

        if (params?.school_admin_id) {
            await updateMutation.mutate(SingleSchoolAdmin);
        } else {
        if (formData?.first_name == "") {
            addToast("Please Enter admin first name", {
            appearance: "error",
            autoDismiss: true,
            });
        } else if (formData?.last_name == "") {
            addToast("Please provide last name", {
            appearance: "error",
            autoDismiss: true,
            });
        } else if (formData?.email == "") {
            addToast("Please provide admin email", {
            appearance: "error",
            autoDismiss: true,
            });
        } else {
            await createMutation.mutate(formData);
        }
        }
    };

    async function handleDelete(e) {
        if (params?.school_admin_id) {
            formData["school_admin_id"] = params?.school_admin_id;
            await deleteMutation.mutate(formData);
        }
    }

    async function handleChange(e) {
        if(params?.school_admin_id) {
            setSingleSchoolAdmin({
                ...SingleSchoolAdmin,
                [e.target.name]: e.target.value,
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }
    
    async function validateEmail(e) {
        const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(String(e.target.value).toLowerCase());
        if (result === false) {
        addToast(`Please provide valid ${e.target.name}`, {
            appearance: "error",
            autoDismiss: true,
        });
        document.getElementsByName(`${e.target.name}`)[0].innerHTML = null;
        document.getElementsByName(`${e.target.name}`)[0].focus();
        }
    }

    useEffect(clearFields, [params?.page_type]);
    useEffect(setSchoolAdmin, [data]);

    async function clearFields (){
        setFormData(initialData);
        setSingleSchoolAdmin(initialData);
    }
    async function setSchoolAdmin() {
      if (data !== undefined) {
        setSingleSchoolAdmin(data);
      }
    }
  return (
    <>
      <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>Create School Admin
      </p>
      <hr className="mt-1" />
      <form onSubmit={saveSchool}>
        <div className="form-group">
          <select
            className="form-control"
            value={`${params?.school_id}_${params?.school_admin_email}`}
            onChange={(e) => {
              if (e.target.value != "-") {
                const data = e.target.value;
                const splitData = data.split('_');  
                const school_id = splitData[0]
                const school_admin_email = splitData[1]
                history.push(
                  `/admin/auth-management/add-password/${school_id}/${school_admin_email}`
                );
              } else {
                history.push(`/admin/auth-management`);
              }
            }}
          >
            <option value="-">Select School</option>
            {schoolLists?.map((school) => {
              return <option value={`${school?._id}_${school?.admin_email}`}>{school?.name}</option>;
            })}
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="admin_email"
            value={
            params?.school_admin_id
                ? SingleSchoolAdmin?.email
                : params?.school_admin_email
            }
            onChange={handleChange}
            onBlur={validateEmail}
            autoComplete="no-password"
            placeholder="admin_email"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="first_name"
            value={
              params?.first_name
                ? SingleSchoolAdmin?.first_name
                : formData?.first_name
            }
            onChange={handleChange}
            autoComplete="no-password"
            placeholder="first name"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="last_name"
            value={
              params?.last_name ? SingleSchoolAdmin?.last_name : formData?.last_name
            }
            onChange={handleChange}
            autoComplete="no-password"
            placeholder="last name"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="password"
            value={
              params?.password ? SingleSchoolAdmin?.password : formData?.password
            }
            onChange={handleChange}
            autoComplete="no-password"
            placeholder="enter password"
          />
        </div>

        <div className="form-group flex">
          <button 
          className="btn btn-sm dark br-5"
          disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? (
              <>
                <span className="fa fa-spinner mr-2"></span>
              </>
            ) : (
              <>
                {params?.school_admin_id ? (
                  <>
                    <span className="fa fa-save mr-2"></span>Update
                  </>
                ) : (
                  <>
                    <span className="fa fa-save mr-2"></span>Save
                  </>
                )}
              </>
            )}
          </button>
          {params?.school_admin_id && (
            <>
              <button
                className="btn btn-sm bg-danger br-5 text-white ml-2"
                onClick={(e) => {
                  e.preventDefault();
                  setFormData({});
                  setSingleSchoolAdmin({});
                  history.push(`/admin/auth-management`);
                }}
              >
                <span className="fa fa-times mr-2"></span>
                Cancel
              </button>

              <button
                className="btn btn-sm bg-warning br-5 text-white ml-2"
                onClick={handleDelete}
              >
                {deleteMutation.isLoading ? (
                  <>
                    <span className="fa fa-spinner mr-2"></span>
                  </>
                ) : (
                  <span className="fa fa-trash mr-2"></span>
                )}
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
