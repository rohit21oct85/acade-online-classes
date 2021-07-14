
const AttemptTest = require('../../../models/admin/AttemptTest');

const ViewStudentReport = async (req, res) => {
      
     const AttemptTest = await AttemptTest.find({test_id: req.params?.test_id});
}

module.exports = {
      ViewStudentReport,
}