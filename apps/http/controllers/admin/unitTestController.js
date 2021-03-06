const { now } = require("mongoose");
const UnitTest = require("../../../models/admin/UnitTest");

const CreateUnitTest = async (req, res) => {
  const body = req.body;
  try {
    const Test = new UnitTest(body);    
    await Test.save();
    return res.status(200).json({
      message: "UnitTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};
const UpdateUnitTest = async (req, res) => {
  try {
    await UnitTest.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => {
        return res.status(202).json({
          message: "UnitTest, Updated successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error Found",
          errors: error.message,
        });
      });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
const UpdateSubjectUnitTest = async (req, res) => {
  try {
    await UnitTest.updateMany({},{subject_id: req.params.subject_id})
      .then(() => {
        return res.status(202).json({
          message: "UnitTest, Updated successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error Found",
          errors: error.message,
        });
      });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};


const ViewUnitTest = async (req, res) => {
  try {
    const UnitTestData = await UnitTest.findOne({ _id: req.params.id }, { __v: 0 });
    return res.status(200).json({
      data: UnitTestData,
    });
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};
const ViewAllUnitTest = async (req, res) => {
  try {
    let filter = {};
    if(req?.params?.test_type === 'combine-test'){
      filter = {
        test_type: req?.params?.test_type,
        assign_class_id: req?.params?.class_id,
      }
    }else{
      filter = {
        test_type: req?.params?.test_type,
        class_id: req?.params?.class_id,
      }
    }
    
    const AllUnitTests = await UnitTest.find(filter,{
          _id:1,
          test_name: 1, 
          class_name: 1, 
          test_subjects: 1,
          subject_name: 1, 
          unit_name: 1, 
          test_slug: 1,
          test_date: 1,
          test_window: 1,
          test_duration: 1,
          total_question: 1,
          total_marks: 1,
          test_type: 1,
      },{__v:0,test_question: 0 });

    res.status(200).json({
      data: AllUnitTests,
    });
    
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};

const ViewUnitTestByClassSubjects = async (req, res) => {
  try {
    let filter = {};
    if (req.params?.subject_id && req.params?.class_id) {
      filter = {
        class_id: req.params?.class_id,
        subject_id: req.params?.subject_id
      };
    }
    const AllUnitTests = await UnitTest.find(filter,{
          test_name: 1, 
          class_name: 1, 
          subject_name: 1, 
          unit_name: 1, 
          test_slug: 1,
          test_date: 1,
          test_duration: 1,
          total_question: 1,
          total_marks: 1,
      },{__v:0,test_question: 0 });
    res.status(200).json({
      data: AllUnitTests,
    });
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};

const DeleteUnitTest = async (req, res) => {
  try {
    const unitTest_id = req.body.id;
    await UnitTest.deleteOne({ _id: unitTest_id });
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const AddFields = async (req, res) => {
  try {
    await UnitTest.updateMany({},{
      total_marks: 200
    });
    res.status(201).json({ message: "updated" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
module.exports = {
  AddFields,
  ViewUnitTestByClassSubjects,
  CreateUnitTest,
  UpdateUnitTest,
  UpdateSubjectUnitTest,
  ViewUnitTest,
  ViewAllUnitTest,
  DeleteUnitTest
}