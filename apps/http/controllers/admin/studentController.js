const Student = require('../../../models/admin/Student');
const School = require('../../../models/admin/School');
const Class  = require('../../../models/admin/Class')
const UserLog  = require('../../../models/admin/UserLog')
const csv = require('csv-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const CreateStudent = async (req, res) => {
    try {
        const school = await School.findOne({_id:req.body.school_id},{sub_domain:1,short:1})
        let body = req.body;
        const empid = `${school.short.toLowerCase()}${req.body.name.trimStart().split(" ")[0].toLowerCase()}${req.body?.class?.trim()}${req.body?.section?.trim().toLowerCase()}${req?.body?.roll_no}`;
        const username = `${school.short.toLowerCase()}${req.body.name.trimStart().split(" ")[0].toLowerCase()}${req.body?.class?.trim()}${req.body?.section?.trim().toLowerCase()}${req.body?.roll_no}@${school?.sub_domain?.trim().toLowerCase()}.com`;
        body.EmpId = empid.toUpperCase();
        body.username = username;
        const newStudent = new Student(body);
        await newStudent.save();
        return res.status(200).json({ 
            message: "Student created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateStudent = async (req, res) =>{
    try {
        let body = []
        const student = await Student.findOne({_id:req.params.id})
        const school = await School.findOne({_id:student.school_id},{sub_domain:1,short:1})
        if(student.username == undefined || student.username == ""){
            body = req.body;
            const empid = `${school.short.toLowerCase()}${req.body.name.trimStart().split(" ")[0].toLowerCase()}${req.body?.class?.trim()}${req.body?.section?.trim().toLowerCase()}${req.body?.roll_no?.trim()}`;
            const username = `${school.short.toLowerCase()}${req.body.name.trimStart().split(" ")[0].toLowerCase()}${req.body?.class?.trim()}${req.body?.section?.trim().toLowerCase()}${req.body?.roll_no?.trim()}@${school?.sub_domain?.trim().toLowerCase()}.com`;
            body.EmpId = empid.toUpperCase();
            body.username = username;
        }else{
            body = req.body;
        }
        await Student.findOneAndUpdate({_id: req.params.id},body)
                .then(response => {
                    return res.status(202).json({
                        message: "Student, Updated successfully"
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

const ViewStudent = async (req, res) => {
    try{
        const StudentData = await Student.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: StudentData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllStudent = async (req, res) => {
    try{
        const filter = {school_id: req.params.school_id, class_id: req.params.class_id, section: req.params.section}
        const AllStudents = await Student.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: AllStudents 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const DeleteStudent = async (req, res) =>{
    const id = req.params.id;
    try {
        await Student.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Student, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

const getStudentBySchoolIdAndClassId = async (req, res) => {
    try{
        const filter = {school_id: req.params.sid}
        const StudentData = await Student.find(filter,{__v: 0});
        return res.status(200).json({ 
            data: StudentData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const uploadStudent = async(req, res) => {
    const data = req.body;
    const hashedPassword = await bcrypt.hash("password", 10)
    let SClass = await Class.find({});
    let FinalData = [];
    let school = await School.findOne({_id:req.body.school_id});

    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( student => {
                    // console.log(student)
                    let firstName;
                    if(student.name.match(" ")){
                        firstName = student.name.trim().split(" ")[0];
                    }else{
                        firstName = student.name.trim();
                    }
                    let student_class = student?.class;
                    let fetched_id ="";
                    if(req.body.class_id == "undefined"){
                        fetched_id = student_class && getClassId(SClass, student_class)
                    }else{
                        fetched_id = req.body.class_id;
                    }
                    const empid = `${school?.short.toLowerCase()}${firstName.trim()}${student?.class?.trim().toLowerCase()}${student?.section?.trim()}${student?.roll_no?.trim()}`;
                    const username = school?.short.toLowerCase()+student?.name?.trimStart().split(" ")[0].toLowerCase()+student?.class?.trim()+student?.section?.trim().toLowerCase()+student?.roll_no?.trim()+'@'+school?.sub_domain?.trim().toLowerCase()+'.com';
                    // body.EmpId = empid.toUpperCase();
                    // body.username = username;
                    FinalData.push({ 
                        name: student.name, 
                        class: student.class, 
                        section: student.section, 
                        roll_no: student.roll_no, 
                        mobile: student.mobile, 
                        address: student.address, 
                        city: student.city, 
                        state: student.state, 
                        pincode: student.pincode, 
                        email: student.email, 
                        school_section: student.school_section, 
                        status: student.status, 
                        EmpId: empid,
                        school_id: req.body.school_id,
                        class_id: fetched_id,
                        username: username,
                        password: hashedPassword,
                    })
                })
                // console.log(FinalData);
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

function getClassId(arr, class_name){
    const data = arr.filter(el => el.class_name == class_name);
    return data && data[0]._id;
}

const otherFunction = async(res, FinalData, callback) => {
    await Student.insertMany(FinalData).then(() => {
        res.status(200).send('Students Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
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
        await Student.findOne({username: req.body.email, school_id: school._id},{__v: 0}).then( student => {
            if(student){
                if(student.isActive == false){
                    return res.status(403).json({ 
                        status: 403,
                        message: "Student Account not Active"
                    })
                }
                bcrypt.compare(req.body.password, student.password, async function (err,response){
                    if(err){
                        res.status(203).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            const accessToken = generateAccessToken(student);
                            const refreshToken = generateRefreshToken(student);
                            refreshTokens.push(refreshToken);
                            const user = await Student.findOneAndUpdate({username: req.body.email, school_id: school._id}, { $set: { isLoggedIn: true } })
                            let device = "";
                            if (req.header('user-agent').indexOf('Mobile') != -1) {
                                device = "Mobile"
                            } else {
                                device = "Computer/Laptop"
                            }
                            const login_time = new Date();
                            const ip = getClientIp(req)
                            let otherInfo = [];
                            otherInfo.push(ip)
                            const user_log = new UserLog({user_type: "student",user_name : user.name,user_id : user._id, email_id :req.body.email,school_id : user.school_id, device_type:device, login_time:login_time, sessionInProgress: true,otherInfo:otherInfo });
                            await user_log.save();
                            res.status(200).json({ 
                                accessToken, 
                                refreshToken,
                                student
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

const Logout = async (req, res) => {
    const accessTokenSecret = 'ACADEONLINE2021';
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader){
        const accessToken = req.headers.authorization.split(' ')[1];  
        const decode = await jwt.verify(accessToken, accessTokenSecret);
        const UserData = {id: decode.id, role: decode.role};
        let newAccessToken = await jwt.sign(UserData, 'sasdasd', {expiresIn: '0s'});
        const d = await UserLog.findOne({ user_id: req.body.user_id,sessionInProgress : true },{ login_time:1 }).sort({$natural:-1})
        const loginTime = new Date(d?.login_time);
        const new_time = new Date();
        const seconds = (new_time - loginTime) / 1000;
        await UserLog.findOneAndUpdate({user_id: req.body.user_id, sessionInProgress : true, user_type: "student"}, { $set : { logout_time : new_time, sessionInProgress : false, total_session : seconds }}).sort({$natural:-1})
        await Student.findOneAndUpdate({_id: req.body.user_id}, { $set: { isLoggedIn: false } })
        return res.status(200).json({
            message: "successfully logged out",
            // accessToken: newAccessToken
        });    
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const data = await Student.findOne({email: email});
        if(data){
            return res.status(201).json(data)
        }else{
            return res.status(402).json({message: "Email does not belongs to our Database"})    
        }
    } catch (error) {
        res.status(502).json({message: "Somethign went wrong!"})
    }
}
const updateAllStudent = async (req, res) => {
    try {
                await Student.updateMany({},{
                    isActive: true,
                    isLoggedIn: false
                })
                .then(response => {
                    return res.status(202).json({
                        message: "Student, Updated successfully"
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

function getClientIp(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // If request was not forwarded
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};
const getRollNo = async (req, res) => {
    try {
        let rollNo = await Student.countDocuments({
            school_id: req.params?.school_id,
            class_id: req.params?.class_id,
            section: req.params?.section,
        });
        let finalNo = rollNo + 1
        res.status(201).json({
            data: finalNo
        })
    } catch (error) {
        res.status(502).json({message: "Somethign went wrong!"})   
    }
}
const AllStudentCount = async (req, res) => {
    try {
        let filter;
        if(req?.params?.class_id == 'all'){
            filter = {
                school_id: req.params?.school_id
            }
        }else{
            filter = {
                school_id: req.params?.school_id,
                class_id: req.params?.class_id,
            }
        }
        let totalStudetns = await Student.countDocuments(filter);
        // console.log(totalStudetns); return;
        res.status(201).json({
            data: totalStudetns
        })
    } catch (error) {
        res.status(502).json({message: "Somethign went wrong!"})   
    }
}

module.exports = {
    AllStudentCount,
    getRollNo,
    CreateStudent,
    UpdateStudent,
    updateAllStudent,
    ViewStudent,
    ViewAllStudent,
    DeleteStudent,
    uploadStudent,
    getStudentBySchoolIdAndClassId,
    Login,
    ForgotPassword,
    Logout,
}