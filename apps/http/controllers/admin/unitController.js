const Unit = require("../../../models/admin/Unit");
const csv = require('csv-parser')
const fs = require('fs');
const Chapter = require("../../../models/admin/Chapter");

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
    const UnitData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await UnitData.map( data => {
                Unit.findOneAndUpdate({
                  _id: data?.unit_id,
                },{$set: {
                    user_id: req?.body?.user_id,  
                    class_id: data?.class_id,
                    class_name: data?.class_name,
                    subject_id: data?.subject_id,
                    subject_name: data?.subject_name,
                    unit_id: data?.unit_id,
                    unit_name: data?.unit_name,
                    marks: data?.marks,
                    
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
                message: "Chapter updated sucessfully"
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
    if(req.params?.class_id && req.params?.subject_id) {
      filter = {
        class_id: req.params?.class_id,
        subject_id: req.params?.subject_id,
      };
    }else if (req.params?.class_id) {
      filter = {
        class_id: req.params?.class_id
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
    await Unit.deleteOne({_id: req.body.unit_id});
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
const DeleteChaptersUnit = async (req, res) => {
  try {
    await Unit.findByIdAndDelete({_id: req.body.test_id});
    await Chapter.deleteMany({test_id: req.body.test_id});
    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}


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
                      user_id: req?.body?.user_id,  
                      class_id: req.body.class_id, 
                      class_name: req.body.class_name, 
                      subject_id: unit.subject_id, 
                      subject_name: unit.subject_name, 
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
      res.status(409).json({
          message: "Error occured while Inserting Data",
          errors: error.message
      });
  })
}
const UpdateUnitSubject = async (req, res) => {
  try {
    let subject_name = req.body.subject_name
    let new_subject_id = req.body.subject_id
    await Unit.updateMany({subject_name: subject_name}, {
      subject_id: new_subject_id,
    })
    res.status(200).send('Unit Updated')
  } catch (error) {
    res.status(409).json({
        message: "Error while updating Data",
        errors: error.message
    });
  }
}
const UpdateUnitClass = async (req, res) => {
  try {
    await Unit.updateMany({
      class_name: req.body.class_name
    },{
      class_id: req.body.class_id
    });
    
    res.status(200).send('Unit Updated')
  } catch (error) {
    res.status(409).json({
        message: "Error while updating Data",
        errors: error.message
    });
  }
}


module.exports = {
  UpdateUnitSubject,
  UpdateUnitClass,
  CreateUnit,
  UploadUnit,
  UpdateUnit,
  ViewUnit,
  ViewAllUnit,
  DeleteUnit,
  DeleteChaptersUnit
}