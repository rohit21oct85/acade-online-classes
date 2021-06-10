const Student = require('../../../models/admin/Student');
const School = require('../../../models/admin/School');
const csv = require('csv-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const CreateStudent = async (req, res) => {
    const body = req.body;
    try {
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
        await Student.findOneAndUpdate({_id: req.params.id},req.body)
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
        const AllStudents = await Student.find({},{__v: 0});
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
    const filter = {_id: req.body.school_id}
    const sch = await School.findOne(filter,{__v: 0});
    const domainName = sch.domain;
    const hashedPassword = await bcrypt.hash("password", 10)
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(student => {
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
                        status: student.status, 
                        guardian_name: student.guardian_name,
                        EMPID: student.EmpID,
                        guardian_phone_no: student.guardian_phone,
                        school_id: req.body.school_id,
                        class_id: req.body.class_id,
                        username: student.first_name + student?.guardian_phone?.substr(-4) + "@" + domainName,
                        password: hashedPassword,
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
        await Student.findOne({email: req.body.email},{__v: 0}).then( student => {
            if(student){
                bcrypt.compare(req.body.password, student.password, function(err,response){
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
    const accessTokenSecret = 'SHIVAMPARTS2021';
    return jwt.sign({ 
        id: user._id,  
        role: user.role 
    }, accessTokenSecret, {expiresIn: '30d'})
}
const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'SHIVAMPARTS2021';
    return jwt.sign({
        id: user._id,   
        role: user.role
    },refreshTokenSecret);
}

const RefreshToken = async (req,res) => {
    const refreshTokenSecret = 'SHIVAMPARTS2021';
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
    const accessTokenSecret = 'SHIVAMPARTS2021';
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader){
        const accessToken = req.headers.authorization.split(' ')[1];  
        const decode = await jwt.verify(accessToken, accessTokenSecret);
        const UserData = {id: decode.id, role: decode.role};
        let newAccessToken = await jwt.sign(UserData, 'sasdasd', {expiresIn: '0s'});
        return res.status(402).json({
            message: "successfully loggedout",
            accessToken: newAccessToken
        });    
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const data = await Student.findOne({email: email});
        if(data){
            console.log(data);
            return res.status(201).json(data)
        }else{
            return res.status(402).json({message: "Email does not belongs to our Database"})    
        }
    } catch (error) {
        return res.status(502).json({message: "Somethign went wrong!"})
    }

}

module.exports = {
    CreateStudent,
    UpdateStudent,
    ViewStudent,
    ViewAllStudent,
    DeleteStudent,
    uploadStudent,
    getStudentBySchoolIdAndClassId,
    Login,
    ForgotPassword,
    Logout,
}