const Module = require('../../../models/admin/Module');

const CreateModule = async (req, res) => {
    const body = req.body;
    try {
        const newModule = new Module(body);
        await newModule.save();
        return res.status(200).json({ 
            message: "Module created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateModule = async (req, res) =>{
    try {
        await Module.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Module, Updated successfully"
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
const ViewModule = async (req, res) => {
    try{
        const ModuleData = await Module.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: ModuleData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllModule = async (req, res) => {
    try{
        const AllModules = await Module.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllModules 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteModule = async (req, res) =>{
    const id = req.params.id;
    try {
        await Module.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Module, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateModule,
    UpdateModule,
    ViewModule,
    ViewAllModule,
    DeleteModule,
}