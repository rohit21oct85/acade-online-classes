const Question = require('../../../models/admin/Question');
const csv = require('csv-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const CreateQuestion = async (req, res) => {
    const body = req.body;
    try {
        // res.send(body); return;
        const newQuestion = new Question(body);

        await newQuestion.save();
        return res.status(200).json({ 
            message: "Question created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateQuestion = async (req, res) =>{
    try {
        await Question.findOneAndUpdate({_id: req.params.id},{$set: req.body})
                .then(response => {
                    return res.status(202).json({
                        message: "Question, Updated successfully"
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
const UpdateSubjectQuestion = async (req, res) =>{
    try {
        await Question.updateMany({},{subject_id: req.params.subject_id})
                .then(response => {
                    return res.status(202).json({
                        message: "Question, Updated successfully"
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

const ViewQuestion = async (req, res) => {
    try{
        const QuestionData = await Question.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: QuestionData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllQuestion = async (req, res) => {
    try{
        let filter = {
            class_id: req.params?.class_id,
            subject_id: req.params?.subject_id,
            unit_id: req.params?.unit_id,
            chapter_id: req.params?.chapter_id,
        }

        const AllQuestions = await Question.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllQuestions 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const AllQuestions = async (req, res) => {
    try{
        let filter = {
            class_id: req.params?.class_id,
            subject_id: req.params?.subject_id
        }

        // const AllQuestions = await Question.find(filter,{__v: 0});
        let AllQuestions = await Question.aggregate([
            {"$match": filter},
            {"$group": {
                "_id": {
                    "unit_id":"$unit_id",
                    "chapter_name":"$chapter_name",
                },
                "count":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$unit_name", "$unit_name"]
                        },1,0]
                    }
                },
            }},
            {$sort: { _id: 1}}
        ]);

        return res.status(200).json({ 
            data: AllQuestions 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteQuestion = async (req, res) =>{
    const id = req.body.qbank_id;
    try {
        await Question.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Question, deleted successfully"
            })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


const uploadQuestion = async(req, res) => {
    const data = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // console.log(req.body.subject_id)
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(Question => {
                    FinalData.push({ 
                        class_id: Question.class_id, 
                        class_name: Question.class_name, 
                        subject_id: Question.subject_id, 
                        subject_name: Question.subject_name, 
                        question: Question.question, 
                        option_a: Question.option_a, 
                        option_b: Question.option_b, 
                        option_c: Question.option_c, 
                        option_d: Question.option_d, 
                        answer: Question.answer, 
                        qtype: Question.qtype, 
                        atype: Question.atype, 
                        
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
    await Question.insertMany(FinalData).then(() => {
        res.status(200).send('Questions Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}


module.exports = {
    CreateQuestion,
    UpdateQuestion,
    UpdateSubjectQuestion,
    ViewQuestion,
    ViewAllQuestion,
    AllQuestions,
    DeleteQuestion,
    uploadQuestion,
}