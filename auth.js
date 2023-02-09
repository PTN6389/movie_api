const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (users) => {
    return jwt.sign(users, jwtSecret, {
        subject: users.name,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/* POST login */
module.exports = (router) => {
    router.post('/login', (req,res) => {
        passport.authenticate('local', { session: false }, (error, users, info) => {
            if(error || !users) {
                return res.status(400).json({
                    message: 'Something is not right',
                    users: users
                });
            }
            req.login(users, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(users.toJSON());
            });
        })(req.res);
    });
}
