const Teacher = require('../../../models/admin/Teacher');
const School = require('../../../models/admin/School');
const csv = require('csv-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const CreateTeacher = async (req, res) => {
    const body = req.body;
    try {
        const newTeacher = new Teacher(body);
        await newTeacher.save();
        return res.status(200).json({ 
            message: "Teacher created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateTeacher = async (req, res) =>{
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

const ViewTeacher = async (req, res) => {
    try{
        const TeacherData = await Teacher.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: TeacherData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllTeacher = async (req, res) => {
    try{
        const AllTeachers = await Teacher.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllTeachers 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteTeacher = async (req, res) =>{
    const id = req.params.id;
    try {
        await Teacher.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Teacher, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


const uploadTeacher = async(req, res) => {
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
                results.forEach(teacher => {
                    FinalData.push({ 
                        name: teacher.name, 
                        EmpID: teacher.EmpID, 
                        subject: teacher.subject, 
                        class: teacher.class, 
                        section: teacher.section, 
                        mobile: teacher.mobile, 
                        email: teacher.email, 
                        password: hashedPassword, 
                        address: teacher.address, 
                        city: teacher.city, 
                        state: teacher.state, 
                        pincode: teacher.pincode, 
                        first_name: teacher.first_name, 
                        last_name: teacher.last_name, 
                        phone_no: teacher.phone_no, 
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
    await Teacher.insertMany(FinalData).then(() => {
        res.status(200).send('Teachers Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

const getTeacherBySchoolId = async (req, res) => {
    try{
        const filter = {school_id: req.params.id}
        const TeacherData = await Teacher.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: TeacherData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const Login = async (req, res) => {
    try {
        const school = await School.findOne({sub_domain: req.body.sub_domain},{__v: 0});
        if(!school){
            return res.status(401).json({ 
                status: 401,
                message: "No Such School Found"
            })
        }
        await Teacher.findOne({email: req.body.email, school_id: school._id},{__v: 0}).then( Teacher => {
            if(Teacher){
                bcrypt.compare(req.body.password, Teacher.password, function(err,response){
                    if(err){
                        res.status(203).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            const accessToken = generateAccessToken(Teacher);
                            const refreshToken = generateRefreshToken(Teacher);
                            refreshTokens.push(refreshToken);
                            
                            res.status(200).json({ 
                                accessToken, 
                                refreshToken,
                                Teacher
                            });
                        } else {
                            res.status(203).json({ 
                                status: 203,
                                message: "Password does not match"
                            });
                        }                      
                    }
                });
            }else{
                res.status(401).json({ 
                    status: 401,
                    message: "Email or Password doesnot matched"
                })
            }
        }).catch(error => {
            res.status(401).json({
                status: 401,
                message: "Email Does not exists in our database",
                errors: error.message
            });     
        })
        
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });  
    }
}
const generateAccessToken = (user) => {
    const accessTokenSecret = 'ACADEONLINE2021';
    return jwt.sign({ 
        id: user._id,  
        role: user.role 
    }, accessTokenSecret, {expiresIn: '30d'})
}
const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'ACADEONLINE2021';
    return jwt.sign({
        id: user._id,   
        role: user.role
    },refreshTokenSecret);
}

const RefreshToken = async (req,res) => {
    const refreshTokenSecret = 'ACADEONLINE2021';
    const refreshToken = req.body.token;
    if(refreshToken === null) return res.status(401).json({message: 'Invalid refresh token'});
    if(!refreshTokens.includes(refreshToken)) return res.status(401).json({message: 'Invalid refresh token'});
    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if(err) return res.status(err).json({message: "Error found"});
        const accessToken = generateAccessToken({email: user.email,role: user.role });
        return res.status(200).json({ 
            accessToken
        });
    })
}


module.exports = {
    CreateTeacher,
    UpdateTeacher,
    ViewTeacher,
    ViewAllTeacher,
    DeleteTeacher,
    getTeacherBySchoolId,
    uploadTeacher,
    Login,
}