const Class = require('../../../models/admin/Class');
const csv = require('csv-parser')
const fs = require('fs')

const CreateClass = async (req, res) => {
    const body = req.body;
    console.log(body)
    try {
        const found = await Class.findOne({ class_name:body.class_name })
        if(found){
            const section = found?.section;
            if(!section.includes(body.section)){
                section.push(body.section);
                await Class.findOneAndUpdate({class_name:body.class_name}, {$set: {"section":section}},{ upsert: true })    
            }
        }else{
            await Class.findOneAndUpdate({class_name:body.class_name}, {$set: {"section":body.section,"capacity":body.capacity}},{ upsert: true })
        }
        return res.status(200).json({ 
            message: "Class created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateClass = async (req, res) =>{
    try {
        await Class.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Class, Updated successfully"
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

const ViewClass = async (req, res) => {
    try{
        const ClassData = await Class.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: ClassData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const getClassBySchoolId = async (req, res) => {
    try{
        const filter = {school_id: req.params.id}
        const ClassData = await Class.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: ClassData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const ViewAllClass = async (req, res) => {
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
}

const DeleteClass = async (req, res) =>{
    const id = req.params.id;
    try {
        await Class.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Class, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

const uploadClass = async(req, res) => {
    const data = req.body;
    // console.log(req.body.subject_id)
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
                        class_name: book.class_name, 
                        section: book.section, 
                        capacity:book.capacity,
                        class_teacher: book.class_teacher,
                        school_id:req.body.school_id
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
    await Class.insertMany(FinalData).then(() => {
        res.status(200).send('Classes Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

module.exports = {
    CreateClass,
    UpdateClass,
    ViewClass,
    ViewAllClass,
    DeleteClass,
    uploadClass,
    getClassBySchoolId,
}