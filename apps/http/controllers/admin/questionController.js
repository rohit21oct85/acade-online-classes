const Question = require('../../../models/admin/Question');
const csv = require('csv-parser')
const fs = require('fs')
const docxParser = require('docx-parser');
const {decode} = require('html-entities');
const docxTables = require('docx-tables')

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
const getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};
const uploadQuestionTable = async (req, res) => {
    const data = req.body;
    res.send(data); return;
    let FinalData = [];
    try {
        docxTables({
            file: `${req.file.path}`
          }).then((data) => {
            // .docx table data
            data.forEach((content, ind) => {
                let question_no = content[0][1].data
                let difficulty = content[1][1].data
                let topic = content[2][1].data
                let concept = content[3][1].data
                let subConcept = content[4][1].data
                let question = content[5][1].data
                let options = content[6][1].data
                let solution = content[7][1].data
                let explanation = content[8][1].data

                FinalData.push({
                    "question_no" : question_no.replace(/\r?\n|\r/g, ""),
                    "difficulty" : difficulty.replace(/\r?\n|\r/g, ""),
                    "topic" : topic.replace(/\r?\n|\r/g, ""),
                    "concept" : concept.replace(/\r?\n|\r/g, ""),
                    "subConcept" : subConcept.replace(/\r?\n|\r/g, ""),
                    "question" : question.replace(/\r?\n|\r/g, ""),
                    "options" : options.replace(/\r?\n|\r/g, ""),
                    "solution" : solution.replace(/\r?\n|\r/g, ""),
                    "explanation" : explanation.replace(/\r?\n|\r/g, ""),
                })
                
                
            })
            console.log(FinalData);

          }).catch((error) => {
            console.error(error)
          })
    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            errors: error.message
        });
    }
}
const uploadQuestion = async(req, res) => {
    const data = req.body;
    const class_id = req.body.class_id;
    const class_name = req.body.class_name;
    const chapter_id = req.body.chapter_id;
    const chapter_name = req.body.chapter_name;
    const chapter_no = req.body.chapter_no;
    const extension = req.body.extension;
    const subject_id = req.body.subject_id;
    const subject_name = req.body.subject_name;
    const unit_id = req.body.unit_id;
    const unit_no = req.body.unit_no;
    const unit_name = req.body.unit_name;
    const user_id = req.body.user_id;

    let FinalData = [];
    try {
        let results = [];
        if(req.body.extension == 'docx'){
            
            docxParser.parseDocx(req.file.path, function(data){
                let finalArray = []
                var result = getFromBetween.get(decode(data),"#Ques#","#/Ques#");
                result.forEach( val => {
                    // let innerUnit = getFromBetween.get(decode(val),"#unit#","#/unit#");
                    // let innerChapter = getFromBetween.get(decode(val),"#chapter#","#/chapter#");
                    let innerQuestion = getFromBetween.get(decode(val),"#question#","#/question#");
                    let innerOptions = getFromBetween.get(decode(val),"#options#","#/options#");
                    let Options = innerOptions[0].replace(/\r?\n|\r/g, "").split("#option#").filter(el => el.length > 0);

                    let innerAnswer = getFromBetween.get(decode(val),"#answer#","#/answer#");
                    let innerExplanation = getFromBetween.get(decode(val),"#explanation#","#/explanation#");
                    finalArray.push({
                        "user_id": user_id,
                        "class_id": class_id,
                        "class_name": class_name,
                        "chapter_id": chapter_id,
                        "chapter_name": chapter_name,
                        "chapter_no": chapter_no,
                        "extension": extension,
                        "subject_id": subject_id,
                        "subject_name": subject_name,
                        "unit_id": unit_id,
                        "unit_no": unit_no,
                        "unit_name": unit_name,
                        "question": decode(innerQuestion[0]).replace(/\r?\n|\r/g, ""),
                        "options": decode(Options),
                        "answer": decode(innerAnswer[0]).replace(/\r?\n|\r/g, ""),
                        "explanation": decode(innerExplanation[0]).replace(/\r?\n|\r/g, "")
                    })
                    
                })
                    // console.log(finalArray); return;
                    otherFunction(res, finalArray, function() {
                        fs.unlinkSync(req.file.path)
                    })
                
            })

            

        }else{
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
        }
        
    } catch (error) {
        res.status(409).json({
            message: "External Error occured",
            errors: error.message
        });
    }
}

const otherFunction = async(res, FinalData, callback) => {
    await Question.insertMany(FinalData).then(() => {
        res.status(200).json({message: 'Questions Inserted'})
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