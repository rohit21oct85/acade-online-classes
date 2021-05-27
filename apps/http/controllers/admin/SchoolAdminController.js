const SchoolAdmin = require('../../../models/admin/SchoolAdmin');

const CreateSchoolAdmin = async (req, res) => {
    const body = req.body;
    try {
        const newSchoolAdmin = new SchoolAdmin(body);
        await newSchoolAdmin.save();
        return res.status(200).json({ 
            message: "SchoolAdmin created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateSchoolAdmin = async (req, res) =>{
    try {
        await SchoolAdmin.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "SchoolAdmin, Updated successfully"
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

const ViewSchoolAdmin = async (req, res) => {
    try{
        const SchoolAdminData = await SchoolAdmin.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: SchoolAdminData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllSchoolAdmin = async (req, res) => {
    try{
        const AllSchoolAdmin = await SchoolAdmin.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllSchoolAdmin 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteSchoolAdmin = async (req, res) =>{
    const id = req.body.schoolAdmin_id;
    try {
        await SchoolAdmin.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "SchoolAdmin, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateSchoolAdmin,
    UpdateSchoolAdmin,
    ViewSchoolAdmin,
    ViewAllSchoolAdmin,
    DeleteSchoolAdmin,
}