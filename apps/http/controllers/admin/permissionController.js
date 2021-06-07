const Permission = require('../../../models/admin/Permission');
const RoleModule = require('../../../models/admin/RoleModule');


const CreatePermission = async (req, res) => {
    try {
        const methodData = req?.body?.method;
        const moduleData = req?.body?.module;
        await Permission.insertMany(methodData);
        await RoleModule.insertMany(moduleData);
        res.status(200).json({ 
            message: "Permission created sucessfully"
        });
    } catch (error) {
        console.log(error);
        res.status(502).json({
            message : error.message
        })
    }
}

const UpdatePermission = async (req, res) =>{
    try {
        const moduleData = req?.body?.modules;
        const school_id = req?.body?.school_id;
        const role_id = req?.body?.role_id;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        const permissionCount = await Permission.countDocuments({school_id: school_id,role_id: role_id});
        
        if(permissionCount > 0){
            await Permission.updateMany({school_id: school_id,role_id: role_id},{$set: moduleData},options);
            res.status(200).json({ 
                message: "Permission Updated sucessfully"
            });
        }else{
            await Permission.insertMany(moduleData);
            res.status(200).json({ 
                message: "Permission created sucessfully"
            });
        }

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const ViewPermission = async (req, res) => {
    try{
        const PermissionData = await Permission.findOne({
            module_slug: req.params.module_slug,
            role_slug: req.params.role_slug,
        },{__v: 0});
        return res.status(200).json({ 
            data: PermissionData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllPermission = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.role_slug){
            filter = {role_slug: req?.params?.role_slug, email: req.params?.user_email}
        }
        const AllPermissions = await Permission.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllPermissions 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeletePermission = async (req, res) =>{
    const id = req.body.Permission_id;
    try {
        await Permission.findByIdAndDelete({_id: id}).then( response => {
            return res.status(201).json({
                message: "Permission, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const OtherModules = async (req, res) => {
    try {
        const filter = {role_slug: req?.params?.role_slug}
        // res.status(201).json(filter)
        const AllModules = await RoleModule.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllModules 
        });        
    } catch (error) {
        res.status(203).json({
            status: 203,
            message: error.message
        });
    }
}
module.exports = {
    OtherModules,
    CreatePermission,
    UpdatePermission,
    ViewPermission,
    ViewAllPermission,
    DeletePermission
}