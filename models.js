const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birthYear: Number
    },
    actors: [String],
    imageURL: String,
    isFeatured: Boolean,
    year: Number
});

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    //console.log(bcrypt.hashSync(password));
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    //console.log(bcrypt.hashSync('password1',10));
    return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User',userSchema);

module.exports.Movie = Movie;
module.exports.User = User;