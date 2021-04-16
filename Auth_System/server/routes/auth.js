const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {check, validationResult} = require('express-validator');

const router = express.Router();

const User = require('../models/User');

const validate = [
    check('fullName')
        .isLength({min: 2})
        .withMessage('Your full name is required'),
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters')
]

const generateToken = (user) => {
    //create and assign a token
    const JWT_KEY = process.env.JWT_KEY || 'some_key'; 
    return jwt.sign(
        {_id: user._id, email: user.email, fullName: user.fullName},
        JWT_KEY
    );
}

router.post('/register', validate, async (req, res) => {
    body = req.body;
    
    // check for validation errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
    }

    //ensure email does not already exist
    const userExists = await User.findOne({email: body.email});
    if (userExists){
        return res.status(400).send({success: false, message: 'Email already exists'});
    }

    // convert password to hash encryption
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(body.password, salt)

    // create new User document 
    const user = new User({
        fullName: body.fullName,
        email: body.email,
        password: hashPassword
    })

    try {
        // save user document to the User collection
        const savedUser = await user.save();

        //create and assign token for registered user
        const token = generateToken(savedUser);

        // send user object
        res.send({success: true, data: {
            id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            },
            token
        });
    } 
    catch (error) {
        res.status(400).send({sucess: false, error});
    }
})

const loginValidate = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters')
]

router.post('/login', loginValidate, async (req, res) => {

    //check email and password has been provided
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
    }

    // check if emial exists
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(404).send({success: false, message: 'User is not registered'});
    }

    //check password is correct
    bcrypt.compare(req.body.password, user.password, (error, result) => {
        if(!result) {
            return res.status(404).send({success: false, message:'Invalid Email or Password'});
        } else {

            //create and assign a token for the logged in user
            const token = generateToken(user);

            // store token in header, and body
            res.header('auth-token', token).send({success: true, message: 'Logged In Successfully', token})
        }
    });
})

module.exports = router;