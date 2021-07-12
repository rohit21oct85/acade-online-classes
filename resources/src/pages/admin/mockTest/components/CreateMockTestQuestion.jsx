import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';

import useCreateMockQuestion from '../hooks/useCreateMockQuestion';
import useSingleQuestion from '../hooks/useSingleQuestion';
import useUpdateMockTestQuestion from '../hooks/useUpdateMockQuestion';

export default function CreateMockTestQuestion() {
      const params = useParams();
      const history = useHistory();
      const { addToast } = useToasts()
      const [formData, setFormData] = useState({})
      const createMutation = useCreateMockQuestion(formData);
      const updateMutation = useUpdateMockTestQuestion(formData);
      const {data:singleQuestion} = useSingleQuestion();
      async function handleSubmit(e){
            e.preventDefault();
            formData['question_for'] = params?.question_for
            if(params?.test_id)
            {
                  formData['test_id'] = params?.test_id    
                  await updateMutation.mutate(formData);
            }else{
                  if(!formData?.question){
                        addToast('Please write a question?', { appearance: 'error',autoDismiss: true });
                        return;
                  }
                  else if(!formData?.option_a){
                        addToast('Please write a option a?', { appearance: 'error',autoDismiss: true });
                        return;
                  }
                  else if(!formData?.option_b){
                        addToast('Please write a option b?', { appearance: 'error',autoDismiss: true });
                        return;
                  }
                  else if(!formData?.answer){
                        addToast('Please select correct answer?', { appearance: 'error',autoDismiss: true });
                        return;
                  }
                  else{
                        await createMutation.mutate(formData)
                  }
            }
      }
      return (
            <div>
                 <form onSubmit={handleSubmit}>
                        <div className="form-group">
                              <input type="text" 
                                    className="form-control"
                                    placeholder="enter question"
                                    value={formData.question ?? singleQuestion?.question}
                                    onChange={(e) => setFormData({...formData, ['question']: e.target.value})}/>
                        </div>
                       
                        <div className="form-group">
                              <input type="text" 
                                    className="form-control"
                                    placeholder="enter option a"
                                    name="option_a"
                                    value={formData.option_a ?? singleQuestion?.option_a}
                                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}/>
                        </div>
                       
                        <div className="form-group">
                             <input type="text" 
                              className="form-control"
                              name="option_b"
                              placeholder="enter option b"
                              value={formData.option_b ?? singleQuestion?.option_b}
                              onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}/>
                        </div>
                        <div className="form-group">
                             <select className="form-control"
                             name="answer"
                             valuw={formData?.answer  ?? singleQuestion?.answer}
                             onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                             >
                                    <option>Answer</option>
                                    <option value="a">Option A</option>
                                    <option value="b">Option B</option>
                             </select>
                       </div>
                       <div className="form-group">
                             <button className="btnb tn-sm dark bg-success"
                             >
                              {createMutation.isLoading && (
                                    <>
                                    <span className="fa fa-spinner mr-2"></span> Processing
                                    </>
                              )}     
                              {!createMutation.isLoading && params?.test_id && (<>
                                    <span className="fa fa-save mr-2"></span> Update Question
                              </>)}     
                              
                              {!createMutation.isLoading && !params?.test_id && (<>
                                    <span className="fa fa-save mr-2"></span> Save Question
                              </>)}     

                              
                             </button>
                       </div>


                 </form>  
            </div>
      )
}
