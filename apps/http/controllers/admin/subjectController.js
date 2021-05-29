const Subject = require('../../../models/admin/Subject');

const CreateSubject = async (req, res) => {
    const body = req.body;
    try {
        const newSubject = new Subject(body);
        await newSubject.save();
        return res.status(200).json({ 
            message: "Subject created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateSubject = async (req, res) =>{
    try {
        await Subject.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Subject, Updated successfully"
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        message: "Error Found",
                        errors: error.message
                    })
                });

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}

const ViewSubject = async (req, res) => {
    try{
        const SubjectData = await Subject.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: SubjectData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllSubject = async (req, res) => {
    try{
        const AllSubjects = await Subject.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllSubjects 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteSubject = async (req, res) =>{
    const id = req.params.id;
    try {
        await Subject.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Subject, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateSubject,
    UpdateSubject,
    ViewSubject,
    ViewAllSubject,
    DeleteSubject,
}