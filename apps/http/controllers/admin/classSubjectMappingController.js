const ClassSubject = require('../../../models/admin/ClassSubject');

const CreateClassSubjectMapping = async (req, res) => {
    try {
        const mappingData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await mappingData.map( data => {
            ClassSubject.findOneAndUpdate({
                class_id: data?.class_id,
                subject_id: data?.subject_id,
            },{$set: {
                class_id: data?.class_id,
                subject_id: data?.subject_id,
                class_name: data?.class_name,
                subject_name: data?.subject_name,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        });
        // await ClassSubject.insertMany(mappingData);
        res.status(200).json({ 
            message: "Mapping created sucessfully"
        });
    } catch (error) {
        console.log(error);
        res.status(502).json({
            message : error.message
        })
    }
}

const ViewAllClassSubjectMapping = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.class_id){
            filter = {class_id: req?.params?.class_id}
        }
        const AllClassSubject = await ClassSubject.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllClassSubject 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteClassSubjectMapping = async (req, res) =>{
    const id = req.body.class_subject_id;
    console.log(req.body)
    try {
        await ClassSubject.findByIdAndDelete({_id: id}).then( response => {
            return res.status(201).json({
                message: "Mapping, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

const UpdateSubjectId = async (req, res) => {
    try {
        let subject_name = req.body.subject_name
        let new_subject_id = req.body.subject_id
        await ClassSubject.updateMany({subject_name: subject_name}, {
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

module.exports = {
    UpdateSubjectId,
    CreateClassSubjectMapping,
    ViewAllClassSubjectMapping,
    DeleteClassSubjectMapping
}