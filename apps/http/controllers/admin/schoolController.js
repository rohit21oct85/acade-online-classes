const School = require('../../../models/admin/School');

const CreateSchool = async (req, res) => {
    const body = req.body;
    try {
        const newSchool = new School(body);
        await newSchool.save();
        return res.status(200).json({ 
            message: "School created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateSchool = async (req, res) =>{
    try {
        await School.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "School, Updated successfully"
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

const ViewSchool = async (req, res) => {
    try{
        const SchoolData = await School.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: SchoolData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllSchool = async (req, res) => {
    try{
        const AllSchool = await School.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllSchool 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteSchool = async (req, res) =>{
    const id = req.body.school_id;
    try {
        await School.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "School, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateSchool,
    UpdateSchool,
    ViewSchool,
    ViewAllSchool,
    DeleteSchool,
}