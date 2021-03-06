const Chapter = require('../../../models/admin/Chapter');
const csv = require('csv-parser')
const fs = require('fs');
const { ObjectID } = require('mongodb');

const Create = async (req, res) => {
    
    try {
        const ChapterData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await ChapterData.map( data => {
                Chapter.findOneAndUpdate({
                    class_id: req?.body?.user_id,
                    subject_id: data?.subject_id,
                    chapter_no: data?.chapter_no,
                },{$set: {
                    user_id: data?.user_id,
                    class_id: data?.class_id,
                    class_name: data?.class_name,
                    subject_id: data?.subject_id,
                    subject_name: data?.subject_name,
                    unit_id: data?.unit_id,
                    unit_no: data?.unit_no,
                    unit_name: data?.unit_name,
                    chapter_no: data?.chapter_no,
                    chapter_name: data?.chapter_name,
                }}, options, async (err, result) => {
                    if(err){
                        return res.status(409).json({
                            message: "Error occured",
                            error: err.message
                        }); 
                    }
                });
            });


        return res.status(200).json({ 
            message: "Chapter created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const Update = async (req, res) =>{
    try {
        const ChapterData = req.body;
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await ChapterData.map( data => {
                Chapter.findOneAndUpdate({
                    _id: data?.subject_chapter_id,
                },{$set: {
                    user_id: req?.body?.user_id,
                    class_id: data?.class_id,
                    class_name: data?.class_name,
                    subject_id: data?.subject_id,
                    subject_name: data?.subject_name,
                    unit_id: data?.unit_id,
                    unit_no: data?.unit_no,
                    unit_name: data?.unit_name,
                    chapter_no: data?.chapter_no,
                    chapter_name: data?.chapter_name,
                }}, options, async (err, result) => {
                    if(err){
                        return res.status(409).json({
                            message: "Error occured",
                            error: err.message
                        }); 
                    }
                });
            });
            return res.status(200).json({ 
                message: "Chapter updated sucessfully"
            });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}

const View = async (req, res) => {
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
const ViewAll = async (req, res) => {
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
}

const Delete = async (req, res) =>{
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

const Upload = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(unit => {
                    FinalData.push({
                        user_id: req?.body?.user_id, 
                        class_id: req.body.class_id, 
                        class_name: req.body.class_name, 
                        subject_id: req.body.subject_id, 
                        subject_name: req.body.subject_name, 
                        unit_id: unit.unit_id, 
                        unit_no: unit.unit_no, 
                        unit_name: unit.unit_name, 
                        chapter_no: unit.chapter_no, 
                        chapter_name: unit.chapter_name, 
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

const UploadChap = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(unit => {
                    FinalData.push({
                        _id:ObjectID(unit.chapter_id),
                        // user_id: req?.body?.user_id, 
                        class_id: unit.class_id, 
                        class_name: unit.class_name, 
                        subject_id: unit.subject_id, 
                        subject_name: unit.subject_name, 
                        unit_id: unit.unit_id, 
                        unit_no: unit.unit_no, 
                        unit_name: unit.unit_name, 
                        chapter_no: unit.chapter_no, 
                        chapter_name: unit.chapter_name, 
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
//   res.send(FinalData); return;  
  await Chapter.insertMany(FinalData).then(() => {
      res.status(200).send('Unit Inserted')
      callback()
  }).catch(error => {
      return res.status(409).json({
          message: "Error occured while Inserting Data",
          errors: error.message
      });
  })
}
const UpdateChapterSubject = async (req, res) => {
    try {
      let subject_name = req.body.subject_name
      let new_subject_id = req.body.subject_id
      await Chapter.updateMany({subject_name: subject_name}, {
        subject_id: new_subject_id,
      })
      res.status(200).send('Unit Updated')
    } catch (error) {
      res.status(409).json({
          message: "Error while updating Data",
          errors: error.message
      });
    }
  }
  const UpdateChapterClass = async (req, res) => {
    try {
      await Chapter.updateMany({
        class_name: req.body.class_name
      },{
        class_id: req.body.class_id
      });
      
      res.status(200).send('Unit Updated')
    } catch (error) {
      res.status(409).json({
          message: "Error while updating Data",
          errors: error.message
      });
    }
  }
  

module.exports = {
    UpdateChapterSubject,
    UpdateChapterClass,
    Create,
    Upload,
    Update,
    View,
    ViewAll,
    Delete,
    UploadChap
}