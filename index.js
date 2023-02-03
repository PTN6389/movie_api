const express = require('express'),
     morgan = require('morgan'),
     fs = require('fs'),
     path = require('path'),
     mongoose = require('mongoose'),
     Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myflix', { useNewUrlParser: true, useUnifiedTopology: true});

let movies = [
    {
        title: 'Dangerous Minds',
        description: 'U.S. Marine LouAnne Johnson, who in 1989 took up a teaching position at Carlmont High School in Belmont, California, where most of her students were African-American and Latino teenagers from East Palo Alto, a racially segregated and economically deprived city. Michelle Pfeiffer stars as Johnson.',
        genre: {
            name: 'Drama',
            description: 'Movie defined by conflict'
        },
        director: {
            name: 'John N. Smith',
            bio: 'Canadian film director and screenwriter',
            birthYear: 1943
        },
        imageURL: 'https://www.imdb.com/title/tt0112792/',
        isFeatured: true,
        year: 1995
    },
    {
        title: 'Die Hard',
        description: 'A New York City police officer tries to save his estranged wife and several others taken hostage by terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
        genre: {
            name: 'Action',
            description: 'Movie with explosions, chases and/or combat'
        },
        director: {
            name: 'John McTiernan',
            bio: 'A leading director of movies, John McTiernan first made his mark as a prolific writer and director of commercials.',
            birthYear: 1951
        },
        imageURL: 'https://www.imdb.com/title/tt0095016/',
        isFeatured: true,
        year: 1988
    },
    {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN&#39s elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.',
        genre: {
            name: 'Action',
            description: 'Movie with explosions, chases and/or combat'
        },
        director: {
            name: 'Joseph Kosinski',
            bio: 'American film director',
            birthYear: 1974
        },
        imageURL: 'https://www.imdb.com/title/tt1745960/',
        isFeatured: true,
        year: 2022
    },
    {
        title: 'The Lion King',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        genre: {
            name: 'Family'
        },
        director: [{
            name: 'Roger Allers',
            bio: 'International animator working in US, Canada, and Japan',
            birthYear: 1949
            },
            {
                name: 'Rob Minkoff',
                bio: 'Animator and cartoonist',
                birthYear: 1962
            }
        ],
        imageURL: 'https://www.imdb.com/title/tt0110357/',
        isFeatured: true,
        year: 1994
    },
    {
        title: 'Gone with the Wind',
        description: 'Presented as originally released in 1939. Includes themes and character depictions which may be offensive and problematic to contemporary audiences. Epic Civil War drama focuses on the life of petulant Southern belle Scarlett O&#39Hara. Starting with her idyllic life on a sprawling plantation, the film traces her survival through the tragic history of the South during the Civil War and Reconstruction, and her tangled love affairs with Ashley Wilkes and Rhett Butler.',
        genre: {
            name: 'Romance',
            description: 'Primary focus of movie is romantic love or the pursuit of it'
        },
        director: {
            name: 'Victor Fleming',
            bio: 'American film director, cinematographer, and producer',
            birthYear: 1889,
            deathYear: 1949
        },
        imageURL: 'https://www.imdb.com/title/tt0031381/',
        isFeatured: true,
        year: 1939
    },
    {
        title: 'A Few Good Men',
        description: 'Military lawyer Lieutenant Daniel Kaffee defends Marines accused of murder. They contend they were acting under orders.',
        genre: {
            name: 'Drama',
            description: 'Movie defined by conflict'
        },
        director: {
            name: 'Rob Reiner',
            bio: 'American film director',
            birthYear: 1947
        },
        imageURL: 'https://www.imdb.com/title/tt0104257/',
        isFeatured: true,
        year: 1992
    },
    {
        title: 'The Wizard of Oz',
        description: 'Young Dorothy Gale and her dog Toto are swept away by a tornado from their Kansas farm to the magical Land of Oz, and embark on a quest with three new friends to see the Wizard, who can return her to her home and fulfill the others&#39 wishes.',
        genre: {
            name: 'Adventure',
            description: 'Movie that is defined by a journey'
        },
        director: {
            name: 'Victor Fleming',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'https://www.imdb.com/title/tt0032138/',
        isFeatured: true,
        year: 1939
    },
    {
        title: 'The Equalizer',
        description: 'A man who believes he has put his mysterious past behind him cannot stand idly by when he meets a young girl under the control of ultra-violent Russian gangsters.',
        genre: {
            name: 'Action',
            description: 'Movie with explosions, chases and/or combat'
        },
        director: {
            name: 'Antoine Fuqua',
            bio: 'American film director',
            birthYear: 1965
        },
        imageURL: 'https://www.imdb.com/title/tt0455944/',
        isFeatured: true,
        year: 2014
    },
    {
        title: 'Contact',
        description: 'Dr. Ellie Arroway, after years of searching, finds conclusive radio proof of extraterrestrial intelligence, sending plans for a mysterious machine.',
        genre: {
            name: 'Drama',
            description: 'Movie defined by conflict'
        },
        director: {
            name: 'Robert Zemeckis',
            bio: 'American film director',
            birthYear: 1952
        },
        imageURL: 'https://www.imdb.com/title/tt0118884/',
        isFeatured: true,
        year: 1997
    },
    {
        title: 'The Horse Whisperer',
        description: 'The mother of a severely traumatized daughter enlists the aid of a unique horse trainer to help the girl&#39s equally injured horse.',
        genre: {
            name: 'Drama',
            description: 'Movie defined by conflict'
        },
        director: {
            name: 'Robert Redford',
            bio: 'American actor and director',
            birthYear: 1936
        },
        imageURL: 'https://www.imdb.com/title/tt0119314/',
        isFeatured: true,
        year: 1998
    }
];




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
    res.json(movies);
});

app.get('/movies/:title',(req,res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
    res.send('Successful GET request to get a single movie by title');
});

app.get('/movies/:title/genre',(req,res) => {
    res.send('Successful GET request of genre by title');
});

app.get('/movies/:name/director',(req,res) => {
    res.send('Successful GET request of director by name');
});
            
app.post('/users',(req,res) => {
    res.send('Successfully registered new user');
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