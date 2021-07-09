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
        let newArray = [];
        let newArray1 = [];

        const AssignedTests = await AssignTest.find(
            {
                // subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned: true,
                // $and: [
                //         {
                //             "start_date": { 
                //                 $gte: new Date().toISOString()
                //             }
                //         }
                //     ]
            },{__v: 0});
        const attemptedTest = await AttemptTest.find(
            {
                // subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                student_id:req.body.student_id,
            },{__v: 0});
        if(attemptedTest.length != AssignedTests.length){
            if(attemptedTest.length > 0){
                AssignedTests.forEach(item=>{
                    attemptedTest.forEach(it => {
                        if(item.test_id != it.test_id && it.student_id == req.body.student_id){
                            newArray.push({
                                subject_id:item.subject_id,
                                class_id:item.class_id,
                                school_id:item.school_id,
                                test_id:item.test_id,
                                assigned:item.assigned,
                                class_name:item.class_name,
                                status:item.status,
                                subject_name:item.subject_name,
                                start_date:item.start_date,
                                test_window:item.test_window,
                            })
                        }
                    })
                })
            }

            const units = await UnitTest.find(
                {
                    class_id:req.params.class_id,
                },{__v: 0});
            
            let newData = [];
            if(newArray && newArray.length > 0){
                newData = newArray;
            }else{
                newData = AssignedTests;
            }
            
            newData.forEach(item=>{
                units.forEach(it => {
                    if(item.test_id == it._id){
                        newArray1.push({
                            test_name:it.test_name,
                            test_duration:it.test_duration,
                            unit_id:it.unit_id,
                            unit_name:it.unit_name,
                            test_slug:it.test_slug,
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
                            start_date:item.start_date,
                            test_window:item.test_window,
                        })
                    }
                })
            }) 
        }
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
        const AssignedTests = await AssignTest.find(
            {
                // subject_id:req.params.subject_id,
                school_id:req.params.school_id,
                class_id:req.params.class_id,
                assigned:false,
                test_type: "single-test",
                "test_subjects.subject_id": {
                    $eq : req.params.subject_id
                },
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
                // subject_id:req.params.subject_id,
                class_id:req.params.class_id,
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
                        test_subjects: item.test_subjects,
                        test_duration:item.test_duration,

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
                        test_duration:item.test_duration
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
        // console.log(timeNwTest,timeAlTest)
        // console.log(timeAlTest instanceof Date && !isNaN(timeAlTest.valueOf()))
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
            test_name:newData1.test_name,
            section:req.body.section,
        });    
        await attempt.save();
        // console.log(req.body.assign_test_id);
        await AssignTest.findOneAndUpdate({test_id:req.body.id}, {
            $addToSet: {
                attemptedStudentIds: req.body.user_id
            }
        })
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
    try{
        const filter = {
            school_id :req.body.school_id,
            // subject_id:req.params.subject_id,
            student_id:req.body.student_id,
            test_id: req.params.test_id,
        }
        // return res.send(filter);
        const data = await AttemptTest.findOne(filter)
        var filteredArray = data?.questions.filter(function(item){
            return !("answer" in item);
        });
        const question = filteredArray[Math?.floor(Math?.random() * filteredArray?.length)];
        const singleQuestion = await Questions.findOne({_id: question?.question_id},{answer:0,solution:0})
        
        // console.log(singleQuestion,question)
        // return res.status(200).json({ 
        //     singleQuestion: singleQuestion,
        // }); 

        return res.send(singleQuestion);
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
        const filter = {
            school_id :req.body.school_id,
            // subject_id:req.params.subject_id,
            student_id:req.body.student_id,
            class_id: req.body.class_id,
        }
        // const data = await AttemptTest.findOne(filter).sort({"created_at": -1}).limit(1)
        const result = await AttemptTest.findOne(filter).limit(1).sort({$natural:-1})
        // console.log(result)
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let totalQuestions = result?.questions?.length;
        result?.questions?.map((item,key)=>{
            if(item.answer != undefined ){
                if(item.option == item['correct_option']){
                    correctAnswers = correctAnswers + 1;
                }else{
                    wrongAnswers = wrongAnswers + 1;
                }
            }
        })
        let data = {
            totalQuestions : totalQuestions,
            correctAnswers : correctAnswers,
            wrongAnswers : wrongAnswers,
            attemptedQuestions: correctAnswers + wrongAnswers,
            create_at:result?.create_at,
            _id:result?._id,
            questions:result?.questions,
            time_taken:result?.time_taken,
            test_id:result?.test_id
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
            let obj = {correctAnswers : 0,wrongAnswers : 0,marksScored : 0,totalMarks : 0,created_at:null,};
            obj.created_at = item.create_at;
            obj.time_taken = item.time_taken;
            obj.student_name = item.student_name;
            obj.test_name = item.test_name
            item?.questions?.map((it,key)=>{
                if(it.answer != undefined ){
                    if(it.option == it['correct_option']){
                        obj.correctAnswers = obj.correctAnswers + 1;
                        correctAnswers = correctAnswers + 1;
                    }else{
                        obj.wrongAnswers = obj.wrongAnswers + 1;
                        wrongAnswers = wrongAnswers + 1;
                    }
                }
            })
            obj.marksScored = obj.correctAnswers;
            obj.totalMarks = obj.correctAnswers +obj.wrongAnswers;
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
        const result = await AttemptTest.findOne({_id: req?.params?.attempt_id});
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let totalQuestions = result?.questions?.length;
        result?.questions?.map((item,key)=>{
            if(item.answer != undefined ){
                if(item.option == item['correct_option']){
                    correctAnswers = correctAnswers + 1;
                }else{
                    wrongAnswers = wrongAnswers + 1;
                }
            }
        })
        let data = {
            totalQuestions : totalQuestions,
            correctAnswers : correctAnswers,
            wrongAnswers : wrongAnswers,
            attemptedQuestions: correctAnswers + wrongAnswers,
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
            const data = await UnitTest.findOne({_id:item.test_id},{test_name:1})
            item.test_name = data.test_name;
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
        // console.log(req.body,req.params)
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
                babe?.questions?.map((it,key)=>{
                    if(it.answer != undefined ){
                        if(it.option == it['correct_option']){
                            correctAnswers = correctAnswers + 1;
                        }else{
                            wrongAnswers = wrongAnswers + 1;
                        }
                    }
                })
                item.correctAnswers = correctAnswers
                item.totalMarks = item.totalMarks + correctAnswers
                item.totalQuestions = totalQuestions
                item.wrongAnswers = wrongAnswers
                item.percentage = ((item.totalMarks / totalQuestions) *100)?.toFixed(2)
                item.average = item.totalMarks / item.attemptedTests
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
}