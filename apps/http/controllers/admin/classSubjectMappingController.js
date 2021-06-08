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

// const UpdateClassSubjectMapping = async (req, res) =>{
//     try {
//         const moduleData = req?.body?.modules;
//         const school_id = req?.body?.school_id;
//         const role_id = req?.body?.role_id;
//         var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
//         const permissionCount = await Permission.countDocuments({school_id: school_id,role_id: role_id});
        
//         if(permissionCount > 0){
//             await Permission.updateMany({school_id: school_id,role_id: role_id},{$set: moduleData},options);
//             res.status(200).json({ 
//                 message: "Permission Updated sucessfully"
//             });
//         }else{
//             await Permission.insertMany(moduleData);
//             res.status(200).json({ 
//                 message: "Permission created sucessfully"
//             });
//         }

//     } catch (error) {
//         res.status(409).json({
//             message: error.message
//         });
//     }
// }

// const ViewClassSubjectMapping = async (req, res) => {
//     try{
//         const PermissionData = await Permission.findOne({
//             module_slug: req.params.module_slug,
//             role_slug: req.params.role_slug,
//         },{__v: 0});
//         return res.status(200).json({ 
//             data: PermissionData
//         });    
//     } catch(error){
//         res.status(409).json({
//             message: "Error occured",
//             errors: error.message
//         });
//     }
// }
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

// const OtherModules = async (req, res) => {
//     try {
//         const filter = {role_slug: req?.params?.role_slug}
//         // res.status(201).json(filter)
//         const AllModules = await RoleModule.find(filter,{__v: 0});
//         return res.status(200).json({ 
//             data: AllModules 
//         });        
//     } catch (error) {
//         res.status(203).json({
//             status: 203,
//             message: error.message
//         });
//     }
// }

module.exports = {
    // OtherModules,
    CreateClassSubjectMapping,
    // UpdateClassSubjectMapping,
    // ViewClassSubjectMapping,
    ViewAllClassSubjectMapping,
    DeleteClassSubjectMapping
}