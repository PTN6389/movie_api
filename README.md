Objective
To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

User Stories
● As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.
● As a user, I want to be able to create a profile so I can save data about my favorite movies.

Feature Requirements
The feature requirements below were extracted from the user stories listed above. Your project will
only be approved if the following “essential” feature requirements are implemented in your
Achievement project.

Features
● Return a list of ALL movies to the user
● Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
● Return data about a genre (description) by name/title (e.g., “Thriller”)
● Return data about a director (bio, birth year, death year) by name
● Allow new users to register
● Allow users to update their user info (username, password, email, date of birth)
● Allow users to add a movie to their list of favorites
● Allow users to remove a movie from their list of favorites
● Allow existing users to deregister

Technical Requirements
● The API is a Node.js and Express application.
● The API uses REST architecture, with URL endpoints corresponding to the data
operations listed above
● The API uses at least three middleware modules, such as the body-parser package for
reading data from requests and morgan for logging.
● The API uses a “package.json” file.
● The database is built using MongoDB.
● The business logic is modeled with Mongoose.
● The API provides movie information in JSON format.
● The JavaScript code is error-free.
● The API was tested and can be in Postman.
● The API includes user authentication and authorization code.
● The API includes data validation logic.
● The API meets data security regulations.
● The API source is deployed to GitHub.
● The API is deployed to Heroku.
