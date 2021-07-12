import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import useCreateMockTest from "../hooks/useCreateMockTest";
import useSingleQuestion from "../hooks/useSingleQuestion";
import useUpdateMockTestQuestion from "../hooks/useUpdateMockQuestion";

export default function CreateMockTest() {
  const params = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({});
  const createMutation = useCreateMockTest(formData);
  const updateMutation = useUpdateMockTestQuestion(formData);
  const { data: singleQuestion } = useSingleQuestion();

  async function handleSubmit(e) {
    e.preventDefault();
    formData["question_for"] = params?.question_for;
    if (!formData?.test_name) {
      addToast("Please write a test_name?", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    } else if (!formData?.test_duration) {
      addToast("Please write test_duration?", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    } else {
      formData["test_for"] = params?.question_for;
      formData["test_type"] = "mock-test";
      await createMutation.mutate(formData);
    }
  }

  function handleChange(e) {
    if (params?.test_id) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      if (e.target.name === "test_duration") {
        if (!isNaN(e.target.value)) {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        } else {
          addToast("please enter test duration in numbers", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="test_name"
            placeholder="enter test name"
            value={formData.test_name ?? singleQuestion?.test_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="test_duration"
            placeholder="enter test duration"
            value={formData.test_duration ?? singleQuestion?.test_duration}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <button className="btnb tn-sm dark bg-success">
            {createMutation.isLoading && (
              <>
                <span className="fa fa-spinner mr-2"></span> Processing
              </>
            )}
            {!createMutation.isLoading && params?.test_id && (
              <>
                <span className="fa fa-save mr-2"></span> Update Mock Test
              </>
            )}

            {!createMutation.isLoading && !params?.test_id && (
              <>
                <span className="fa fa-save mr-2"></span> Save Mock test
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
