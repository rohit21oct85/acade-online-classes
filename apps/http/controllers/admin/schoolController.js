const School = require('../../../models/admin/School');

const CreateSchool = async (req, res) => {
    const body = req.body;
    res.send(req.body);
    try {

        const newSchool = new School(body);
        await newSchool.save();
        return res.status(200).json({ 
            message: "School created sucessfully"
        });
    } catch (error) {
        res.status(203).json({
            status: 203,
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
const checkSubDomain = async (req, res) => {
    try{
        const count = await School.count({sub_domain: req?.body?.sub_domain});
        
        if(count > 0){
            res.status(200).json({ 
                count: count,
                message: "subdomain already exists! try another"
            });    
        }else{
            res.status(200).json({ 
                count: count,
                message: "its a valid sub domain"
            });    
        }
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
        await School.findByIdAndDelete({_id: id}).then( response => {
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

const addFields = async (req, res) => {
    let field = req?.body?.field
    let fieldType = req?.body?.fieldType
    let defaultValue = req?.body?.defaultValue
    await Book.updateMany({},
    {
        field: {
            type: fieldType,
            default: defaultValue
        }
    });
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}

module.exports = {
    checkSubDomain,
    addFields,
    CreateSchool,
    UpdateSchool,
    ViewSchool,
    ViewAllSchool,
    DeleteSchool,
}