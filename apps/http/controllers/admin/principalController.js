const Principal = require('../../../models/admin/Principal');
const csv = require('csv-parser')
const fs = require('fs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const CreatePrincipal = async (req, res) => {
    const body = req.body;
    try {
        const newPrincipal = new Principal(body);
        await newPrincipal.save();
        return res.status(200).json({ 
            message: "Principal created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdatePrincipal = async (req, res) =>{
    try {
        await Principal.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Principal, Updated successfully"
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

const ViewPrincipal = async (req, res) => {
    try{
        const PrincipalData = await Principal.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: PrincipalData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllPrincipal = async (req, res) => {
    try{
        const AllPrincipal = await Principal.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllPrincipal 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeletePrincipal = async (req, res) =>{
    const id = req.body.principal_id;
    try {
        await Principal.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Principal, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


const uploadPrincipal = async(req, res) => {
    const data = req.body;
    const hashedPassword = await bcrypt.hash("password", 10)
    let FinalData = [];
    try {
        let results = [];
        // console.log(req.file.path)
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(principal => {
                    FinalData.push({ 
                        title: principal.title, 
                        name: principal.name, 
                        EmpId: principal.EmpId, 
                        address: principal.address, 
                        city: principal.city, 
                        state: principal.state, 
                        pincode: principal.pincode, 
                        email: principal.email, 
                        password: hashedPassword, 
                        mobile: principal.mobile, 
                        status: principal.status, 
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
    await Principal.insertMany(FinalData).then(() => {
        res.status(200).send('Principals Inserted')
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
        await Principal.findOne({email: req.body.email},{__v: 0}).then( Principal => {
            if(Principal){
                bcrypt.compare(req.body.password, Principal.password, function(err,response){
                    if(err){
                        res.status(203).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            const accessToken = generateAccessToken(Principal);
                            const refreshToken = generateRefreshToken(Principal);
                            refreshTokens.push(refreshToken);
                            
                            res.status(200).json({ 
                                accessToken, 
                                refreshToken,
                                Principal
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

module.exports = {
    CreatePrincipal,
    UpdatePrincipal,
    ViewPrincipal,
    ViewAllPrincipal,
    DeletePrincipal,
    uploadPrincipal,
    Login,
}