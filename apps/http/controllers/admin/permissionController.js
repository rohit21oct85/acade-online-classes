const Permission = require('../../../models/admin/Permission');


const CreatePermission = async (req, res) => {
    try {
        const moduleData = req?.body?.modules;
        // moduleData?.map(async module => {
        //     let check = await Permission.findOne({
        //         school_id: module?.school_id,
        //         role_id: module?.role_id,
        //         module_id: module?.module_id,
        //     });
        // });

        await Permission.insertMany(moduleData);
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
        const PermissionData = await Permission.findOne({_id: req.params.id},{__v: 0});
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
        if(req?.params?.school_slug){
            filter = {school_slug: req?.params?.school_slug}
        }else if(req?.params?.school_slug && req?.params?.role_slug){
            filter = {school_slug: req?.params?.school_slug, role_slug: req?.params?.role_slug}
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
        const filter = {school_slug: req?.params?.school_slug, role_slug: req?.params?.role_slug}
        // res.status(201).json(filter)
        const AllPermissions = await Permission.find(filter,{module_slug:1,_id:1, module_icon: 1},{__v: 0});
        return res.status(200).json({ 
            data: AllPermissions 
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