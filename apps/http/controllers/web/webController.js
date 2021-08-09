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
const Subject = require('../../../models/admin/Subject');
const School = require('../../../models/admin/School');
const Unit = require('../../../models/admin/Unit');
const Chapter = require('../../../models/admin/Chapter');
const TeacherAssignmentTest = require('../../../models/admin/TeacherAssignmentTest');
const MockTestQuestions = require('../../../models/admin/MockTestQuestion');

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
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
};


const getAssignedTestsStudent = async (req, res) => {
    try{
        // let newArray = [];
        let newArray1 = [];
        let test_type = "";
        const AssignedTests = await AssignTest.findOne(
            {
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned: true,
                attemptedStudentIds:{
                    $nin:[req.body.student_id]
                },
                $or : [
                    {
                        test_type:"single-test"
                    },
                    {
                        test_type:"combine-test"
                    }
                ]
                // $and: [
                //         {
                //             "start_date": { 
                //                 $gte: new Date().toISOString()
                //             }
                //         }
                //     ]
            },{__v: 0}).limit(1).sort({start_date:-1});
            test_type= AssignedTests?.test_type
        // const attemptedTest = await AttemptTest.find(
        //     {
        //         // subject_id:req.params.subject_id,
        //         school_id:req.params.school_id,
        //         class_id:req.params.class_id,
        //         student_id:req.body.student_id,
        //         $or : [
        //             {
        //                 test_type:"single-test"
        //             },
        //             {
        //                 test_type:"combine-test"
        //             }
        //         ]
        //     },{__v: 0});
        // if(attemptedTest.length != AssignedTests.length){
        //     if(attemptedTest.length > 0){
        //         AssignedTests.forEach(item=>{
        //             attemptedTest.forEach(it => {
        //                 test_type = item.test_type
        //                 if(item.test_id != it.test_id && it.student_id == req.body.student_id){
        //                     newArray.push({
        //                         subject_id:item.subject_id,
        //                         class_id:item.class_id,
        //                         school_id:item.school_id,
        //                         test_id:item.test_id,
        //                         assigned:item.assigned,
        //                         class_name:item.class_name,
        //                         status:item.status,
        //                         subject_name:item.subject_name,
        //                         start_date:item.start_date,
        //                         test_window:item.test_window,
        //                         test_type:item.test_type,
        //                     })
        //                 }
        //             })
        //         })
        //     }
            
        //     let newData = [];
        //     if(newArray && newArray.length > 0){
        //         newData = newArray;
        //     }else{
        //         newData = AssignedTests;
        //     }

            let check = {}
            if(test_type == "single-test"){
                check = { class_id : req.params.class_id, _id: AssignedTests.test_id }
            }else if (test_type == "combine-test"){
                check = { assign_class_id : req.params.class_id, _id: AssignedTests.test_id }
            }

            newArray1 = await UnitTest.findOne(check,{__v: 0}).lean();
            // const newData = [...newArray1, ...AssignedTests]
            newArray1.unit_id = newArray1._id;
            newArray1.unit_table_id = newArray1._id;
            newArray1.test_id = AssignedTests.test_id;
            newArray1.assigned = AssignedTests.assigned;
            newArray1.assign_table_id = AssignedTests._id;
            newArray1.start_date = AssignedTests.start_date;
            newArray1.test_window = AssignedTests.test_window;
            if(test_type == "combine-test"){
                newArray1.class_id = newArray1.assign_class_id;
                newArray1.class_name = newArray1.assign_class_name;
            }
            // AssignedTests.forEach(item=>{
            //     units.forEach(it => {
            //         if(item.test_id == it._id){
            //             newArray1.push({
            //                 test_name:it.test_name,
            //                 test_duration:it.test_duration,
            //                 unit_id:it.unit_id,
            //                 unit_name:it.unit_name,
            //                 test_slug:it.test_slug,
            //                 total_question:it.total_question,
            //                 unit_table_id:it._id,
            //                 class_id: item.class_id,
            //                 class_name: item.class_name,
            //                 school_id: item.school_id,
            //                 subject_id: item.subject_id,
            //                 subject_name: item.subject_name,
            //                 test_id: item.test_id,
            //                 assigned: item.assigned,
            //                 assign_table_id: item._id,
            //                 start_date:item.start_date,
            //                 test_window:item.test_window,
            //                 test_type:item.test_type,
            //             })
            //         }
            //     })
            // }) 
        // }
        return res.status(200).json({ 
            data: newArray1 
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
        const teacher = await Teacher.findOne({_id:req.body.user_id}).lean()
        const classes = teacher.classess.filter(it => it.checked == true);
        // const AllClasss = await Class.find({},{__v: 0});
        return res.status(200).json({ 
            data: classes 
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
        const AssignedTests = await AssignTest.findOne(
            {
                // subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned:false,
                test_type: {$not : {$eq : "mock-test"}},
                "test_subjects.subject_id": {
                    $eq : req.params.subject_id
                },
                // $and: [
                //     {
                //         "start_date": { 
                //             $gte: new Date().toISOString()
                //         }
                //     }
                // ]
            },{__v: 0}).limit(1).sort({start_date:-1});
            let filter = {}
            let newArray = [];
            if(AssignedTests != null){
                if(AssignedTests.test_type == "single-test"){
                    filter = {
                        _id:  AssignedTests.test_id,
                        // class_id:req.params.class_id,
                        // "test_subjects.subject_id": {
                        //     $eq : req.params.subject_id
                        // },
                    }
                }else{
                    filter = {
                        _id:  AssignedTests.test_id,
                        // assign_class_id:req.params.class_id,
                        // "test_subjects.subject_id": {
                        //     $eq : req.params.subject_id
                        // },
                    }
                }
                newArray  = await UnitTest.find(filter,{__v: 0}).lean();
                if(newArray.length > 0){
                    newArray[0].test_name=newArray[0].test_name;
                    newArray[0].test_duration_unit=newArray[0].test_duration;
                    newArray[0].unit_id=newArray[0].unit_id;
                    newArray[0].unit_name=newArray[0].unit_name;
                    newArray[0].test_slug=newArray[0].test_slug;
                    newArray[0].total_question=newArray[0].total_question;
                    newArray[0].unit_table_id=newArray[0]._id;
                    newArray[0].class_id= AssignedTests.class_id;
                    newArray[0].class_name= AssignedTests.class_name;
                    newArray[0].school_id= AssignedTests.school_id;
                    newArray[0].test_id= AssignedTests.test_id;
                    newArray[0].assigned= AssignedTests.assigned;
                    newArray[0].assign_table_id= AssignedTests._id;
                    newArray[0].test_window= AssignedTests.test_window;
                    newArray[0].start_date= AssignedTests.start_date;
                    newArray[0].test_subjects= AssignedTests.test_subjects;
                    newArray[0].test_duration=AssignedTests.test_duration;
                    newArray[0].total_marks=AssignedTests.total_marks;
                }
            }
        
        // const newData = await UnitTest.find(
        //     {
        //         // subject_id:req.params.subject_id,
        //         class_id:req.params.class_id,
        //         "test_subjects.subject_id": {
        //             $eq : req.params.subject_id
        //         },
        //     },{__v: 0});
        //     let newArray = [];
        // AssignedTests.forEach(item=>{
        //     newData.forEach(it => {
        //         if(item.test_id == it._id){
        //             newArray.push({
        //                 // test_question: it.test_question,
        //                 test_name:it.test_name,
        //                 test_duration_unit:it.test_duration,
        //                 unit_id:it.unit_id,
        //                 unit_name:it.unit_name,
        //                 test_slug:it.test_slug,
        //                 total_question:it.total_question,
        //                 unit_table_id:it._id,
        //                 class_id: item.class_id,
        //                 class_name: item.class_name,
        //                 school_id: item.school_id,
        //                 test_id: item.test_id,
        //                 assigned: item.assigned,
        //                 assign_table_id: item._id,
        //                 test_window: item.test_window,
        //                 start_date: item.start_date,
        //                 test_subjects: item.test_subjects,
        //                 test_duration:item.test_duration,

        //             })
        //         }
        //     })
        // })
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
                "test_subjects.subject_id": {
                    $eq : req.params.subject_id
                },
                school_id:req.params.school_id,
                assigned:false,
                test_type: "single-test",
                $and: [
                    {
                        "start_date": { 
                            $gte: new Date().toISOString()
                        }
                    }
                ]
            },{__v: 0});
        
        const newData = await UnitTest.find(
            {
                "test_subjects.subject_id": {
                    $eq : req.params.subject_id
                },
            },{__v: 0});
        let newArray = [];
        AssignedTests.forEach(item=>{
            newData.forEach(it => {
                if(item.test_id == it._id){
                    newArray.push({
                        // test_question: it.test_question,
                        test_name:it.test_name,
                        test_duration_unit:it.test_duration,
                        unit_id:it.unit_id,
                        unit_name:it.unit_name,
                        test_slug:it.test_slug,
                        total_question:it.total_question,
                        unit_table_id:it._id,
                        class_id: item.class_id,
                        class_name: item.class_name,
                        school_id: item.school_id,
                        test_id: item.test_id,
                        assigned: item.assigned,
                        assign_table_id: item._id,
                        test_window: item.test_window,
                        start_date: item.start_date,
                        test_subjects:item.test_subjects,
                        test_duration:item.test_duration,
                        total_marks:item.total_marks,
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
        const as = await AssignTest.findOne({_id: req.params.id})
        const testWindow = req.body.testWindow != null ? req.body?.testWindow : as.test_window
        
        const assignTest = await AssignTest.findOne({class_id: req.params.class_id, school_id:req.body.school_id, assigned: true},{start_date:1,test_window:1}).limit(1).sort({$natural:-1})
        let timeAlTest = new Date(assignTest?.start_date)
        timeAlTest.setMinutes( timeAlTest.getMinutes() + assignTest?.test_window );
        
        let timeNwTest = new Date(req.body.startDate)
        // timeNwTest.setMinutes( timeNwTest.getMinutes() + testWindow );
        if(!(timeAlTest instanceof Date && !isNaN(timeAlTest.valueOf()))){ //check for valid date
            await AssignTest.findOneAndUpdate({_id: req.params.id}, {$set: {"assigned":true, "start_date": req.body.startDate,test_window :testWindow ,test_duration:req.body.testduration,teacher_id:req.body.teacher_id}})
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
        }else if(timeNwTest > timeAlTest){
            await AssignTest.findOneAndUpdate({_id: req.params.id}, {$set: {"assigned":true, "start_date": req.body.startDate,test_window :testWindow ,test_duration:req.body.testduration,teacher_id:req.body.teacher_id}})
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
        }else{
            res.status(405).json({
                message: "Test Cant be assigned, a test is already assigned for this time"
            })
        }
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}

const attemptTestByStudent = async (req, res) =>{
    try {
        let result = [];
        if(req.body.test_type == "upload-test"){
            const assignTest = await AssignTest.findOne({_id:req.body.assign_test_id},{__v: 0})
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: assignTest._id,
                student_name: req.body.name,
                questions: assignTest.questionDocs,
                test_subjects: assignTest.test_subjects,
                test_name: assignTest.test_name,
                test_type: assignTest.test_type,
                section: req.body.section,
                extension: assignTest.extension,
                questionLength: parseInt(assignTest.answers.length),
                start_date: assignTest.start_date,
                test_window: assignTest.test_window,
                test_duration: assignTest.test_duration,
                total_marks: assignTest.total_marks,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });   
            result = await attempt.save();
            await AssignTest.findOneAndUpdate({test_id:req.body.id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }else if(req.body.test_type == "mock-test"){
            const mockQuestions = await MockTestQuestions.find({question_for:"student"},{answer:0});
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const newData1 = await AssignTest.findOne(
                {
                    test_id: req.body.id,
                    school_id: req.body.school_id,
                },{__v: 0});

            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: req.body.id,
                student_name: req.body.name,
                questions: mockQuestions,
                test_subjects:newData1.test_subjects,
                test_name:newData1.test_name,
                test_type:newData1.test_type,
                start_date: newData1.start_date,
                test_window: newData1.test_window,
                test_duration: newData1.test_duration,
                total_marks: newData1.total_marks,
                section:req.body.section,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });   
            await attempt.save();
            await AssignTest.findOneAndUpdate({_id:req.body.mock_id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }else{
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const newData = await UnitTest.findOne(
                {
                    _id: req.body.id,
                },{__v: 0});
            const newData1 = await AssignTest.findOne(
                {
                    test_id: req.body.id,
                },{__v: 0});
    
            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: req.body.id,
                student_name: req.body.name,
                questions: newData.test_question,
                test_subjects:newData1.test_subjects,
                start_date: newData1.start_date,
                test_window: newData1.test_window,
                test_duration: newData1.test_duration,
                test_name:newData1.test_name,
                total_marks:newData1.total_marks,
                section:req.body.section,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });    
            await attempt.save();
            await AssignTest.findOneAndUpdate({test_id:req.body.id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }
        
        return res.status(200).json({
            message: "AttemptTest created sucessfully",
            data: result
        });
    } catch (error) {
        res.status(502).json({
            message: error.message,
        });
    }
}

const attemptTestByStudentOffline = async (req, res) =>{
    try {
        let result = [];
        if(req.body.test_type == "upload-test"){
            const assignTest = await AssignTest.findOne({_id:req.body.assign_test_id},{__v: 0}).lean()
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: assignTest._id,
                student_name: req.body.name,
                questions: assignTest.questionDocs,
                test_subjects: assignTest.test_subjects,
                test_name: assignTest.test_name,
                test_type: assignTest.test_type,
                section: req.body.section,
                extension: assignTest.extension,
                questionLength: parseInt(assignTest.answers.length),
                start_date: assignTest.start_date,
                test_window: assignTest.test_window,
                test_duration: assignTest.test_duration,
                total_marks: assignTest.total_marks,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });   
            result = await attempt.save();
            await AssignTest.findOneAndUpdate({_id:req.body.assign_test_id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }else if(req.body.test_type == "mock-test"){
            const mockQuestions = await MockTestQuestions.find({question_for:"student"},{answer:0});
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const newData1 = await AssignTest.findOne(
                {
                    test_id: req.body.id,
                    school_id: req.body.school_id,
                },{__v: 0}).lean();

            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: req.body.id,
                student_name: req.body.name,
                questions: mockQuestions,
                test_subjects:newData1.test_subjects,
                test_name:newData1.test_name,
                test_type:newData1.test_type,
                start_date: newData1.start_date,
                test_window: newData1.test_window,
                test_duration: newData1.test_duration,
                total_marks: newData1.total_marks,
                section:req.body.section,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });   
            result = await attempt.save();
            await AssignTest.findOneAndUpdate({_id:req.body.mock_id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }else{
            const student = await Student.findOne({_id:req.body.user_id},{roll_no:1,class:1,EmpId:1})
            const newData = await UnitTest.findOne(
                {
                    _id: req.body.id,
                },{__v: 0});

            await Promise.all(newData.test_question.map(async (item, key)=>{
                singleQuestion = await Questions.findOne({_id: item.question_id},{answer:0,solution:0})
                if(singleQuestion.extension == "docx"){
                    item.question = singleQuestion.question;
                    item._id = item.question_id;
                    item.option_a = singleQuestion.options[0];
                    item.option_b = singleQuestion.options[1];
                    item.option_c = singleQuestion.options[2];
                    item.option_d = singleQuestion.options[3];
                }else{
                    item.question = singleQuestion.question;
                    item.option_a = singleQuestion.option_a;
                    item.option_b = singleQuestion.option_b;
                    item.option_c = singleQuestion.option_c;
                    item.option_d = singleQuestion.option_d;
                    item._id = item.question_id;
                }
            }))
            const newData1 = await AssignTest.findOne(
                {
                    test_id: req.body.id,
                },{__v: 0}).lean();
            const attempt = new AttemptTest({
                school_id: req.body.school_id,
                class_id: req.body.class_id,
                // subject_id: req.body.subject_id,
                student_id: req.body.user_id,
                test_id: req.body.id,
                student_name: req.body.name,
                questions: newData.test_question,
                test_subjects:newData1.test_subjects,
                start_date: newData1.start_date,
                test_window: newData1.test_window,
                test_duration: newData1.test_duration,
                test_name: newData1.test_name,
                total_marks: newData1.total_marks,
                section:req.body.section,
                student_roll_no: student.roll_no,
                student_emp_id: student.EmpId,
                student_class_name: student.class
            });    
            result = await attempt.save();
            await AssignTest.findOneAndUpdate({test_id:req.body.id}, {
                $addToSet: {
                    attemptedStudentIds: req.body.user_id
                }
            })
        }
        return res.status(200).json({
            message: "AttemptTest created sucessfully",
            data: result
        });
    } catch (error) {
        res.status(502).json({
            message: error.message,
        });
    }
}

const getQuestions = async (req,res) => {
    try{
        let singleQuestion = [];
        if(req.params.test_type == "mock-test"){
            const filter = {
                school_id :req.body.school_id,
                student_id:req.body.student_id,
                test_id: req.params.test_id,
            }
            const data = await AttemptTest.findOne(filter)
            var filteredArray = data?.questions.filter(function(item){
                return !("answer" in item);
            });
            if(filteredArray.length > 0){
                singleQuestion = filteredArray[0]
            }
        }else{
            const filter = {
                school_id :req.body.school_id,
                student_id:req.body.student_id,
                test_id: req.params.test_id,
            }
            const data = await AttemptTest.findOne(filter)
            var filteredArray = data?.questions.filter(function(item){
                return !("answer" in item);
            });
            const question = filteredArray[Math?.floor(Math?.random() * filteredArray?.length)];
            singleQuestion = await Questions.findOne({_id: question?.question_id},{answer:0,solution:0})
        }
        return res.send(singleQuestion)
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const saveAnswer = async (req,res) => {
    try{
        if(req.params.test_type == "mock-test"){
            const filter = {
                school_id :req.body.school_id,
                student_id:req.body.student_id,
                test_id: req.params.test_id,
            }
            const un = await MockTestQuestions.findOne({_id:req.body.question_id})
            const data = await AttemptTest.findOne(filter)
            data.questions.map(( item, key)=>{
                if(item._id == req.body.question_id){
                    item['answer'] = req.body.answer,
                    item['option'] = req.body.option,
                    item['correct_option'] = un.answer,
                    item['correct_answer'] = un.answer
                }
            })
            const assigntests = await AttemptTest.findOneAndUpdate(filter, {$set: {"questions": data.questions,"time_taken":req.body.time_taken,"completion_status":req.body.completion_status}})
            if(assigntests){
                return res.status(200).json({ 
                    msg: "answer submitted successfully",
                    attemptId: data._id,
                }); 
            }
        }else if(req.params.test_type == "single-test"){
            let optionsDocx = [{key: 0,value: " A", option: "option_a",},{key: 1,value: " B", option: "option_b",},{key: 3,value: " C", option: "option_c",},{key: 4,value: " D", option: "option_d",}];

            const filter = {
                school_id :req.body.school_id,
                student_id:req.body.student_id,
                test_id: req.params.test_id,
            }
            const un = await Questions.findOne({_id:req.body.question_id})
            const data = await AttemptTest.findOne(filter)
            data.questions.map(( item, key)=>{
                if(un?.extension == "docx" && item.question_id == req.body.question_id)
                {
                    var result  = optionsDocx.filter(function(o){return o.value == un.answer ;} );
                    item['answer'] = req.body.answer,
                    item['option'] = req.body.option,
                    item['correct_option'] = result[0]?.option,
                    item['correct_answer'] = un.answer,
                    item['unit_name'] = un.unit_name,
                    item['unit_no'] = un.unit_no,
                    item['chapter_name'] = un.chapter_name,
                    item['chapter_no'] = un.chapter_no,
                    item['question'] = un.question,
                    item['unit_id'] = un.unit_id,
                    item['option_a'] = un?.options[0],
                    item['option_b'] = un?.options[1],
                    item['option_c'] = un?.options[2],
                    item['option_d'] = un?.options[3],
                    item['extension'] = "docx"
                } else if(item.question_id == req.body.question_id){
                    item['answer'] = req.body.answer,
                    item['option'] = req.body.option,
                    item['correct_option'] = un.answer,
                    item['correct_answer'] = un[`${un.answer}`],
                    item['unit_name'] = un.unit_name,
                    item['unit_no'] = un.unit_no,
                    item['chapter_name'] = un.chapter_name,
                    item['chapter_no'] = un.chapter_no,
                    item['question'] = un.question,
                    item['unit_id'] = un.unit_id,
                    item['option_a'] = un.option_a,
                    item['option_b'] = un.option_b,
                    item['option_c'] = un.option_c,
                    item['option_d'] = un.option_d
                }
            })
    
            const assigntests = await AttemptTest.findOneAndUpdate(filter, {$set: {"questions": data.questions,"time_taken":req.body.time_taken,"completion_status":req.body.completion_status}})
            if(assigntests){
                return res.status(200).json({ 
                    msg: "answer submitted successfully",
                    attemptId: data._id,
                }); 
            }
        }
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const saveAnswerOffline = async (req,res) => {
    try{
        const answeredQuestions = req.body.data.questions; 
        if(req.params.test_type == "mock-test"){
            const data = await AttemptTest.findOne({_id:req.body.data.attemptId})
            await Promise.all(data.questions.map(async( item, key)=>{
                const un = await MockTestQuestions.findOne({_id:item._id})
                const answered = answeredQuestions.filter(it => item._id == it.question_id)
                if(item._id == answered._id){
                    item['answer'] = answered.answer,
                    item['option'] = answered.option,
                    item['correct_option'] = un.answer,
                    item['correct_answer'] = un.answer
                }
            }))
            const assigntests = await AttemptTest.findOneAndUpdate({_id:req.body.data.attemptId}, {$set: {"questions": data.questions,"time_taken":req.body.time_taken,"completion_status":req.body.completion_status}})
            if(assigntests){
                return res.status(200).json({ 
                    msg: "answer submitted successfully",
                    attemptId: data._id,
                }); 
            }
        }else if(req.params.test_type == "single-test" || req.params.test_type == "combine-test"){
            let optionsDocx = [{key: 0,value: " A", option: "option_a",},{key: 1,value: " B", option: "option_b",},{key: 3,value: " C", option: "option_c",},{key: 4,value: " D", option: "option_d",}];

            const data = await AttemptTest.findOne({_id:req.body.data.attemptId}).lean()
            await Promise.all(data.questions?.map(async( item, key)=>{
                const un = await Questions.findOne({_id:item.question_id})
                const answered = answeredQuestions.filter(it => item.question_id == it.question_id)
                if(un?.extension == "docx")
                {
                    var result  = optionsDocx.filter(function(o){return o.value == un.answer ;} );
                    item['answer'] = answered[0].answer,
                    item['option'] = answered[0].option,
                    item['correct_option'] = result[0]?.option,
                    item['correct_answer'] = un.answer,
                    item['unit_name'] = un.unit_name,
                    item['unit_no'] = un.unit_no,
                    item['chapter_name'] = un.chapter_name,
                    item['chapter_no'] = un.chapter_no,
                    item['question'] = un.question,
                    item['unit_id'] = un.unit_id,
                    item['option_a'] = un?.options[0],
                    item['option_b'] = un?.options[1],
                    item['option_c'] = un?.options[2],
                    item['option_d'] = un?.options[3],
                    item['extension'] = "docx"
                } else {
                    item['answer'] = answered[0].answer,
                    item['option'] = answered[0].option,
                    item['correct_option'] = un.answer,
                    item['correct_answer'] = un[`${un.answer}`],
                    item['unit_name'] = un.unit_name,
                    item['unit_no'] = un.unit_no,
                    item['chapter_name'] = un.chapter_name,
                    item['chapter_no'] = un.chapter_no,
                    item['question'] = un.question,
                    item['unit_id'] = un.unit_id,
                    item['option_a'] = un.option_a,
                    item['option_b'] = un.option_b,
                    item['option_c'] = un.option_c,
                    item['option_d'] = un.option_d
                }
            }))
            const assigntests = await AttemptTest.findOneAndUpdate({_id:req.body.data.attemptId}, {$set: {"questions": data.questions,"time_taken":req.body.data.time_taken,"completion_status":req.body.data.completion_status}})
            if(assigntests){
                return res.status(200).json({ 
                    msg: "answer submitted successfully",
                    attemptId: data._id,
                }); 
            }
        }
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAllQuestions = async (req,res) => {
    try{
        const filter = {
            school_id :req.body.school_id,
            // subject_id:req.params.subject_id,
            student_id:req.body.student_id,
            test_id: req.params.test_id,
        }
        const data = await AttemptTest.findOne(filter)
        const questions =  data?.questions;
        return res.status(200).json({ 
            data: questions, 
        });
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getLastScore = async (req,res) => {
    try{
        let data = {};
        const filter = {
            school_id :req.body.school_id,
            // subject_id:req.params.subject_id,
            student_id:req.body.student_id,
            class_id: req.body.class_id,
        }
        // const data = await AttemptTest.findOne(filter).sort({"created_at": -1}).limit(1)
        const result = await AttemptTest.findOne(filter).limit(1).sort({$natural:-1})
        if(result!=null){
            let correctAnswers = 0;
            let wrongAnswers = 0;
            let totalQuestions = result?.questions?.length;
            let marksPerQuestion = (result.total_marks / totalQuestions).toFixed(2);
            if(result.test_type == "mock-test"){
                result?.questions?.map((item,key)=>{
                    if(item.answer != undefined ){
                        if((item.answer === 'yes' ? 'a' : 'b') === item?.correct_answer){
                            correctAnswers = correctAnswers + 1;
                        }else{
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }
                })
            }else{
                result?.questions?.map((item,key)=>{
                    if(item.answer != undefined ){
                        if(item.option == item['correct_option']){
                            correctAnswers = correctAnswers + 1;
                        }else{
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }
                })
            }
            
            data = {
                totalQuestions : totalQuestions,
                correctAnswers : correctAnswers,
                wrongAnswers : wrongAnswers,
                attemptedQuestions: correctAnswers + wrongAnswers,
                marksPerQuestion : marksPerQuestion,
                create_at:result?.create_at,
                _id:result?._id,
                questions:result?.questions,
                time_taken:result?.time_taken,
                test_id:result?.test_id,
                test_type:result?.test_type,
                extension:result?.extension,
                total_marks:result?.total_marks
            }
        }
        if(!result){
            data = null
        }
        return res.status(200).json({ 
            data: data, 
        }); 
    }   catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getCumulativeScore = async (req,res) => {
    try{
        let filter = {};
        if(req.params.subject_id != "undefined"){
            filter = {
                school_id :req.body.school_id,
                // subject_id:req.params.subject_id,
                student_id:req.body.student_id,
                class_id: req.body.class_id,
                "test_subjects.subject_id": {
                    $eq : req.params.subject_id
                }
            }
        }else{
            filter = {
                school_id :req.body.school_id,
                student_id:req.body.student_id,
                class_id: req.body.class_id,
            }
        }
        const result = await AttemptTest.find(filter)
        let totalTests = result?.length;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let marksScored = 0;
        let totalMarks = 0;
        let newArray = [];
        result?.map((item,key) => {
            const test_type = item.test_type;
            let obj = {correctAnswers : 0,wrongAnswers : 0,marksScored : 0,totalMarks : 0,created_at:null,marksPerQuestion : 0};
            obj.created_at = item.create_at;
            obj.time_taken = item.time_taken;
            obj.student_name = item.student_name;
            obj.test_name = item.test_name
            obj.marksPerQuestion = (item.total_marks / item?.questions.length).toFixed(2);
            obj.totalMarks = item.total_marks;
            item?.questions?.map((it,key)=>{
                if(it.answer != undefined ){
                    if(test_type == "mock-test"){
                        if((it.answer === 'yes' ? 'a' : 'b') === it?.correct_answer){
                            obj.correctAnswers = obj.correctAnswers + 1;
                            correctAnswers = correctAnswers + 1;
                        }else{
                            obj.wrongAnswers = obj.wrongAnswers + 1;
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }else{
                        if(it.option == it['correct_option']){
                            obj.correctAnswers = obj.correctAnswers + 1;
                            correctAnswers = correctAnswers + 1;
                        }else{
                            obj.wrongAnswers = obj.wrongAnswers + 1;
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }
                }
            })
            obj.marksScored = obj.correctAnswers * obj.marksPerQuestion;
            // obj.totalMarks = obj.correctAnswers +obj.wrongAnswers;
            marksScored = correctAnswers;
            totalMarks = correctAnswers + wrongAnswers;
            newArray.push(obj);
        })
        if(!result){
            data = null
        }
        return res.status(200).json({ 
            data: newArray, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getResult = async (req,res) => {
    try{
        let data = {};
        if(req.params.test_type == "single-test"){
            const result = await AttemptTest.findOne({_id: req?.params?.attempt_id});
            let correctAnswers = 0;
            let wrongAnswers = 0;
            let totalQuestions = result?.questions?.length;
            let timeEndTest = new Date(result?.start_date)
            let marksPerQuestion = (result.total_marks / totalQuestions).toFixed(2);
            timeEndTest.setMinutes( timeEndTest.getMinutes() + result?.test_window );
            result?.questions?.map((item,key)=>{
                if(item.answer != undefined ){
                    if(item.option == item['correct_option']){
                        correctAnswers = correctAnswers + 1;
                    }else{
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            data = {
                totalQuestions : totalQuestions,
                correctAnswers : correctAnswers,
                wrongAnswers : wrongAnswers,
                attemptedQuestions: correctAnswers + wrongAnswers,
                end_time: timeEndTest,
                total_marks : result.total_marks,
                marksPerQuestion : marksPerQuestion, 
            }
        }else if(req.params.test_type == "mock-test"){
            const result = await AttemptTest.findOne({_id: req?.params?.attempt_id});
            let correctAnswers = 0;
            let wrongAnswers = 0;
            let totalQuestions = result?.questions?.length;
            let timeEndTest = new Date(result.start_date)
            let marksPerQuestion = (result.total_marks / totalQuestions).toFixed(2)
            timeEndTest.setMinutes(timeEndTest.getMinutes() + result?.test_window );
            result?.questions?.map((item,key)=>{
                if(item.answer != undefined ){
                    if((item.answer === 'yes' ? 'a' : 'b') === item?.correct_answer){
                    // if(item.answer == item['correct_answer']){
                        correctAnswers = correctAnswers + 1;
                    }else{
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            data = {
                totalQuestions : totalQuestions,
                correctAnswers : correctAnswers,
                wrongAnswers : wrongAnswers,
                attemptedQuestions: correctAnswers + wrongAnswers,
                end_time: timeEndTest,
                total_marks : result.total_marks,
                marksPerQuestion : marksPerQuestion, 
            }
        }else{
            const result = await AttemptTest.findOne({_id: req?.params?.attempt_id});
            let correctAnswers = 0;
            let wrongAnswers = 0;
            let totalQuestions = result?.questions?.length;
            let timeEndTest = new Date(result.start_date)
            let marksPerQuestion = (result.total_marks / totalQuestions).toFixed(2)
            timeEndTest.setMinutes(timeEndTest.getMinutes() + result?.test_window );
            result?.questions?.map((item,key)=>{
                if(item.answer != undefined ){
                    if(item.option == item['correct_option']){
                    // if(item.answer == item['correct_answer']){
                        correctAnswers = correctAnswers + 1;
                    }else{
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            data = {
                totalQuestions : totalQuestions,
                correctAnswers : correctAnswers,
                wrongAnswers : wrongAnswers,
                attemptedQuestions: correctAnswers + wrongAnswers,
                end_time: timeEndTest,
                total_marks : result.total_marks,
                marksPerQuestion : marksPerQuestion, 
            }
        }
        return res.status(200).json({ 
            data: data, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getStudentWiseReport = async (req,res) => {
    try{
        const filter = {
            school_id :req.params.school_id,
            // subject_id:req.params.subject_id,
            class_id: req.params.class_id,
            test_id: req.params.test_id,
            "test_subjects.subject_id": {
                $eq : req.params.subject_id
            },
        }
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let marksScored = 0;
        let totalMarks = 0;
        let marksPerQuestion = 0;
        const TestsAttemptedByStudents = await AttemptTest.find(filter).lean();
        TestsAttemptedByStudents.map((item,key)=>{
            marksPerQuestion = (item.total_marks / item.questions.length).toFixed(2);
            totalMarks = item.total_marks;
            correctAnswers = 0;
            wrongAnswers = 0;
            item.questions.map((it,key)=>{
                if(it.answer != undefined ){
                    if(it.option == it['correct_option']){
                        correctAnswers = correctAnswers + 1;
                    }else{
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            item.totalMarks = totalMarks;
            item.correctAnswers = correctAnswers * marksPerQuestion;
            item.wrongAnswers = wrongAnswers;
            item.cScorePercentage = correctAnswers * marksPerQuestion / totalMarks * 100;
            item.marksPerQuestion = marksPerQuestion;
        })
        return res.status(200).json({ 
            data: TestsAttemptedByStudents, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAssignedTestsTeacher = async(req, res) => {
    try{
        const filter = {
            school_id:req.params.school_id,
            "test_subjects.subject_id": {
                $eq : req.params.subject_id
            },
            class_id:req.params.class_id,
            assigned:true,
        }
        const assignedTest = await AssignTest.find(filter).lean();
        await Promise.all(assignedTest.map(async (item) => {
            const data = await UnitTest.findOne({_id: item.test_id},{test_name:1})
            item.test_name = data?.test_name;
        }))
        return res.status(200).json({ 
            data: assignedTest, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getClassesWithStudents = async (req, res) => {
    try{
        const filter = {
            school_id:req.params.school_id,
        }
        const teacher = await Teacher.findOne({school_id:req.params.school_id,_id:req.params.teacher_id}).lean()
        // const classes = await Class.find().lean();
        const classes = teacher.classess.filter(it => it.checked == true);
        const students = await Student.find(filter);
        classes.forEach(async (item)=>{
            const class_id = item.class_id;
            // const classes = await Class.find({_id: class_id});
            let countStudents = 0 ; 
            students.forEach(async (element) =>{
                if(element.class_id == class_id){
                    countStudents = countStudents + 1
                }
            })
            item.student_count = countStudents;
            // item.section=classes?.section
        })
        return res.status(200).json({ 
            data: classes, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getClassesWithStudentsPrincipal = async (req, res) => {
    try{
        const filter = {
            school_id:req.params.school_id,
        }
        const classes = await Class.find().lean();
        const students = await Student.find(filter);
        classes.forEach(item =>{
            const class_id = item._id;
            let countStudents = 0 ; 
            students.forEach(element =>{
                if(element.class_id == class_id){
                    countStudents = countStudents + 1
                }
            })
            item.student_count = countStudents;
        })
        return res.status(200).json({ 
            data: classes, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAllTeachersOfSchool = async (req, res) => {
    try{
        let filter = null;
        if(req.body.subject_id){
            filter = {
                school_id:req.params.school_id,
                subject_id:req?.body?.subject_id
            }
        }else{
            filter = {
                school_id:req.params.school_id,
            }
        }

        const teachers = await Teacher.find(filter);
        
        return res.status(200).json({ 
            data: teachers, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAllSubjects = async (req, res) => {
    try{
        const subjects = await Subject.find();
        
        return res.status(200).json({ 
            data: subjects, 
        });
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getSchoolLogo = async (req, res) => {
    try{
        const school = await School.findOne({sub_domain : req.params.sub_domain});
        
        return res.status(200).json({ 
            data: school, 
        });
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAllTeacherAssignedTests = async (req, res) => {
    try{
        const tests = await AssignTest.find({teacher_id : req.params.teacher_id,school_id:req.params.school_id});
        return res.status(200).json({ 
            data: tests, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getSectionStudent = async (req, res) => {
    try{
        const classes = await Class.findOne({class_name : req.params.class_name}).lean();
        await Promise.all(classes?.section?.map( async (sec, k)=>{
            let attemptedCount = 0;
            students = await Student.find({ section : sec, school_id:req.params.school_id,class_id:req.params.class_id })
            classes[`${sec}-count`] = students?.length;  
            await Promise.all (students.map( async (item)=>{
                const data = await AttemptTest.find({student_id: item._id, section: sec, class_id:req.params.class_id})
                if(data.length>0){
                    attemptedCount = attemptedCount + 1;
                }
            }))  
            classes[`${sec}-attempted`] = attemptedCount;
            // const assign = await AssignTest.find({school_id:req.params.school_id, class_id:req.params.class_id,assigned:true})
            classes[`${sec}-percentage`] = (attemptedCount/classes[`${sec}-count`])*100;
        }))
        return res.status(200).json({ 
            data: classes, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getClassSectionStudents = async (req, res) => {
    try{
        const students = await Student.find({class_id:req.params.class_id, section:req.params.section,school_id:req.params.school_id}).lean();
        const filter = {
            school_id :req.params.school_id,
            // subject_id:req.params.subject_id,
            class_id: req.params.class_id,
            section: req.params.section
        }
        await Promise.all(students.map(async(item, key)=>{
            const result = await AttemptTest.find({student_id:item._id,class_id:req.params.class_id,section:req.params.section, school_id:req.params.school_id})
            item.attemptedTests = result?.length;
            item.totalMarks = 0
            result?.map((babe,key)=>{
                let correctAnswers = 0;
                let wrongAnswers = 0;
                let totalQuestions = babe?.questions?.length;
                let marksPerQuestion = (babe?.total_marks / totalQuestions).toFixed(2);
                babe?.questions?.map((it,key)=>{
                    if(it.answer != undefined ){
                        if(it.option == it['correct_option']){
                            correctAnswers = correctAnswers + 1;
                        }else{
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }
                })
                item.correctAnswers = correctAnswers * marksPerQuestion;
                item.totalMarks = item.totalMarks + correctAnswers * marksPerQuestion
                item.totalQuestions = totalQuestions;
                item.wrongAnswers = wrongAnswers;
                item.percentage = ((correctAnswers / totalQuestions) * 100)?.toFixed(2);
                item.average = (item.totalMarks / item.attemptedTests)?.toFixed(2);
            })
        }))
        return res.status(200).json({ 
            data: students, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getAllStudentAttemptedTests = async (req, res) => {
    try{
        const filter = {
            school_id :req.params.school_id,
            class_id: req.params.class_id,
            test_id: req.params.test_id,
        }
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let marksScored = 0;
        let totalMarks = 0;
        const TestsAttemptedByStudents = await AttemptTest.find(filter).lean();
        TestsAttemptedByStudents.map((item,key)=>{
            totalMarks = item.questions.length;
            correctAnswers = 0;
            wrongAnswers = 0;
            item.questions.map((it,key)=>{
                if(it.answer != undefined ){
                    if(it.option == it['correct_option']){
                        correctAnswers = correctAnswers + 1;
                    }else{
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            item.totalMarks = totalMarks;
            item.correctAnswers = correctAnswers;
            item.wrongAnswers = wrongAnswers;
            item.cScorePercentage = correctAnswers/totalMarks *100;
        })
        return res.status(200).json({ 
            data: TestsAttemptedByStudents, 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const deleteStudents = async (req, res) => {
    try{
        const data = await Student.deleteMany({school_id:req.params.school_id});
        return res.status(200).json({ 
            msg: "deleted", 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}

const deleteTeachers = async (req, res) => {
    try{
        const data = await Teacher.deleteMany({school_id:req.params.school_id});
        return res.status(200).json({ 
            msg: "deleted", 
        }); 
    } catch(error){
        res.status(500).json({
            status: 500,
            message: "Error occured",
            errors: error.message
        });
    }
}


const ViewAllUnit = async (req, res) => {
    try {
        let filter = {};
        if(req.params?.class_id && req.params?.subject_id) {
            filter = {
            class_id: req.params?.class_id,
            subject_id: req.params?.subject_id,
            };
        }else if (req.params?.class_id) {
            filter = {
            class_id: req.params?.class_id
            };
        }
    
        const AllUnits = await Unit.find(filter, { __v: 0 });
        res.status(200).json({
            data: AllUnits,
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message,
        });
    }
};

const ViewAllChapters = async (req, res) => {
    try{
        let filter = {};
        if(req.params?.class_id && req.params?.subject_id && req.params?.unit_id){
            filter = {
                class_id: req.params?.class_id, 
                subject_id: req.params?.subject_id,
                unit_id: req.params?.unit_id,
            };
        }
        else if(req.params?.class_id && req.params?.subject_id){
            filter = {
                class_id: req.params?.class_id, 
                subject_id: req.params?.subject_id
            };
        }
        // res.send(filter);
        const AllChapters = await Chapter.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllChapters 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

const CreateTest = async ( req, res ) => {
    try {
        const assignTest = await AssignTest.findOne({class_id: req.params.class_id, school_id:req.params.school_id, assigned: true},{start_date:1,test_window:1}).limit(1).sort({$natural:-1})
        let timeAlTest = new Date(assignTest?.start_date)
        timeAlTest.setMinutes( timeAlTest.getMinutes() + assignTest?.test_window );
        
        let timeNwTest = new Date(req.body.start_date)
        
        if(assignTest != null && timeNwTest > timeAlTest){
            let filenames = [];
            let myObject = JSON.parse(req.body.correctAnswers);
            for(let i = 0; i<req.files.length;i++){
                filenames.push(req.files[i].filename)
            }
            const body =  req.body;
            body.answers = myObject;
            body.class_id = req.params.class_id;
            body.unit_id = req.params.unit_id;
            body.chapter_id = req.params.chapter_id;
            body.school_id = req.params.school_id;
            body.teacher_id = req.params.teacher_id;
            body.questionDocs = filenames;
            body.test_subjects = JSON.parse(req.body.test_subjects);
            body.test_type = "upload-test";
            body.assigned = true;
            const newTest = new AssignTest(body);
            await newTest.save();
            return res.status(200).json({ 
                message: "Test created sucessfully"
            });
        }else if(assignTest == null){
            let filenames = [];
            let myObject = JSON.parse(req.body.correctAnswers);
            for(let i = 0; i<req.files.length;i++){
                filenames.push(req.files[i].filename)
            }
            const body =  req.body;
            body.answers = myObject;
            body.class_id = req.params.class_id;
            body.unit_id = req.params.unit_id;
            body.chapter_id = req.params.chapter_id;
            body.school_id = req.params.school_id;
            body.teacher_id = req.params.teacher_id;
            body.questionDocs = filenames;
            body.test_subjects = JSON.parse(req.body.test_subjects);
            body.test_type = "upload-test";
            body.assigned = true;
            const newTest = new AssignTest(body);
            await newTest.save();
            return res.status(200).json({ 
                message: "Test created sucessfully"
            });
        }else{
            return res.status(405).json({
                message: "Test Cant be assigned, a test is already assigned for this time"
            })
        }
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const getMockTest = async ( req, res ) => {
    try {
        let date = new Date();
        date.setMinutes( date.getMinutes() + 20 );
        const MockTests = await AssignTest.findOne(
            {
                school_id:req.params.school_id,
                // class_id:req.params.class_id,
                assigned: true,
                test_type:"mock-test",
                attemptedStudentIds:{
                    $nin:[req.params.student_id]
                },
                // $and: [
                //         {
                //             "start_date": { 
                //                 $gte: date.toISOString()
                //             }
                //         }
                //     ]
            },{__v: 0});
        return res.status(200).json({ 
            data: MockTests
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const getUploadTest = async ( req, res ) => {
    try {
        let date = new Date();
        date.setMinutes( date.getMinutes() - 24 * 60 );
        // const test = await AssignTest.findOne({school_id:req.params.school_id, assigned:true, test_type:"upload-test", class_id:req.params.class_id})
        const AssignedTests = await AssignTest.find(
            {
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned: true,
                test_type:"upload-test",
                attemptedStudentIds:{
                    $nin:[req.params.student_id]
                },
                $and: [
                        {
                            "start_date": { 
                                $gte: date.toISOString()
                            }
                        }
                    ]
            },{__v: 0});
        return res.status(200).json({ 
            data: AssignedTests
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const getMockTestQuestions = async ( req, res ) => {
    try {
        const mockQuestions = await MockTestQuestions.find();
        return res.status(200).json({ 
            data: mockQuestions
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const getUploadTestPaper = async ( req, res ) => {
    try {
        const attempTest = await AttemptTest.findOne({_id:req.params.attempt_id});
        return res.status(200).json({ 
            data: attempTest
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const saveUploadAnswer = async ( req, res ) => {
    try {
        const filter = {
            _id :req.body.attempt_id,
        }
        const data = await AttemptTest.findOne(filter).lean()
        const un = await AssignTest.findOne({_id:data.test_id})
        let questions = data.questions;
        data.questions = []; 
        un.answers.map(( item, key ) => {
            // data.questions[`correctAnswers${key+1}`] = item[`ans${key+1}`]
            // data.questions[`answer${key+1}`] = req.body.answers[`answer${key+1}`]
            // data.questions[`option${key+1}`] = req.body.answers[`option${key+1}`]
            // newArr.push({correct_answer:item[`ans${key+1}`], answer : req.body.answers[`answer${key}`], option: req.body.answers[`option${key}`]})
            data.questions.unshift({correct_answer:item[`ans${key+1}`],correct_option:"option_"+(item[`ans${key+1}`])?.toLowerCase(), answer : req.body?.answers[`answer${key+1}`], option: req.body?.answers[`option${key+1}`],question_no: key+1, questions: questions})
        })
        await AssignTest.findOneAndUpdate({_id:data.test_id}, {
            $addToSet: {
                attemptedStudentIds: req.body.student_id
            }
        })
        const assigntests = await AttemptTest.findOneAndUpdate(filter, {$set: {"questions": data.questions,"time_taken":req.body.time_taken,"completion_status":req.body.completion_status}})
        if(assigntests){
            return res.status(200).json({ 
                msg: "answer submitted successfully",
                attemptId: data._id,
            }); 
        }
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const changeDomainStudent = async ( req, res ) => {
    try {
        const xchool = await School.findOne({_id:req.params.school_id},{sub_domain:1,short:1,school_slug:1});
        const student = await Student.find({school_id:req.params.school_id}).lean();
        student.map((item,key)=>{
            const removeName = item.username.split(item.name.toLowerCase())
            const removeDomain = removeName[1].split('@')
            const new_slug = getFirstLetter(xchool.school_slug);
            const newUsername = new_slug + item.name.toLowerCase() + removeDomain[0] + '@' + xchool.sub_domain + '.com' 
        })
        res.status(200).json({
            data : student
        })
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

function getFirstLetter(el){
    let arr = '';
    let name = '';
    if(el.match('-')){
      arr = el.split('-');
      let data = arr?.map(e => {
        return name += e.charAt(0);
      })
      return data[data.length - 1];
    }else{
      return el.charAt(0)
    }    
}

const changeTime = async ( req, res ) => {
    try {
        const daa = await AssignTest.findOne({school_id:req.params.school_id});
        const update = await AttemptTest.updateMany({school_id:req.params.school_id}, {"$set" :{ "start_date" : daa.start_date, test_window : "180"}},{multi: true });
        res.status(200).json({
            message : "updates" 
        })
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const updateAttempt = async ( req, res ) => {
    try {
        const daa = await AttemptTest.find({school_id : req.params.school_id, class_id : req.params.class_id, student_class_name: '6'});
        const update = await AttemptTest.updateMany({school_id : req.params.school_id, class_id : req.params.class_id, student_class_name: '6'}, {"$set" :{ "class_id":"60c05895e82abc693455109d"}},{multi: true });
        res.status(200).json({
            message : "updated" 
        })
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const testInternet = async ( req, res ) => {
    try {
        res.status(200).json({
            message : "internet connected" 
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}


module.exports = {
    getSubjects,
    getAssignedTestsStudent,
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
    getResult,
    getLastScore,
    getCumulativeScore,
    getStudentWiseReport,
    getAssignedTestsTeacher,
    getClassesWithStudents,
    getAllTeachersOfSchool,
    getAllSubjects,
    getSchoolLogo,
    getAllTeacherAssignedTests,
    getSectionStudent,
    getAllStudentAttemptedTests,
    getClassSectionStudents,
    getClassesWithStudentsPrincipal,
    deleteStudents,
    deleteTeachers,
    ViewAllUnit,
    ViewAllChapters,
    CreateTest,
    getMockTest,
    getMockTestQuestions,
    getUploadTest,
    getUploadTestPaper,
    changeDomainStudent,
    saveUploadAnswer,
    changeTime,
    updateAttempt,
    attemptTestByStudentOffline,
    saveAnswerOffline,
    testInternet
}