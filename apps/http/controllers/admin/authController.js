const Admin = require('../../../models/admin/admin.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const Register = async (req, res) => {
    return res.status(405).json({
        message: 'Register Routes Not Allowed'
    })
    const body = req.body;
    try {
        const newAdmin = new Admin(body);
        await newAdmin.save();
        return res.status(200).json({ 
            message: "Registered Sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const Login = async (req, res) => {
    try {
         
        await Admin.findOne({email: req.body.email},{__v: 0}).then( admin => {
            if(admin){
                bcrypt.compare(req.body.password, admin.password, function(err,response){
                    if(err){
                        res.status(203).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            const accessToken = generateAccessToken(admin);
                            const refreshToken = generateRefreshToken(admin);
                            refreshTokens.push(refreshToken);
                            
                            res.status(200).json({ 
                                accessToken, 
                                refreshToken,
                                admin
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
    Register,
    Login,
    Logout,
    RefreshToken,
    ForgotPassword,
}