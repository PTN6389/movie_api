const express = require('express'),
     morgan = require('morgan'),
     fs = require('fs'),
     path = require('path');

const app = express();
(description, genre, director, image URL, whether it's featured or not)
director (bio, birth year, death year)

let movies = [
    {
        title: 'Dangerous Minds',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1995
    },
    {
        title: 'Die Hard',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1988
    },
    {
        title: 'Top Gun: Maverick',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 2022
    },
    {
        title: 'The Lion King',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1994
    },
    {
        title: 'Gone with the Wind',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1939
    },
    {
        title: 'A Few Good Men',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1992
    },
    {
        title: 'The Wizard of Oz',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1939
    },
    {
        title: 'The Equalizer',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 2014
    },
    {
        title: 'Contact',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
        year: 1997
    },
    {
        title: 'The Horse Whisperer',
        description: 'Movie description',
        genre: 'Movie genre',
        director: {
            name: 'Director name',
            bio: 'Director bio',
            birthYear: 1970,
            deathYear: 2023
        },
        imageURL: 'placeholder',
        isFeatured: 1,
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
    res.json(topMovies);
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