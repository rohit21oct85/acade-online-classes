const { now } = require("mongoose");
const MockTest = require("../../../models/admin/MockTest");
const MockTestQuestion = require("../../../models/admin/MockTestQuestion");



const AddMockTestQuestion = async (req, res) => {
  const body = req.body;
  res.json(body);return;
  try {
    const MockTestQuestion = new MockTestQuestion(body);    
    await MockTestQuestion.save();
    return res.status(200).json({
      message: "MockTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};

const CreateMockTest = async (req, res) => {
  const body = req.body;
  try {
    const Test = new MockTest(body);    
    await Test.save();
    return res.status(200).json({
      message: "MockTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};
const UpdateMockTest = async (req, res) => {
  try {
    await MockTest.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => {
        return res.status(202).json({
          message: "MockTest, Updated successfully",
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

const ViewMockTest = async (req, res) => {
  try {
    const MockTestData = await MockTest.findOne({ _id: req.params.id }, { __v: 0 });
    return res.status(200).json({
      data: MockTestData,
    });
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};
const ViewAllMockTest = async (req, res) => {
  try {
    let filter = {};
    if (req.params?.class_id) {
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
    }
    const AllMockTests = await MockTest.find(filter,{
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
          test_type: 1,
      },{__v:0,test_question: 0 });

    res.status(200).json({
      data: AllMockTests,
    });
    
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};


const DeleteMockTest = async (req, res) => {
  try {
    const MockTest_id = req.body.id;
    await MockTest.deleteOne({ _id: MockTest_id });
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  AddMockTestQuestion,
  CreateMockTest,
  UpdateMockTest,
  ViewMockTest,
  ViewAllMockTest,
  DeleteMockTest
}