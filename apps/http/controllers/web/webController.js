const ClassSubject = require('../../../models/admin/ClassSubject');
const UnitTest = require('../../../models/admin/UnitTest');
const AssignTest = require('../../../models/admin/AssignTest');
const Class = require('../../../models/admin/Class');
const TeacherSubject = require('../../../models/admin/TeacherSubject');
const Student = require('../../../models/admin/Student');
const Teacher = require('../../../models/admin/Teacher');
const Principal = require('../../../models/admin/Principal');
const AttemptTest = require('../../../models/admin/AttemptTest');
const Questions = require('../../../models/admin/Question');

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


const getAssignedTests = async (req, res) => {
    try{
        const AssignedTests = await AssignTest.find(
            {
                subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned: true,
            },{__v: 0});
            
        const newData = await UnitTest.find(
            {
                subject_id:req.params.subject_id,
                class_id:req.params.class_id,
            },{__v: 0});

        let newArray = [];
        AssignedTests.forEach(item=>{
            newData.forEach(it => {
                if(item.test_id == it._id){
                    newArray.push({
                        // test_question: it.test_question,
                        test_name:it.test_name,
                        test_duration:it.test_duration,
                        unit_id:it.unit_id,
                        unit_name:it.unit_name,
                        test_slug:it.test_slug,
                        test_date:it.test_date,
                        total_question:it.total_question,
                        _id:it._id,
                        class_id: item.class_id,
                        class_name: item.class_name,
                        school_id: item.school_id,
                        subject_id: item.subject_id,
                        subject_name: item.subject_name,
                        test_id: item.test_id,
                        assigned: item.assigned,
                    })
                }
            })
        }) 

        return res.status(200).json({ 
            data: newArray 
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

const getAllAssignedTestsClassBased = async (req, res) => {
    try{
        // const AssignTests = await AssignTest.aggregate([
        //     {
        //         "$project": {
        //             "_id": {
        //                 "$toString": "$_id"
        //             },
        //           "class_id": 1,
        //           "class_name": 1,
        //           "subject_id": 1,
        //           "subject_name": 1,
        //           "school_id": 1,
        //           "test_id": 1,
        //         }
        //     },
        //     {   $lookup:{
        //                 from: 'UnitTest',
        //                 localField: '_id',
        //                 foreignField: 'test_id',
        //                 as: 'unit_test'
        //         }   },
        //     {   $match:{
        //             class_id: req.params.class_id,
        //             subject_id:req.params.subject_id,
        //             school_id:req.params.school_id,
        //         }   },
        // ])
        // const AssignTests = await AssignTest.find({subject_id:req.params.subject_id,class_id:req.params.class_id,school_id:req.params.school_id},{__v: 0});
        const AssignedTests = await AssignTest.find(
            {
                subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned:false,
            },{__v: 0});
            
        const newData = await UnitTest.find(
            {
                subject_id:req.params.subject_id,
                class_id:req.params.class_id,
            },{__v: 0});

        let newArray = [];
        AssignedTests.forEach(item=>{
            newData.forEach(it => {
                if(item.test_id == it._id){
                    newArray.push({
                        // test_question: it.test_question,
                        test_name:it.test_name,
                        test_duration:it.test_duration,
                        unit_id:it.unit_id,
                        unit_name:it.unit_name,
                        test_slug:it.test_slug,
                        test_date:it.test_date,
                        total_question:it.total_question,
                        unit_table_id:it._id,
                        class_id: item.class_id,
                        class_name: item.class_name,
                        school_id: item.school_id,
                        subject_id: item.subject_id,
                        subject_name: item.subject_name,
                        test_id: item.test_id,
                        assigned: item.assigned,
                        assign_table_id: item._id,
                    })
                }
            })
        })
        return res.status(200).json({ 
            data: newArray 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const getAllAssignedTests = async (req, res) => {
    try{ 
        const AssignedTests = await AssignTest.find(
            {
                subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                assigned:false,
            },{__v: 0});
            
        const newData = await UnitTest.find(
            {
                subject_id:req.params.subject_id,
            },{__v: 0});

        let newArray = [];
        AssignedTests.forEach(item=>{
            newData.forEach(it => {
                if(item.test_id == it._id){
                    newArray.push({
                        // test_question: it.test_question,
                        test_name:it.test_name,
                        test_duration:it.test_duration,
                        unit_id:it.unit_id,
                        unit_name:it.unit_name,
                        test_slug:it.test_slug,
                        test_date:it.test_date,
                        total_question:it.total_question,
                        unit_table_id:it._id,
                        class_id: item.class_id,
                        class_name: item.class_name,
                        school_id: item.school_id,
                        subject_id: item.subject_id,
                        subject_name: item.subject_name,
                        test_id: item.test_id,
                        assigned: item.assigned,
                        assign_table_id: item._id,
                    })
                }
            })
        })
        return res.status(200).json({ 
            data: newArray 
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

const assignTestToStudent = async (req, res) =>{
    try {
        await AssignTest.findOneAndUpdate({_id: req.params.id}, {$set: {"assigned":true}})
                .then(resp => {
                    return res.status(202).json({
                        message: "Test Assigned to Student Successfully"
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

const attemptTestByStudent = async (req, res) =>{
    try {
        const body = {
            school_id :req.body.school_id,
            subject_id:req.body.subject_id,
            student_id:req.body.user_id,
            test_id: req.body.id,
            student_name: req.body.name,
        }

        // const hasAttempted = await AttemptTest.findOne(
        //     {
        //         school_id :req.body.school_id,
        //         subject_id:req.body.subject_id,
        //         student_id:req.body.user_id,
        //         test_id: req.body.id,
        //     },{__v: 0});

        // if(hasAttempted){
        //     return res.status(200).json({
        //         message: "already attempted",
        //     });
        // }

        const newData = await UnitTest.findOne(
            {
                _id:req.body.id,
            },{__v: 0});

        const attempt = new AttemptTest({
            school_id :req.body.school_id,
            class_id: req.body.class_id,
            subject_id:req.body.subject_id,
            student_id:req.body.user_id,
            test_id: req.body.id,
            student_name: req.body.name,
            questions: newData.test_question
        });    

        await attempt.save();
        return res.status(200).json({
            message: "AttemptTest created sucessfully",
        });

    } catch (error) {
        res.status(502).json({
            message: error.message,
        });
    }
}

const getQuestions = async (req,res) => {
    const filter = {
        school_id :req.body.school_id,
        subject_id:req.params.subject_id,
        student_id:req.body.student_id,
        test_id: req.params.test_id,
    }
    // return res.send(filter);
    const data = await AttemptTest.findOne(filter)
    var filteredArray = data?.questions.filter(function(item){
        return !("answer" in item);
    });
    const question = filteredArray[Math.floor(Math.random() * filteredArray.length)];
    const singleQuestion = await Questions.findOne({_id: question?.question_id})
    return res.send(singleQuestion);
}

const saveAnswer = async (req,res) => {
    const filter = {
        school_id :req.body.school_id,
        subject_id:req.params.subject_id,
        student_id:req.body.student_id,
        test_id: req.params.test_id,
    }
    const data = await AttemptTest.findOne(filter)
    data.questions.map((item, key)=>{
        if(item.question_id == req.body.question_id)
        {
            item['answer'] = req.body.answer,
            item['option'] = req.body.option
        }  
    })
    const assigntests = await AttemptTest.findOneAndUpdate(filter, {$set: {"questions": data.questions}})
    if(assigntests){
        return res.status(200).json({ 
            msg: "answer submitted successfully" 
        }); 
    }
}

const getAllQuestions = async (req,res) => {
    const filter = {
        school_id :req.body.school_id,
        subject_id:req.params.subject_id,
        student_id:req.body.student_id,
        test_id: req.params.test_id,
    }
    const data = await AttemptTest.findOne(filter)
    const questions =  data.questions;
    return res.status(200).json({ 
        data: questions, 
    }); 
}

module.exports = {
    getSubjects,
    getAssignedTests,
    getTestQuestions,
    getASingleQuestions,
    getAllClasses,
    getTeacherSubject,
    getAllAssignedTests,
    getAllAssignedTestsClassBased,
    getTeacher,
    getStudent,
    updateStudent,
    updateTeacher,
    getPrincipal,
    updatePrincipal,
    assignTestToStudent,
    attemptTestByStudent,
    getQuestions,
    saveAnswer,
    getAllQuestions,
}