const AssignTest = require("../../../models/admin/AssignTest");

const CreateAssignTest = async (req, res) => {
  try {
    let data = req.body
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
    await AssignTest.findOneAndUpdate({
                school_id: data?.school_id,
                class_id: data?.class_id,
                test_id: data?.test_id,
            },{$set: {
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
          class_id: req?.params?.class_id,
          school_id: req?.params?.school_id
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
  AssignedTestToClass
}