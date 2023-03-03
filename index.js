const express = require('express'),
    bodyParser = require('body-parser'),
     morgan = require('morgan'),
     fs = require('fs'),
     path = require('path'),
     mongoose = require('mongoose'),
     Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1) { 
          //If a specific origin isn't found on the list of allowed origins
          let message = 'The CORS policy for this application does\'t allow access from origin ' + origin;
          return callback (new Error(message ), false);  
        }
        return callback (null, true);
    }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

const connectDatabase = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
  
      console.log("connected to database");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  connectDatabase();
  

//mongoose.connect('mongodb+srv://myflixdb.3sxacet.mongodb.net/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect(process.env.CONNECTION_URI , { useNewUrlParser: true, useUnifiedTopology: true});

/**** Logging ****/
// create a write stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags: 'a'});

//set up the logger
app.use(morgan('combined',{stream: accessLogStream}));

/**** Static Files ****/
app.use(express.static('public'));
  
/**** App Routing ****/
//GET requests
app.get('/',(req, res) => {
    res.send('Welcome to myFlix');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then((movies) => res.json(movies));
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({ title: req.params.title })
        .then((movies) => {
            res.json(movies);
        }) 
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({ "genre.name": req.params.name})
    .then((movies) => {
        res.json(movies.genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({ "director.name": req.params.name })
    .then((movies) => {
        res.json(movies.director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
            
app.post('/users', passport.authenticate('jwt', { session: false }), [
    check('name', 'Name is required').isLength({min: 5}),
    check('name', 'Name constains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
], (req,res) => {
console.log(req)
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ name: req.body.name })
        .then((users) => {
            if (users) {
                return res.status(400).send(req.body.name + 'already exists');
            } else {
                Users
                    .create({
                        name: req.body.name,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                    .then((users) => { res.status(201).json(users) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.put('/users/:user/:name', passport.authenticate('jwt', { session: false }), 
    [check('name', 'Username is required').isLength({min: 5}),
    check('name', 'Username contains non alphanumeric characters').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
    ], (req,res) => {

    //check the validation object for errors
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }


    Users.findOneAndUpdate({ name: req.params.name }, {$set:
     {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
     }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updateUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updateUser);
        }
    });
});
            
app.post('/users/:name/movies/:_id', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndUpdate({ name: req.params.name }, 
        {$push: { favoriteMovies: req.params._id }
    },
    { new: true }, //This line makes sure the updated document is returned
    (err, updateUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updateUser);
        }
    });
});

app.delete('/users/:name/movies/:_id', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndUpdate({ name: req.params.name }, 
        {$pull: { favoriteMovies: req.params._id }
    },
    { new: true }, //This line makes sure the updated document is returned
    (err, updateUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updateUser);
        }
    });
});

app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req,res) => {
    Users.findOneAndRemove({ name: req.params.name })
    .then((users) => {
        if (!users) {
            res.status(404).send(req.params.name + ' was not found');
        } else {
            res.status(200).send(req.params.name + ' was deleted');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


/***Error Handling ****/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});