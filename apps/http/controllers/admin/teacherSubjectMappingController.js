const TeacherSubject = require('../../../models/admin/TeacherSubject');

const CreateTeacherSubjectMapping = async (req, res) => {
    try {
        const mappingData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await mappingData.map( data => {
            TeacherSubject.findOneAndUpdate({
                 school_id: data?.school_id,
                subject_id: data?.subject_id,
                teacher_id: data?.teacher_id,
            },{$set: {
                school_id: data?.school_id,
                subject_id: data?.subject_id,
                teacher_id: data?.teacher_id,
                school_name: data?.school_name,
                subject_name: data?.subject_name,
                teacher_name: data?.teacher_name,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        });
        // await TeacherSubject.insertMany(mappingData);
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

// const UpdateTeacherSubjectMapping = async (req, res) =>{
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

// const ViewTeacherSubjectMapping = async (req, res) => {
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
const ViewAllTeacherSubjectMapping = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.school_id){
            filter = {school_id: req?.params?.school_id, teacher_id: req.params?.teacher_id}
        }
        const AllTeacherSubject = await TeacherSubject.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllTeacherSubject 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteTeacherSubjectMapping = async (req, res) =>{
    const id = req.body.teacher_sub_id;
    console.log(req.body)
    try {
        await TeacherSubject.findByIdAndDelete({_id: id}).then( response => {
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
    CreateTeacherSubjectMapping,
    // UpdateTeacherSubjectMapping,
    // ViewTeacherSubjectMapping,
    ViewAllTeacherSubjectMapping,
    DeleteTeacherSubjectMapping
}