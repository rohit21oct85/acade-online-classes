const Teacher = require('../../../models/admin/Teacher');

const CreateTeacher = async (req, res) => {
    const body = req.body;
    try {
        const newTeacher = new Teacher(body);
        await newTeacher.save();
        return res.status(200).json({ 
            message: "Teacher created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateTeacher = async (req, res) =>{
    try {
        await Teacher.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Teacher, Updated successfully"
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

const ViewTeacher = async (req, res) => {
    try{
        const TeacherData = await Teacher.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: TeacherData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllTeacher = async (req, res) => {
    try{
        const AllTeachers = await Teacher.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllTeachers 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteTeacher = async (req, res) =>{
    const id = req.params.id;
    try {
        await Teacher.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Teacher, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateTeacher,
    UpdateTeacher,
    ViewTeacher,
    ViewAllTeacher,
    DeleteTeacher,
}