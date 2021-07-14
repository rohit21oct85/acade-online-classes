import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';

import useMockTestList from '../hooks/useMockTestList'
import useUpdateMockTest from '../hooks/useUpdateMockTest';

export default function MockTestList() {
      const {data:mocktests} = useMockTestList();
      const params = useParams();
      const history = useHistory();
      const [formData, setFormData] = useState({});
      const updateStatusMutation = useUpdateMockTest();
      async function handleActiveMockTest(id,status){
            formData['test_id'] = id
            formData['status'] = status
            await updateStatusMutation.mutate(formData);
      }
      console.log(mocktests)
      return (
            <div className="flex no-gutter" style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                 {mocktests !== undefined && Array.from(mocktests)?.map((mq,ind) => {
                       return(
                              <div 
                                    className="card flex col-md-6 p-2 mb-2" 
                                    key={ind}
                                    style={{ 
                                    cursor: 'pointer', 
                                    flexDirection: 'row', 
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-end',
                                    color: 'white'
                              }}>
                                  <div className="col-md-6 text-dark">Test Name: &nbsp;{mq.test_name}</div>
                                  <span className={`col-md-6 ${mq.answer === 'a'? 'bg-success': 'bg-danger'}`}>
                                    Test Type: {mq.test_type}
                                  </span>
                                  <div className="col-md-6 text-dark">Test For: &nbsp;{mq.test_for}</div>
                                  <span className={`col-md-6 mt-2 ${mq.answer === 'a'? 'bg-success': 'bg-danger'}`}>
                                    Total Question: {mq.total_question}
                                  </span>
                                  <div className="col-md-6 text-dark">Test Duration: &nbsp;{mq.test_duration} Min</div>
                                  
                                  <hr />
                                  <div className="col-md-12 mt-3">
                                    <button className={`dark mr-2 ${mq?.status ? 'bg-success': 'bg-danger'}`}
                                    onClick={(e) => {
                                          handleActiveMockTest(mq?._id,!mq?.status)
                                    }}>
                                        {updateStatusMutation?.isLoading ? 
                                        <span className="fa fa-spinner mr-2"></span>: 
                                        <span className="fa fa-pencil mr-2"></span> }  
                                        
                                        {mq?.status === false ? 'Active Mock Test': 'Deactive c Test'}
                                    </button>
                                    </div>  
                              </div>
                       )
                 })}
            </div>
      )
}
