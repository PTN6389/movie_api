const express = require('express'),
    bodyParser = require('body-parser'),
     morgan = require('morgan'),
     fs = require('fs'),
     path = require('path'),
     mongoose = require('mongoose'),
     Models = require('./models.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myflix', { useNewUrlParser: true, useUnifiedTopology: true});

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

app.get('/movies',(req, res) => {
    Movies.find().then((movies) => res.json(movies));
});

app.get('/movies/:title',(req,res) => {
    Movies.findOne({ title: req.params.title })
        .then((movies) => {
            res.json(movies);
        }) 
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genre/:name',(req,res) => {
    Movies.findOne({ "genre.name": req.params.name})
    .then((movies) => {
        res.json(movies.genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/director/:name',(req,res) => {
    Movies.findOne({ "director.name": req.params.name })
    .then((movies) => {
        res.json(movies.director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
            
app.post('/users',(req,res) => {
    Users.findOne({ name: req.body.name })
        .then((users) => {
            if (users) {
                return res.status(400).send(req.body.name + 'already exists');
            } else {
                Users
                    .create({
                        name: req.body.name,
                        password: req.body.password,
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

app.put('/users/:user/:name',(req,res) => {
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
            
app.post('/users/:name/movies/:_id',(req,res) => {
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

app.delete('/users/:name/movies/:_id',(req,res) => {
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

app.delete('/users/:name',(req,res) => {
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
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});