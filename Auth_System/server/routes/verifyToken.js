const jwt = require('jsonwebtoken');

const JWT_KEY = process.env.JWT_KEY || 'some_key';

module.exports = function(req, res, next) {

    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access denied! No token provided')
    }

    //verify
    try{
        const verified = jwt.verify(token, JWT_KEY);    //returns payload if verification is succesful, if not an error is thrown
        req.user = verified;    //create new user object in req and assign it the verified value

        next(); // this res and req are passed to the caller of this middleware
    }
    catch{
        res.status(400).send('Invalid Token');
    }
}