const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith('Bearer')) {
        
        const token = Authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, info) => {
            if(err) {
                return next(new HttpError("Unauthorized. Invalid Token", 403));
            }
        });
        req.user = decoded;
        next();
    }else{
        return next(new HttpError("Unauthorized. Not Token.", 402));
    }
}

module.exports = authMiddleware;