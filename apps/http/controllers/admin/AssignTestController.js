const AssignTest = require("../../../models/admin/AssignTest");
const MockTestQuestion = require("../../../models/admin/MockTestQuestion");

const CreateAssignTest = async (req, res) => {
  try {
    let data = req.body;
    // console.log(data); return;
    const testWindow = req.body.test_window;
    let filter;
    let assignTest;
    if(data.test_type === 'mock-test'){
      filter =   {
        school_id:  req.body.school_id,
        test_type: 'mock-test',
        assigned: false
      }
    }else{
      filter = {
        class_id: data.class_id,
        school_id:  req.body.school_id,
        assigned: false
      }
    }
    assignTest = await AssignTest.findOne(filter,{start_date:1,test_window:1
    }).limit(1).sort({$natural:-1})
    
    
    // console.log(assignTest);return

    let timeAlTest = new Date(assignTest?.start_date)
    timeAlTest.setMinutes( timeAlTest.getMinutes() + assignTest?.test_window );
    
    let timeNwTest = new Date(data.start_date)
    // console.log(timeAlTest, timeNwTest);return

    if(assignTest === null){
      var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
      if(data.test_type === 'mock-test'){
        filter =   {
          school_id:  req.body.school_id,
          test_type: 'mock-test',
          test_id: data?.test_id,
        }
      }else{
        filter = {
          class_id: data.class_id,
          school_id:  req.body.school_id,
          test_id: data?.test_id,
        }
      }
      await AssignTest.findOneAndUpdate(filter,{$set: {
              school_id: data?.school_id,
              school_name: data?.school_name,
              class_id: data?.class_id,
              class_name: data?.class_name,
              subject_id: data?.subject_id,
              subject_name: data?.subject_name,
              test_id: data?.test_id,
              test_name: data?.test_name,
              test_type: data?.test_type,
              test_subjects: data?.test_subjects,
              start_date: data?.start_date,
              test_duration: data?.test_duration,
              test_window: data?.test_window,
              total_question: data?.total_question,
              assigned: false
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        res.status(200).json({
          message: "AssignTest created sucessfully",
        });
    }
    else if(timeNwTest > timeAlTest){
      var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
      if(data.test_type === 'mock-test'){
        filter =   {
          school_id:  req.body.school_id,
          test_type: 'mock-test',
          test_id: data?.test_id,
        }
      }else{
        filter = {
          class_id: data.class_id,
          school_id:  req.body.school_id,
          test_id: data?.test_id,
        }
      }
      await AssignTest.findOneAndUpdate(filter,{$set: {
              school_id: data?.school_id,
              school_name: data?.school_name,
              class_id: data?.class_id,
              class_name: data?.class_name,
              test_class_id: data?.test_class_id,
              test_class_name: data?.test_class_name,
              subject_id: data?.subject_id,
              subject_name: data?.subject_name,
              test_id: data?.test_id,
              test_name: data?.test_name,
              test_type: data?.test_type,
              test_subjects: data?.test_subjects,
              start_date: data?.start_date,
              test_duration: data?.test_duration,
              test_window: data?.test_window,
              total_question: data?.total_question,

            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        res.status(200).json({
          message: "AssignTest created sucessfully",
        });
    }else{
      res.status(405).json({
        message: "Test Cant be assigned, a test is already assigned for this time"
      })
    }
    
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};

const ViewAllAssignedTest = async (req, res) => {
   try {
      let filter = '';
      if(req?.params?.school_id && req?.params?.class_id ){
        
          filter = {
            school_id: req?.params?.school_id,
            test_type: req?.params?.test_type,
            class_id: req?.params?.class_id,
          }
        
      }
     
     const AssignTests = await AssignTest.find(filter);
     res.status(201).json({
       data: AssignTests
     })
   } catch (error) {
      res.status(502).json({
        message: error.message,
      });
   }
}
const ViewAssignedMockTest = async (req, res) => {
   try {
      let filter = '';
      if(req?.params?.school_id){
          filter = {
            school_id: req?.params?.school_id,
            test_type: req?.params?.test_type,
          }
      }
      let totalQuestion = await MockTestQuestion.countDocuments({question_for: "student"});
      // console.log(totalQuestion); return;
      let AssignTests = await AssignTest.find(filter);
      AssignTests.map( assignTest => {
        assignTest.total_question = totalQuestion
      })
      
     
      //res.json(AssignTests); return; 

     res.status(201).json({
       data: AssignTests
     })
   } catch (error) {
      res.status(502).json({
        message: error.message,
      });
   }
}


const AssignedTestToClass = async (req, res) => {
   try {
        await AssignTest.findByIdAndUpdate({_id: req.body._id}, {
          assigned: true
        });  
        res.status(200).json({
          message: "Assigned Test to class sucessfully",
        });
        
   } catch (error) {
      res.status(203).json({
       status: 500,
       message: error.message
      })
   }
}

module.exports = {
  CreateAssignTest,
  ViewAllAssignedTest,
  ViewAssignedMockTest,
  AssignedTestToClass
}