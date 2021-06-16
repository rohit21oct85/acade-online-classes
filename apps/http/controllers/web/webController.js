const ClassSubject = require('../../../models/admin/ClassSubject');
const UnitTest = require('../../../models/admin/UnitTest');
const Class = require('../../../models/admin/Class');
const TeacherSubject = require('../../../models/admin/TeacherSubject');
const Student = require('../../../models/admin/Student');
const Teacher = require('../../../models/admin/Teacher');
const Principal = require('../../../models/admin/Principal');

const getSubjects = async (req, res) => {
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
};


const getTestUnits = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.subject_id){
            filter = {subject_id: req?.params?.subject_id}
        }
        const AllUnitTestSubject = await UnitTest.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllUnitTestSubject 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
};


const getTestQuestions = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.test_id){
            filter = {test_id: req?.params?.test_id}
        }
        const AllUnitQuestions = await UnitTest.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllUnitQuestions 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
};

const getASingleQuestions = async (req, res) => {
    try{
        let filter = {}
        if(req?.params?.test_id){
            filter = {subject_id: req?.params?.test_id, }
        }
        // db.myCollection.find({"id":"1","data.id":"2"},{"id":1,"data.$":1})
        console.log(AllUnitQuestions)
        return res.status(200).json({ 
            data: AllUnitQuestions 
        });    
    } catch(error){
        res.status(203).json({
            status: 203,
            message: "Error occured",
            errors: error.message
        });
    }
};

const getAllClasses = async (req, res) => {
    try{
        const AllClasss = await Class.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllClasss 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const getTeacherSubject = async (req, res) => {
    try{
        const teacherSubject = await TeacherSubject.find({teacher_id:req.params.teacher_id,school_id:req.params.school_id},{__v: 0});
        return res.status(200).json({ 
            data: teacherSubject 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const getAllUnitTests = async (req, res) => {
    try{
        const UnitTests = await UnitTest.find({subject_id:req.params.subject_id,class_id:req.params.class_id},{__v: 0});
        // delete UnitTests.test_question;  // or delete person["age"];
        return res.status(200).json({ 
            data: UnitTests 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const getTeacher = async (req, res) => {
    try{
        const TeacherData = await Teacher.findOne({_id:req.params.id},{__v: 0});
        // delete UnitTests.test_question;  // or delete person["age"];
        return res.status(200).json({ 
            data: TeacherData 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const getStudent = async (req, res) => {
    try{
        const StudentData = await Student.findOne({_id:req.params.id},{__v: 0});
        // delete UnitTests.test_question;  // or delete person["age"];
        return res.status(200).json({ 
            data: StudentData 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const updateStudent = async (req, res) =>{
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

const updateTeacher = async (req, res) =>{
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

const getPrincipal = async (req, res) => {
    try{
        const PrincipalData = await Principal.findOne({_id:req.params.id},{__v: 0});
        // delete UnitTests.test_question;  // or delete person["age"];
        return res.status(200).json({ 
            data: PrincipalData 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const updatePrincipal = async (req, res) =>{
    try {
        await Principal.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Principal, Updated successfully"
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

module.exports = {
    getSubjects,
    getTestUnits,
    getTestQuestions,
    getASingleQuestions,
    getAllClasses,
    getTeacherSubject,
    getAllUnitTests,
    getTeacher,
    getStudent,
    updateStudent,
    updateTeacher,
    getPrincipal,
    updatePrincipal,
}