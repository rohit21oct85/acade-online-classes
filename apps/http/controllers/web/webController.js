const Subject = require('../../../models/admin/Subject');

const getSubjects = async (req, res) => {
    const body = req.body;
    try{
        const AllSubjects = await Subject.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllSubjects 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
};

module.exports = {
    getSubjects,
}