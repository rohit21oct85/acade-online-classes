const Role = require('../../../models/admin/Role');


const CreateRole = async (req, res) => {
    const body = req.body;
    try {
        const newRole = new Role(body);
        await newRole.save();
        return res.status(200).json({ 
            message: "Role created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const UpdateRole = async (req, res) =>{
    try {
        await Role.findOneAndUpdate({_id: req.params.id},{$set: req.body})
                .then(response => {
                    return res.status(202).json({
                        message: "role, Updated successfully"
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
const ViewRole = async (req, res) => {
    try{
        const RoleData = await Role.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: RoleData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllRole = async (req, res) => {
    try{
        const AllRoles = await Role.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllRoles.length,
            data: AllRoles 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteRole = async (req, res) =>{
    const id = req.body.role_id;
    try {
        await Role.findByIdAndDelete({_id: id}).then( response => {
            return res.status(201).json({
                message: "role, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateRole,
    UpdateRole,
    ViewRole,
    ViewAllRole,
    DeleteRole
}