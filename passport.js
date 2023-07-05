const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * LocalStrategy takes username and password from the request body and uses Mongoose to check db for user with that username.
  */ 
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
}, (name, password, callback) => {
    console.log(name + ' ' + password);
    Users.findOne({ name: name }, (error,user) => {
        if(error) {
            console.log(error);
            return callback(error);
        }
        /** if name can't be found, an error message is passed to the callback */
        if(!user) {
            console.log('incorrect name');
            return callback(null, false, {message: 'Incorrect name or password'});
        }
        /** Validate password user enters */
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback (null, false, {message: 'Incorrect password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

/** JWTStrategy to allow authenticating users based on the JWT submitted alongside their request */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null,user);
    })
    .catch((error) => {
        return callback(error)
    });
}));