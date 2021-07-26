
const AttemptTest = require('../../../models/admin/AttemptTest');
const AssignTest = require('../../../models/admin/AssignTest');
const Student = require('../../../models/admin/Student');

const ViewStudentReport = async (req, res) => {
      try {
            let test_type = req.params?.test_type
            let filter;
            if(test_type === 'upload-test'){
                  filter = {_id: req?.params?.test_id}
            }else{
                  filter = {test_id: req?.params?.test_id, school_id: req.params?.school_id}
            }
            const ATest = await AssignTest.findOne(filter)
            let AttemptTestResult;
            if(req.params?.class_id === 'all'){
                  AttemptTestResult = await AttemptTest.find({
                        school_id: req?.params?.school_id,
                        test_id: req?.params?.test_id
                  },{__v:0}).sort({
                        student_class_name: 1,
                  });
            }else{
                  AttemptTestResult = await AttemptTest.find({
                        school_id: req?.params?.school_id,
                        test_id: req?.params?.test_id,
                        class_id: req?.params?.class_id
                  },{__v:0});
            }
            
            await AttemptTestResult.map(async (test) => {
                  test.test_duration = ATest.test_duration
                  // test.test_window = ATest.test_window
                  // test.start_date = ATest.start_date
            })

            res.status(201).json({
                  data: AttemptTestResult
            })       
      } catch (error) {
            res.json({
                  errorCode: res.errorCode,
                  message: error.message
            })
      }    
}

module.exports = {
      ViewStudentReport,
}