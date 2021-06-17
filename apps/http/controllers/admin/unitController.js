const Unit = require("../../../models/admin/Unit");
const csv = require('csv-parser')
const fs = require('fs')

const CreateUnit = async (req, res) => {
  const body = req.body;
  try {
    await Unit.insertMany(body);
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
    const unit_id = req.body.id;
    await Unit.deleteOne({ _id: unit_id });
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
  const UploadUnit = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(unit => {
                    FinalData.push({ 
                        class_id: req.body.class_id, 
                        class_name: req.body.class_name, 
                        subject_id: req.body.subject_id, 
                        subject_name: req.body.subject_name, 
                        unit_no: unit.unit_no, 
                        unit_name: unit.unit_name, 
                        marks: unit.marks, 
                        
                    })
                })

                otherFunction(res, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "External Error occured",
            errors: error.message
        });
    }
  }

const otherFunction = async(res, FinalData, callback) => {
  await Unit.insertMany(FinalData).then(() => {
      res.status(200).send('Unit Inserted')
      callback()
  }).catch(error => {
      return res.status(409).json({
          message: "Error occured while Inserting Data",
          errors: error.message
      });
  })
}


module.exports = {
  CreateUnit,
  UploadUnit,
  UpdateUnit,
  ViewUnit,
  ViewAllUnit,
  DeleteUnit
}