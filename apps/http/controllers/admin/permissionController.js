const Permission = require('../../../models/admin/Permission');
const RoleModule = require('../../../models/admin/RoleModule');


const CreatePermission = async (req, res) => {
    try {
        const methodData = req?.body?.method;
        const moduleData = req?.body?.module;
        
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await methodData.map( data => {
            Permission.findOneAndUpdate({
                role_id: data?.role_id,
                module_slug: data?.module_slug,
                method_name: data?.method_name,
                email: data?.email
            },{$set: {
                role_id: data?.role_id,
                role_slug: data?.role_slug,
                role: data?.role,
                email: data?.email,
                module_id: data?.module_id,
                module_name: data?.module_name,
                module_slug: data?.module_slug,
                module_icon: data?.module_icon,
                method_name: data?.method_name,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        });

        await moduleData.map( data => {
            RoleModule.findOneAndUpdate({
                role_id: data?.role_id,
                module_slug: data?.module_slug,
                email: data?.email
            },{$set: {
                role_id: data?.role_id,
                role_slug: data?.role_slug,
                role: data?.role,
                email: data?.email,
                module_id: data?.module_id,
                module_name: data?.module_name,
                module_slug: data?.module_slug,
                module_icon: data?.module_icon,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        })


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

const ViewPermission = async (req, res) => {
    try{
        const PermissionData = await Permission.find({
            module_slug: req.params.module_slug,
            role_slug: req.params.role_slug,
            email: req.params.admin_email,
        },{method_name: 1, _id: 0},{__v: 0});
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
    const id = req.body.permission_id;
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
const DeleteAllPermission = async (req, res) =>{

    const module_id = req.body.module_id;
    const email = req.body.email;
    const module_slug = req.body.module_slug;
    try {
        await RoleModule.findByIdAndDelete({_id: module_id});
        await Permission.deleteMany({email: email, module_slug: module_slug});
        res.status(201).json({
            message: "Permission, deleted successfully"
        })
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

const OtherModules = async (req, res) => {
    try {
        const filter = {role_slug: req?.params?.role_slug, email: req.params?.admin_email}
        // res.send(filter);
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
    ViewPermission,
    ViewAllPermission,
    DeletePermission,
    DeleteAllPermission
}