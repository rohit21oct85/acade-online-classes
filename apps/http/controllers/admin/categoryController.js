const Category = require('../../../models/admin/Category');

const CreateCategory = async (req, res) => {
    const body = req.body;
    try {
        const newCategory = new Category(body);
        await newCategory.save();
        return res.status(200).json({ 
            message: "Category created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateCategory = async (req, res) =>{
    try {
        await Category.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Category, Updated successfully"
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
const UpdateSegment = async (req, res) =>{
    try {
        const content = {
            name: req.body.name,
            slug: req.body.slug, 
            icon:req.body.icon,
            about:req.body.about,
        };
        const filter = {_id: req.params.category_id};
        if(req.params.segment_id){
            let CategoryData = await Category.findOne(filter);
            let singleSegment = await CategoryData.segments.id(req.params.segment_id);
            singleSegment.set(content);
            await CategoryData.save();
            return res.status(201).json({
                error: false,
                message: "Segment updated"
            });
        }

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}


const ViewCategory = async (req, res) => {
    try{
        const CategoryData = await Category.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: CategoryData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllCategory = async (req, res) => {
    try{
        const AllCategory = await Category.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllCategory 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteCategory = async (req, res) =>{
    const id = req.params.id;
    try {
        await Category.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Category, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    UpdateSegment,
    CreateCategory,
    UpdateCategory,
    ViewCategory,
    ViewAllCategory,
    DeleteCategory,
}