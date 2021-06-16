const AssignTest = require("../../../models/admin/AssignTest");

const CreateAssignTest = async (req, res) => {
  const body = req.body;
  try {
    await AssignTest.insertMany(body);
    return res.status(200).json({
      message: "AssignTest created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};

module.exports = {
  CreateAssignTest,
}