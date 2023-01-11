const express = require('express');
const app = express();

let topMovies = [
    {
        title: 'Dangerous Minds',
        year: 1995
    },
    {
        title: 'Die Hard',
        year: 1988
    },
    {
        title: 'Top Gun: Maverick',
        year: 2022
    },
    {
        title: 'The Lion King',
        year: 1994
    },
    {
        title: 'Gone with the Wind',
        year: 1939
    },
    {
        title: 'A Few Good Men',
        year: 1992
    },
    {
        title: 'The Wizard of Oz',
        year: 1939
    },
    {
        title: 'The Equalizer',
        year: 2014
    },
    {
        title: 'Contact',
        year: 1997
    },
    {
        title: 'The Horse Whisperer',
        year: 1998
    }
];

//GET requests
app.get('/',(req, res) => {
    res.send('Welcome to myFlix');
});

app.get('/movies',(req, res) => {
    res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});