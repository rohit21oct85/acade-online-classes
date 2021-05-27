const SchoolAdmin = require('../../../models/school/SchoolAdmin.js');
const School = require('../../../models/admin/School.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const Login = async (req, res) => {
    try {
         
        await SchoolAdmin.findOne({email: req.body.email},{__v: 0}).then( admin => {
            if(admin){
                bcrypt.compare(req.body.password, admin.password, async function(err,response){
                    if(err){
                        res.status(203).json({ 
                            status: 203,
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            const accessToken = generateAccessToken(admin);
                            const refreshToken = generateRefreshToken(admin);
                            let school = await getSchoolData(admin?.school_id);
                            refreshTokens.push(refreshToken);
                            res.status(200).json({ 
                                accessToken, 
                                refreshToken,
                                admin,
                                school
                            });
                        } else {
                            res.status(203).json({ 
                                status: 203,
                                message: "You have entered a wrong password."
                            });
                        }                      
                    }
                });
            }else{
                res.status(203).json({ 
                    status: 203,
                    message: "Email or Password doesnot matched"
                })
            }
        }).catch(error => {
            res.status(203).json({
                status: 203,
                message: "Email Does not exists in our database",
                errors: error.message
            });     
        })
        
    } catch (error) {
        res.status(203).json({
            status: 203,
            message: error.message
        });  
    }
}
async function getSchoolData(school_id){
      return await School.findOne({_id: school_id});
}
const generateAccessToken = (user) => {
    const accessTokenSecret = 'ADC-SA2021';
    return jwt.sign({ 
        id: user._id,  
        role: user.role 
    }, accessTokenSecret, {expiresIn: '1d'})
}
const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'ADC-SA2021';
    return jwt.sign({
        id: user._id,   
        role: user.role
    },refreshTokenSecret);
}

const RefreshToken = async (req,res) => {
    
    const refreshTokenSecret = 'ADC-SA2021';
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
    const accessTokenSecret = 'ADC-SA2021';
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
        const data = await User.findOne({email: email});
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
    Login,
    Logout,
    RefreshToken,
    ForgotPassword,
}