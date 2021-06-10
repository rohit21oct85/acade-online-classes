const Chapter = require('../../../models/admin/Chapter');

const CreateChapter = async (req, res) => {
    const body = req.body;
    try {
        const newChapter = new Chapter(body);
        await newChapter.save();
        return res.status(200).json({ 
            message: "Chapter created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateChapter = async (req, res) =>{
    try {
        await Chapter.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Chapter, Updated successfully"
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

const ViewChapter = async (req, res) => {
    try{
        const ChapterData = await Chapter.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: ChapterData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllChapter = async (req, res) => {
    try{
        let filter = {}
        if(req.params?.subject_id && req.params?.class_id && req.params?.unit_id){
            filter = {
                class_id: req.params?.class_id, 
                subject_id: req.params?.subject_id,
                unit_id: req.params?.unit_id
            };
        }
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
}

const DeleteChapter = async (req, res) =>{
    const id = req.params.id;
    try {
        await Chapter.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Chapter, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


module.exports = {
    CreateChapter,
    UpdateChapter,
    ViewChapter,
    ViewAllChapter,
    DeleteChapter,
}