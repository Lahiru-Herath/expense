const bcrypt = require('bcryptjs');
const HttpError = require('../models/errorModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');




//api/users/register
//UNPROTECTED
const registerUser = async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    try {
        
        if(!name || !email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({email: newEmail})
        if(emailExists) {
            return next(new HttpError("Email already exists", 422))
        }

        if(password.length < 6) {
            return next(new HttpError("Password must be at least 6 characters long", 422))
        }

        if(password != confirmPassword) {
            return next(new HttpError("Passwords do not match", 422))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, password: hashedPass});
        res.status(201).json({message: "User Registration successful", data: {newUser}});

    } catch (error) {
        return next(new HttpError("User Registration Failed", 422))
    }
};


//api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all fields", 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail});

        if(!user){
            return next(new HttpError("Email does not exist", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Incorrect Password", 422));
        }

        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET_KEY, {expiresIn : "1d"})

        res.status(200).json({token, id, name})

    } catch (error) {
        return next(new HttpError("Login Failed. Please check the credentials", 422))
    }
};

//api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
    res.json("User Profile");
};

//api/users/update-avatar
//PROTECTED
const updateAvatar = async (req, res, next) => {
    res.json("Update Profile Picture");
};

//api/users/update-user
//PROTECTED
const updateUser = async (req, res, next) => {
    res.json("Update User");
};

//api/users/authors
//UNPROTECTED
const getAuthors = async (req, res, next) => {
    res.json("Get all users/authors");
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateAvatar,
    updateUser,
    getAuthors
}
