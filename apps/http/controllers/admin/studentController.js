const Student = require('../../../models/admin/Student');
const csv = require('csv-parser')
const fs = require('fs')

const CreateStudent = async (req, res) => {
    const body = req.body;
    try {
        const newStudent = new Student(body);
        await newStudent.save();
        return res.status(200).json({ 
            message: "Student created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateStudent = async (req, res) =>{
    try {
        await Student.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Student, Updated successfully"
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

const ViewStudent = async (req, res) => {
    try{
        const StudentData = await Student.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: StudentData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllStudent = async (req, res) => {
    try{
        const AllStudents = await Student.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllStudents 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteStudent = async (req, res) =>{
    const id = req.params.id;
    try {
        await Student.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Student, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

// const getStudentBySchoolId = async (req, res) => {
//     try{
//         const filter = {student_id: req.params.id}
//         const ClassData = await Class.find(filter,{__v: 0});
//         return res.status(200).json({ 
//             data: ClassData
//         });    
//     } catch(error){
//         res.status(409).json({
//             message: "Error occured",
//             errors: error.message
//         });
//     }
// }

const uploadStudent = async(req, res) => {
    const data = req.body;
    console.log(req.body, req.file, req.body.class_id)
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(book => {
                    FinalData.push({ 
                        first_name: book.first_name, 
                        last_name: book.last_name, 
                        guardian_name:book.guardian_name,
                        guardian_phone_no: book.guardian_phone,
                        school_id: req.body.school_id,
                        class_id:req.body.class_id
                    })
                })
                otherFunction(res, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "External Error occured",
            errors: error.message
        });
    }
}

const otherFunction = async(res, FinalData, callback) => {
    await Student.insertMany(FinalData).then(() => {
        res.status(200).send('Students Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

module.exports = {
    CreateStudent,
    UpdateStudent,
    ViewStudent,
    ViewAllStudent,
    DeleteStudent,
    uploadStudent,
    // getStudentBySchoolId,
}