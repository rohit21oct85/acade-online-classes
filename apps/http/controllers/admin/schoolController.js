const School = require('../../../models/admin/School');
const csv = require('csv-parser')
const fs = require('fs')
const bcrypt = require('bcryptjs');

const CreateSchool = async (req, res) => {
    const body = req.body;
    try {

        const newSchool = new School(body);
        await newSchool.save();
        return res.status(200).json({ 
            message: "School created sucessfully"
        });
    } catch (error) {
        res.status(203).json({
            status: 203,
            message : error.message
        })
    }
}
const UpdateSchool = async (req, res) =>{
    try {
        await School.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "School, Updated successfully"
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

const ViewSchool = async (req, res) => {
    try{
        const SchoolData = await School.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: SchoolData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const checkSubDomain = async (req, res) => {
    try{
        const count = await School.count({sub_domain: req?.body?.sub_domain});
        
        if(count > 0){
            res.status(200).json({ 
                count: count,
                message: "subdomain already exists! try another"
            });    
        }else{
            res.status(200).json({ 
                count: count,
                message: "its a valid sub domain"
            });    
        }
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const ViewAllSchool = async (req, res) => {
    try{
        const AllSchool = await School.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllSchool 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteSchool = async (req, res) =>{
    const id = req.body.school_id;
    try {
        await School.findByIdAndDelete({_id: id}).then( response => {
            return res.status(201).json({
                message: "School, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

const addFields = async (req, res) => {
    let field = req?.body?.field
    let fieldType = req?.body?.fieldType
    let defaultValue = req?.body?.defaultValue
    await Book.updateMany({},
    {
        field: {
            type: fieldType,
            default: defaultValue
        }
    });
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}
function changeInSlug(string){
    return string.split(" ").join("-").toLowerCase();
}
function changeInShort(string){
    let short;
    let arr;
    if(string.match(" ")){
        arr = string.split(' ');
        let data = arr?.map(e => {
            if(e !== undefined)
            return short += e.charAt(0);
        })
        short = data[data.length - 1];
        short = short.split('undefined')[1];
    }else{
        short = string.charAt(0)
    }
    return short;
}


const uploadSchool = async(req, res) => {
    const data = req.body;
    let school_logo = "1EhbHmUQv7AD1O6EWWlWS6ujOMuuReXfJ"
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(school => {
                    let school_slug = changeInSlug(school?.School_name);
                    let short = changeInShort(school?.School_name)
                    FinalData.push({ 
                        school_name: school.School_name, 
                        school_slug: school_slug, 
                        short: short, 
                        sub_domain: school.domain, 
                        school_logo: school_logo, 
                        address: school.address, 
                        city: school.city, 
                        state: school.state, 
                        pincode: school.pincode, 
                        contact_name: school.contact_name, 
                        contact_email: school.contact_email, 
                        contact_mobile: school.contact_mobile, 
                        status: school.status, 
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
    await School.insertMany(FinalData).then(() => {
        res.status(200).send('Schools Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
};

const searchSchool = async (req, res) => {
    // const search = req.params.search;
    // const limit = parseInt(req.params.limit);
    const search = req.body.search; // only recieve 100 chars in search
    const limit = parseInt(req.body.limit);
    // working with special charcters
    // let searchString = regexEscape(search)

    const schools = await School.find({ 
        $or:
        // [{book_isbn: { $regex: search}},{book_name:{ $regex:search }},{question:{$regex:search}}]
        [{school_name: {$regex:search, '$options' : 'i'}}]
    },{
        _id:0,
        school_name:1,
        sub_domain:1,
        school_logo:1,
        address:1,
        city:1,
        state:1,
        pincode:1,
        contact_name:1,
        contact_email:1,
        slug:1,
        contact_mobile:1,
    }).limit(limit);

    res.status(200).json({
        schools
    });
}

module.exports = {
    checkSubDomain,
    addFields,
    CreateSchool,
    UpdateSchool,
    ViewSchool,
    ViewAllSchool,
    DeleteSchool,
    uploadSchool,
    searchSchool,
}