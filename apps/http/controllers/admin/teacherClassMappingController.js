const TeacherClass = require('../../../models/admin/TeacherClass');

const CreateTeacherClassMapping = async (req, res) => {
    try {
        const mappingData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await mappingData.map( data => {
            TeacherClass.findOneAndUpdate({
                school_id: data?.school_id,
                class_id: data?.class_id,
                teacher_id: data?.teacher_id,
            },{$set: {
                school_id: data?.school_id,
                class_id: data?.class_id,
                teacher_id: data?.teacher_id,
                school_name: data?.school_name,
                class_name: data?.class_name,
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
        // await TeacherClass.insertMany(mappingData);
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


const ViewTeacherClassMapping = async (req, res) => {
    try{
        const TeacherClassData = await TeacherClass.findOne({
            school_id: req.params.school_id,
            teacher_id: req.params.teacher_id,
        },{class_id:1, class_name: 1},{__v: 0});
        return res.status(200).json({ 
            data: TeacherClassData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllTeacherClassMapping = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.school_id){
            filter = {school_id: req?.params?.school_id, teacher_id: req.params?.teacher_id}
        }
        const AllTeacherClass = await TeacherClass.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllTeacherClass 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteTeacherClassMapping = async (req, res) =>{
    const id = req.body.teacher_sub_id;
    console.log(req.body)
    try {
        await TeacherClass.findByIdAndDelete({_id: id}).then( response => {
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
const DeleteAllTeacherClassMapping = async (req, res) =>{
    const school_id = req.body.school_id;
    try {
        await TeacherClass.deleteMany({school_id: school_id}).then( response => {
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



module.exports = {
    CreateTeacherClassMapping,
    ViewTeacherClassMapping,
    ViewAllTeacherClassMapping,
    DeleteTeacherClassMapping,
    DeleteAllTeacherClassMapping
}