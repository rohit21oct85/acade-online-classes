import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getFilteredData } from '../../../../utils/helper';
import useCreateSample from '../hooks/useCreateSample';
import useSingleSample from '../hooks/useSingleSample';

export default function CreateSample() {
      const params = useParams();
      const history = useHistory();

      const {data:chapter} = useSingleSample();
      
      const [formData, setFormData] = useState({});
      
      const createMutation = useCreateQuestion(formData);

      async function handleSubmit(e){
            e.preventDefault();
            let sample_id = params?.sample_id
            let classDatas = ["Data Which is alreadt in List Like Schools, classess, subjects"];
            let class_name = getFilteredData(classDatas, sample_id, 'class_name');
            
            console.log(formData);
            await createMutation.mutate(formData);
            
      }
      return (
            <div>
                  
                  <p className="form-heading">
                  <span className="fa fa-plus-circle mr-2"></span>Add New Question
                  </p>
                  <hr className="mt-1"/>
            
            {params?.page_type === 'create' && (
                          
            <form>
                                         
                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        disabled={createMutation?.isLoading}
                        onClick={handleSubmit}>
                        {(createMutation?.isLoading) 
                        ?
                        <><span className="bi bi-spinner mr-2"></span>
                        Processing...</>
                        :
                        <><span className="bi bi-save mr-2"></span>
                        Save Question</>      
                        }
                              
                        </button>
                  </div>

            </form>  
            )}    
            {params?.page_type === 'upload' && (
                <form>
                  <label>Upload Questions and Options </label>
                  <hr className="mt-1 mb-2"/>
                  <div className="form-group">
                        <label>Choose Question CSV File</label>
                        <input type="file" className="form-control"/>
                  </div>
                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        onClick={handleSubmit}>
                              <span className="bi bi-upload mr-2"></span>
                              Upload Question
                        </button>
                  </div>
                </form>  
            )}

            </div>
      )
}
