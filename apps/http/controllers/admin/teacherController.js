const Teacher = require('../../../models/admin/Teacher');
const School = require('../../../models/admin/School');
const Subject = require('../../../models/admin/Subject')
const csv = require('csv-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Class = require('../../../models/admin/Class');

let refreshTokens = [];

const CreateTeacher = async (req, res) => {
    try {
        const school = await School.findOne({_id:req.body.school_id},{sub_domain:1,short:1})
        body = req.body;
        const sub = getSubjectFirstLetetr(req.body.subject_name);
        body.username = school.short+req.body.name.trimStart().split(" ")[0].toLowerCase()+req.body?.mobile.trim().substr(-4, 4)+sub.toLowerCase()+'t@'+school.sub_domain.trim()+'.com';
        body.EmpID = school.short+req.body.name.trimStart().split(" ")[0].toLowerCase()+req.body?.mobile.trim().substr(-4, 4)+sub.toLowerCase()+'T';

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
        let body = [];
       
        const teacher = await Teacher.findOne({_id:req.params.id})
        const school = await School.findOne({_id:teacher.school_id},{sub_domain:1,short:1})
        if(teacher.username == undefined || teacher.username == ""){
            body = req.body;
            const sub = getSubjectFirstLetetr(teacher.subject_name);
            body.username = school.short+req.body.name.trimStart().split(" ")[0].toLowerCase()+req.body?.mobile.trim().substr(-4, 4)+sub.toLowerCase()+'t@'+school.sub_domain.trim()+'.com';
            body.EmpID = school.short+req.body.name.trimStart().split(" ")[0].toLowerCase()+req.body?.mobile.trim().substr(-4, 4)+sub.toLowerCase()+'T';
        }else{
            body = req.body;
            // body.classess = req.body.classess
        }
        // res.json(body); return;
        await Teacher.findOneAndUpdate({_id: req.params.id},body)
                .then(response => {
                    res.status(202).json({
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
const ViewTeacherClass = async (req, res) => {
    try{
        const TeacherData = await Teacher.findOne({
            school_id: req.params.school_id,
            _id: req.params.teacher_id,
        },{__v: 0});

        res.status(200).json({ 
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
        let filter = {};
        if(req.params.subject_id == "all"){
            filter = {school_id: req.params.school_id}
        }else{
            filter = {school_id: req.params.school_id,subject_id: req.params.subject_id}
        }
        const AllTeachers = await Teacher.find(filter,{__v: 0});
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

function getSubjectID(arr, name){
    const data = arr.filter(el => el.subject_name.toLowerCase().trim() == name.toLowerCase().trim());
    return data && data[0]._id;
}

function getClassId(arr, class_name){
    const data = arr.filter(el => el.class_name == class_name);
    return data && data[0]._id;
}

function getSubjectFirstLetetr(string){
    let fl;
    if(string.match(" ")){
        let data = string.split(" ").map( el => {
            return fl += el.charAt(0);
            
        })
        return data[1].split("undefined")[1];
    }else{
        return string.charAt(0);
    }
    
}
const uploadTeacher = async(req, res) => {
    const data = req.body;
    const hashedPassword = await bcrypt.hash('password', 10)
    let Subjects = await Subject.find({});
    let SClass = await Class.find({});
    let school = await School.findOne({_id:req.body.school_id});
    let FinalData = [];
    try {
        let results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(async teacher => {
                    let firstName;
                    const re = /^(Mr|Mrs|Ms|Dr|Er)\.[A-Za-z]+$/;
                    if(teacher.name.match(" ")){
                        if(teacher.name.match(re)){
                            firstName = teacher?.name.trimStart().split(" ")[0].toLowerCase();
                        }else{
                            firstName = teacher?.name.trimStart().split(" ")[1].toLowerCase();
                        }
                    }else{
                        firstName = teacher.name;
                    }
                    let classArray = [];
                    
                    let six_class = teacher.six_class?.toLowerCase();
                    let six_class_id = getClassId(SClass, '6')
                    let six_class_data = {class_id: six_class_id, class_name: '6', checked: (six_class == 'no'?false: true)};
                    
                    let seven_class = teacher.seven_class?.toLowerCase();
                    let seven_class_id = getClassId(SClass, '7');
                    let seven_class_data = {class_id: seven_class_id, class_name: '7', checked: (seven_class == 'no'?false: true)};
                    
                    let eight_class = teacher.eight_class?.toLowerCase();
                    let eight_class_id = getClassId(SClass, '8');
                    let eight_class_data = {class_id: eight_class_id, class_name: '8', checked: (eight_class == 'no'?false: true)};
                    
                    let nine_class = teacher.nine_class?.toLowerCase();
                    let nine_class_id = getClassId(SClass, '9');
                    let nine_class_data = {class_id: nine_class_id, class_name: '9', checked: (nine_class == 'no'?false: true)};
                    
                    let ten_class = teacher.ten_class?.toLowerCase();
                    let ten_class_id = getClassId(SClass, '10');
                    let ten_class_data = {class_id: ten_class_id, class_name: '10', checked: (ten_class == 'no'?false: true)};
                    
                    let eleven_class = teacher.eleven_class?.toLowerCase();
                    let eleven_class_id = getClassId(SClass, '11');
                    let eleven_class_data = {class_id: eleven_class_id, class_name: '11', checked: (eleven_class == 'no'?false: true)};
                    
                    let twelve_class = teacher.twelve_class?.toLowerCase();
                    let twelve_class_id = getClassId(SClass, '12');
                    let twelve_class_data = {class_id: twelve_class_id, class_name: '12', checked: (twelve_class == 'no'?false: true)};
                    
                    
                    classArray.push(
                        six_class_data, 
                        seven_class_data, 
                        eight_class_data,
                        nine_class_data,
                        ten_class_data,
                        eleven_class_data,
                        twelve_class_data
                    );
                    FinalData.push({ 
                        name: teacher.name, 
                        EmpID: `${req.body.short}${firstName}${teacher?.mobile.trim().substr(-4, 4)}${getSubjectFirstLetetr(teacher.subject)}T`, 
                        subject_name: teacher.subject, 
                        subject_id: getSubjectID(Subjects, teacher?.subject), 
                        mobile: teacher.mobile, 
                        email: teacher.email, 
                        password: hashedPassword, 
                        address: teacher.address, 
                        city: teacher.city, 
                        state: teacher.state, 
                        pincode: teacher.pincode, 
                        school_id:req.body.school_id,
                        username: req.body.short+firstName+teacher?.mobile.trim().substr(-4, 4)+getSubjectFirstLetetr(teacher.subject.toLowerCase())+'t@'+school.sub_domain.trim()+'.com',
                        classess: classArray
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
        await Teacher.findOne({username: req.body.email, school_id: school._id},{__v: 0}).then( Teacher => {
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

const updateAllTeacher = async (req, res) => {
    try {
                await Teacher.updateMany({},{
                    isActive: true,
                    isLoggedIn: false
                })
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
        res.status(502).json({message: "Somethign went wrong!"})
    }
}
module.exports = {
    ViewTeacherClass,
    CreateTeacher,
    UpdateTeacher,
    updateAllTeacher,
    ViewTeacher,
    ViewAllTeacher,
    DeleteTeacher,
    getTeacherBySchoolId,
    uploadTeacher,
    Login,
}