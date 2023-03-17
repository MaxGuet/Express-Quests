require('dotenv').config();
const express = require('express');
const port = process.env.APP_PORT ?? 5000;
const app = express();
app.use(express.json());
const validators = require('./validators');

const welcome = (req, res) => {
  res.send('Welcome to my favourite movie list');
};

const step1 = (req, res, next) => {
  req.message = 'I went through step 1';
  next();
};

const step2 = (req, res, next) => {
  req.message += 'and step 2';
  next();
};

const lastStep = (req, res) => {
  res.send(req.message);
};

app.get('/', welcome);

const movieHandlers = require('./movieHandlers');

app.get('/test', step1, step2, lastStep);
app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', movieHandlers.getUsers);
app.get('/api/users/:id', movieHandlers.getUserById);
app.post('/api/movies', validators.validateMovie, movieHandlers.postMovie);
app.post('/api/users', validators.validateUser, movieHandlers.postUser);
app.put('/api/movies/:id', validators.validateMovie, movieHandlers.updateMovie);
app.put('/api/users/:id', validators.validateUser, movieHandlers.updateUser);
app.delete('/api/movies/:id', movieHandlers.deleteMovie);
app.delete('/api/users/:id', movieHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error('Something bad happened');
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
