const Student = require('../../../models/admin/Student');
const School = require('../../../models/admin/School');
const Class  = require('../../../models/admin/Class')
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
                    let firstName;
                    if(student.name.match(" ")){
                        firstName = student.name.split(" ")[0];
                    }else{
                        firstName = student.name;
                    }
                    let student_class = student.class;
                    let fetched_id ="";
                    if(req.body.class_id == "undefined"){
                        fetched_id = getClassId(SClass, student_class)
                    }else{
                        fetched_id = req.body.class_id;
                    }
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
                        EmpId: `${req.body.short}${firstName}${student.class}${student.section}${student.roll_no}`,
                        school_id: req.body.school_id,
                        class_id: fetched_id,
                        username: student.name?.substr(0,student.name.indexOf(' ')).toLowerCase()+student?.class+student?.section+student?.roll_no+'@'+school.sub_domain+'.com',
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
        await Student.findOne({email: req.body.email, school_id: school._id},{__v: 0}).then( student => {
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