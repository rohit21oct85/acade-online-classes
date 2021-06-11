const Unit = require("../../../models/admin/Unit");

const CreateUnit = async (req, res) => {
  const body = req.body;
  try {
    // const newUnit = new Unit(body);
    await Unit.insertMany(body);
    // await newUnit.save();
    return res.status(200).json({
      message: "Unit created sucessfully",
    });
  } catch (error) {
    res.status(502).json({
      message: error.message,
    });
  }
};
const UpdateUnit = async (req, res) => {
  try {
    await Unit.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => {
        return res.status(202).json({
          message: "Unit, Updated successfully",
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

const ViewUnit = async (req, res) => {
  try {
    const UnitData = await Unit.findOne({ _id: req.params.id }, { __v: 0 });
    return res.status(200).json({
      data: UnitData,
    });
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};
const ViewAllUnit = async (req, res) => {
  try {
    let filter = {};
    if (req.params?.subject_id && req.params?.class_id) {
      filter = {
        class_id: req.params?.class_id,
        subject_id: req.params?.subject_id,
      };
    }
    const AllUnits = await Unit.find(filter, { __v: 0 });
    res.status(200).json({
      data: AllUnits,
    });
  } catch (error) {
    res.status(409).json({
      message: "Error occured",
      errors: error.message,
    });
  }
};

const DeleteUnit = async (req, res) => {
  try {
    const unit_id = req.params.id;
    await Unit.deleteOne({ _id: unit_id });
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  CreateUnit,
  UpdateUnit,
  ViewUnit,
  ViewAllUnit,
  DeleteUnit
}