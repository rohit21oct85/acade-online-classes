const AssignTest = require("../../../models/admin/AssignTest");

const CreateAssignTest = async (req, res) => {
  try {
    
    const AssignTestData = req.body;
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
    await AssignTestData.map( data => {
            AssignTest.findOneAndUpdate({
                school_id: data?.school_id,
                class_id: data?.class_id,
                subject_id: data?.subject_id,
                test_id: data?.test_id,
            },{$set: {
              school_id: data?.school_id,
              class_id: data?.class_id,
              class_name: data?.class_name,
              subject_id: data?.subject_id,
              subject_name: data?.subject_name,
              test_id: data?.test_id,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        });


    return res.status(200).json({
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
      if(req?.params?.class_id && req?.params?.subject_id && req?.params?.school_id){
        filter = {
          class_id: req?.params?.class_id,
          subject_id: req?.params?.subject_id,
          school_id: req?.params?.school_id,
        }
      }else if(req?.params?.class_id && req?.params?.subject_id){
        filter = {
          class_id: req?.params?.class_id,
          subject_id: req?.params?.subject_id
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

module.exports = {
  CreateAssignTest,
  ViewAllAssignedTest
}