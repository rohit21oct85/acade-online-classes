
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
                  filter = {test_id: req?.params?.test_id}
            }
            const ATest = await AssignTest.findOne(filter)
            const AttemptTestResult = await AttemptTest.find({
                  test_id: req?.params?.test_id,
                  class_id: req?.params?.class_id
            },{__v:0});
            const Stud = await Student.find({school_id: req?.params?.school_id});
            // console.log(Stud); return;
            await AttemptTestResult.map(async (test) => {
                  test.test_duration = ATest.test_duration
                  test.test_window = ATest.test_window
                  test.start_date = ATest.start_date
                  test.emp_id = await filterStudent(Stud, test?.student_id, 'EmpId')
                  // test.class_no = await filterStudent(Stud, test?.student_id, 'class_no')
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
async function filterStudent(students, student_id, filed_name){
      let studata = students.filter(st => st._id == student_id);
      if(studata !== undefined || studata !== null){
            return studata && studata[0][filed_name];
      }
}
module.exports = {
      ViewStudentReport,
}