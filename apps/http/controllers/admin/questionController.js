const Question = require('../../../models/admin/Question');
const Chapter = require('../../../models/admin/Chapter');
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
        
        await Question.updateMany({unit_id: {
            $in: req.body.unit_id
        }},{subject_id: req.body.subject_id})
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
const UpdateAllSubjectQuestion = async (req, res) =>{
    try {
        
        await Question.updateMany({subject_id: req.body.old_subject_id},{subject_id: req.body.new_subject_id})
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
        let filter = {}
        if(req?.params?.class_id && req?.params?.subject_id && req?.params?.unit_id && req?.params?.chapter_id){
                filter = {
                    class_id: req.params?.class_id,
                    subject_id: req.params?.subject_id,
                    unit_id: req.params?.unit_id,
                    chapter_id: req.params?.chapter_id,
                }
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

        let AllChapters = await Chapter.find(filter,{__v: 0},{
            unit_no: 1,
            unit_name: 1,
            chapter_no: 1,
            chapter_name: 1,
        }).sort({
            chapter_no: 1
        });
        await Promise.all(AllChapters.map(async chapter => {
            var total_question = await Question.countDocuments({
                chapter_id: chapter?._id
            })
            chapter.total_question = total_question
        }))
        res.status(200).json({ 
            data: AllChapters 
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

function slitDataContent(string, delimeter){
    return string.split(delimeter)[0];
}

const uploadQuestion = async (req, res) => {
const data = req.body;
let FinalData = [];
try {
    const class_id = req.body.class_id;
    const class_name = req.body.class_name;
    const chapter_name = req.body.chapter_name;
    const chapter_id = req.body.chapter_id;
    const chapter_no = req.body.chapter_no;
    const extension = req.body.extension;
    const subject_id = req.body.subject_id;
    const subject_name = req.body.subject_name;
    const unit_id = req.body.unit_id;
    const unit_no = req.body.unit_no;
    const unit_name = req.body.unit_name;
    const user_id = req.body.user_id;
    docxParser.parseDocx(req.file.path, function(data){
        let finalArray = []
        let questionArray = data.split("Question:");
        let desSubConcept;
        let desHint1;
        let desHint2;
        let desHint3;
        let desHint4;
        let desHint5;
        let desExamName;
        let desExamYear;
        let desUnit_Section_Name;
        let desSubjectName;
        let desGoverningBoard;
        let desQuestionNumberInPaper;
        let desShift;
        let desGrade;
        let desQuestionCategory;
        let desBloomsTaxonomy;
        let desDOKLevel;
        let desKeywordsTags;
        let desQuestionStem;
        
        questionArray.forEach( question => {
            console.log(question)
            let QuestionType = decode(question).split('Question Type:').pop().split('Question Variety:')[0];
            let desQuestionType = decode(QuestionType).trim().replace(/\r?\n|\r/g, "");
            
            let QuestionVariety = decode(question).split('Question Variety:').pop().split('Difficulty:')[0];
            let desQuestionVerity = decode(QuestionVariety).trim().replace(/\r?\n|\r/g, "");
            
            let Difficulty = decode(question).split('Difficulty:').pop().split('Expected Time to Solve:')[0];
            let desDifficulty = decode(Difficulty).trim().replace(/\r?\n|\r/g, "");
            
            let ExpectedTime = decode(question).split('Expected Time to Solve:').pop().split('Topic:')[0];
            let desExpectedTime = decode(ExpectedTime).trim().replace(/\r?\n|\r/g, "");
            
            let ChapterName = decode(question).split('Topic:').pop().split('Concept Name:')[0];
            let desChapterName = decode(ChapterName).trim().replace(/\r?\n|\r/g, "");
            
            let Concepts = decode(question).split('Concept Name:').pop().split('Sub Concept:')[0];
            let desConcepts = decode(Concepts).trim().replace(/\r?\n|\r/g, "");
            
            let SubConcept = decode(question).split('Sub Concept:').pop().split('Concept Field:')[0];
            desSubConcept = decode(SubConcept).replace(/\r?\n|\r/g, "");
            desSubConcept = slitDataContent(desSubConcept, "Concept Field:");
            
            let ConceptField = decode(question).split('Concept Field:').pop().split('Question Stem:')[0];
            let desConceptField = decode(ConceptField).trim().replace(/\r?\n|\r/g, "");
            
            let QuestionStem = decode(question).split('Question Stem:').pop().split('Options:')[0];
            if(QuestionStem.includes("*")){
                desQuestionStem = decode(QuestionStem).split('*').join("<br/>");
            }else{
                desQuestionStem = decode(QuestionStem).trim().replace(/\r?\n|\r/g, "");
            }

            let Options = decode(question).split('Options:').pop().split('Solution:')[0];
            let desOptions = decode(Options).trim().replace(/\r?\n|\r/g, "").split("#").filter(el => el.length > 0);
            
            let Soluton = decode(question).split('Solution:').pop().split('Explanation:')[0];
            let desSoluton = decode(Soluton).replace(/\r?\n|\r/g, "");
            
            let Explanation = decode(question).split('Explanation:').pop().split('Hint 1:')[0];
            let desExplanation = decode(Explanation).replace(/\r?\n|\r/g, "");
            
            let Hint1 = decode(question).split('Hint 1:').pop().split('Hint 2:')[0];
            if(Hint1.match("Hint 1:")){
                desHint1 = decode(Hint1).replace(/\r?\n|\r/g, "");
            }else{
                desHint1 = '';
            }
            let Hint2 = decode(question).split('Hint 2:').pop().split('Hint 3:')[0];
            if(Hint2.match("Hint 2:")){
                desHint2 = decode(Hint2).replace(/\r?\n|\r/g, "");
            }else{
                desHint2 = '';
            }

            let Hint3 = decode(question).split('Hint 3:').pop().split('Hint 4:')[0];
            if(Hint3.match("Hint 3:")){
                desHint3 = decode(Hint3).replace(/\r?\n|\r/g, "");
            }else{
                desHint3 = '';
            }
            
            let Hint4 = decode(question).split('Hint 4:').pop().split('Hint 5:')[0];
            if(Hint4.match("Hint 4:")){
                desHint4 = decode(Hint4).replace(/\r?\n|\r/g, "");
            }else{
                desHint4 = '';
            }
            
            let Hint5 = decode(question).split('Hint 5:').pop().split('Exam Name:')[0];
            if(Hint5.match("Hint 5:")){
                desHint5 = decode(Hint5).replace(/\r?\n|\r/g, "");
            }else{
                desHint5 = '';
            }
            
            let ExamName = decode(question).split('Exam Name:').pop().split('Unit/Section Name:')[0];
            if(ExamName.match("Exam Name:")){
                desExamName = decode(ExamName).replace(/\r?\n|\r/g, "");
            }else{
                desExamName = '';
            }

            let Unit_Section_Name = decode(question).split('Unit/Section Name:').pop().split('Subject Name:')[0];
            if(Unit_Section_Name.match("Unit/Section Name:")){
                desUnit_Section_Name = decode(Unit_Section_Name).replace(/\r?\n|\r/g, "");
            }else{
                desUnit_Section_Name = '';
            }
            
            let SubjectName = decode(question).split('Subject Name:').pop().split('Governing Board:')[0];
            
            if(SubjectName.match("Subject Name:")){
                desSubjectName = decode(SubjectName).replace(/\r?\n|\r/g, "");
            }else{
                desSubjectName = '';
            }
            
            let GoverningBoard = decode(question).split('Governing Board:').pop().split('Exam Year:')[0];
            if(GoverningBoard.match("Governing Board:")){
                desGoverningBoard = decode(GoverningBoard).replace(/\r?\n|\r/g, "");
            }else{
                desGoverningBoard = '';
            }
            
            let ExamYear = decode(question).split('Exam Year:').pop().split('Question Number in Paper:')[0];
            if(ExamYear.match("Exam Year:")){
                desExamYear = decode(ExamYear).replace(/\r?\n|\r/g, "");
            }else{
                desExamYear = '';
            }
            
            let QuestionNumberInPaper = decode(question).split('Question Number in Paper:').pop().split('Shift:')[0];
            if(QuestionNumberInPaper.match("Question Number in Paper:")){
                desQuestionNumberInPaper = decode(QuestionNumberInPaper).replace(/\r?\n|\r/g, "");
            }else{
                desQuestionNumberInPaper = '';
            }
            
            let Shift = decode(question).split('Shift:').pop().split('Grade:')[0];
            if(Shift.match("Shift:")){
                desShift = decode(Shift).replace(/\r?\n|\r/g, "");
            }else{
                desShift = '';
            }
            
            let Grade = decode(question).split('Grade:').pop().split('Question Category:')[0];
            if(Grade.match("Grade:")){
                desGrade = decode(Grade).replace(/\r?\n|\r/g, "");
            }else{
                desGrade = '';
            }
            
            let QuestionCategory = decode(question).split('Question Category:').pop().split('Blooms Taxonomy:')[0];
            if(QuestionCategory.match("Question Category:")){
                desQuestionCategory = decode(QuestionCategory).replace(/\r?\n|\r/g, "");
            }else{
                desQuestionCategory = '';
            }
            
            let BloomsTaxonomy = decode(question).split('Blooms Taxonomy:').pop().split('DOK Level:')[0];
            if(BloomsTaxonomy.match("Blooms Taxonomy:")){
                desBloomsTaxonomy = decode(BloomsTaxonomy).replace(/\r?\n|\r/g, "");
            }else{
                desBloomsTaxonomy = '';
            }
            
            let DOKLevel = decode(question).split('DOK Level:').pop().split('Keyword/Tags:')[0];
            if(DOKLevel.match("DOK Level:")){
                desDOKLevel = decode(DOKLevel).replace(/\r?\n|\r/g, "");
            }else{
                desDOKLevel = '';
            }
            
            let Keywords = decode(question).split('Keyword/Tags:').pop().split('#')[0];
            if(Keywords.match("Keyword/Tags:")){
                desKeywords = decode(Keywords).replace(/\r?\n|\r/g, "");
            }else{
                desKeywords = '';
            }

            if(desQuestionType !== '')
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
                "question_type": desQuestionType,
                "question_varity": desQuestionVerity,
                "difficulty": desDifficulty,
                "expected_time_to_solve": desExpectedTime,
                "topic_chapter_name": desChapterName,
                "concept": desConcepts,
                "sub_concept": desSubConcept,
                "concept_field": desConceptField,
                "question": desQuestionStem,
                "options": desOptions,
                "answer": desSoluton,
                "solution": desExplanation,
                "hint_1": desHint1,
                "hint_2": desHint2,
                "hint_3": desHint3,
                "hint_4": desHint4,
                "hint_5": desHint5,
                "exam_name": desExamName,
                "unit_section_name": desUnit_Section_Name,
                "d_subject_name": desSubjectName,
                "governing_board": desGoverningBoard,
                "exam_year": desExamYear,
                "question_number": desQuestionNumberInPaper,
                "shift": desShift,
                "grade": desGrade,
                "question_category": desQuestionCategory,
                "blooms_taxonomy": desBloomsTaxonomy,
                "dok_level": desDOKLevel,
                "concept_field": desConceptField,
                "keywords_tags": desKeywordsTags
            })
        })
    // console.log(finalArray);
    
    otherFunction(res, finalArray, function() {
        fs.unlinkSync(req.file.path)
    })
    
})
} catch (error) {
res.status(500).json({
    success: false,
    code: 500,
    errors: error.message
});
}
}
const uploadQuestionTable = async (req, res) => {
    const data = req.body;
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

const otherFunction = async(res, FinalData, callback) => {
    await Question.insertMany(FinalData).then(() => {
        res.status(200).json({message: 'Questions Inserted'})
        callback()
    }).catch(error => {
        res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

const AllQuestionsByUnits = async (req, res) => {
    try {
        let questions = await Question.find({
            unit_id: {
                $in: req.body.unit_id
            }
        });
        res.status(201).json({
            length: questions.length
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    }
}

const AllSubjectsQuestions = async (req, res) => {
    try {
        let questions = await Question.find({
            unit_id: req.body.subject_id
        });
        res.status(201).json({
            length: questions.length
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    }
}
module.exports = {
    AllSubjectsQuestions,
    AllQuestionsByUnits,
    CreateQuestion,
    UpdateQuestion,
    UpdateSubjectQuestion,
    UpdateAllSubjectQuestion,
    ViewQuestion,
    ViewAllQuestion,
    AllQuestions,
    DeleteQuestion,
    uploadQuestion,
}