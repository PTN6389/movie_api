const express = require('express'),
     morgan = require('morgan'),
     fs = require('fs'),
     path = require('path'),
     mongoose = require('mongoose'),
     Models = require('./models.js');

const app = express();
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

app.get('/movies/:title/genre',(req,res) => {
    res.send('Successful GET request of genre by title');
});

app.get('/movies/:name/director',(req,res) => {
    res.send('Successful GET request of director by name');
});
            
app.post('/users',(req,res) => {
    Users.findOne({ name: req.body.name })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.name + 'already exists');
            } else {
                Users
                    .create({
                        name: req.body.name,
                        password: req.body.password,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                    .then((user) => { res.status(201).json(user) })
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

app.put('/users/:user/:username',(req,res) => {
    res.send('Sucessfully updated username');
});
            
app.post('/users/:username/:title',(req,res) => {
    res.send('Sucessfully added movie to your favorites');
});

app.delete('/users/:username/:title',(req,res) => {
    res.send('Successfully removed movie from your favorites');
});

app.delete('/users/:username',(req,res) => {
    res.send('Successfully removed user');
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