const { now } = require("mongoose");
const MockTest = require("../../../models/admin/MockTest");
const MockTestQuestion = require("../../../models/admin/MockTestQuestion");



const AddMockTestQuestion = async (req, res) => {
  const body = req.body;
//   res.json(body);return;
  try {
    const MockQues = new MockTestQuestion(body);    
    await MockQues.save();
    return res.status(200).json({
      message: "MockTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};
const UpdateMockTestQuestion = async (req, res) => {
 
  try {
    await MockTestQuestion.findOneAndUpdate({_id: req.body.test_id},{$set: {
      question_for: req.body.question_for,
      question: req.body.question,
      option_a: req.body.option_a,
      option_b: req.body.option_b,
      answer: req.body.answer,
  }})
        .then(response => {
            return res.status(202).json({
                message: "Question, Updated successfully"
            })
        })
        .catch(error => {
            return res.status(500).json({
                message: "Error Found",
                errors: error.message
            })
        });

    return res.status(200).json({
      message: "MockTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};

const AllMockTestQuestion = async (req, res) => {
  try {
    const Question = await MockTestQuestion.find({question_for: req?.params?.question_for})
    return res.status(200).json({
      data: Question
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};

const SingleMockTestQuestion = async (req, res) => {
  try {
    const Question = await MockTestQuestion.findOne({_id: req.params?.test_id})
    return res.status(200).json({
      data: Question
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
    await MockTest.findOneAndUpdate({ _id: req.body.test_id }, {$set: {
      status: req.body.status
    }})
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
    let filter;
    let status = req?.params?.status;
    
    if(status){
      filter = {
        test_for: req?.params?.test_for,
        status: (status == 'active') ? true: false,
     }
    }else{
      filter = {
        test_for: req?.params?.test_for
      }
    }
    // res.json(filter); return;
    const AllMockTests = await MockTest.find(filter,{__v:0,test_question: 0 });

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
const DeleteMockTestQuestion = async (req, res) => {
  try {
    const mqid = req.body.test_id;
    await MockTestQuestion.deleteOne({ _id: mqid });
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  AddMockTestQuestion,
  AllMockTestQuestion,
  DeleteMockTestQuestion,
  SingleMockTestQuestion,
  UpdateMockTestQuestion,
  CreateMockTest,
  UpdateMockTest,
  ViewMockTest,
  ViewAllMockTest,
  DeleteMockTest
}