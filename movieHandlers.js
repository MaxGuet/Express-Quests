const database = require('./database');

const movies = [
  {
    id: 1,
    title: 'Citizen Kane',
    director: 'Orson Wells',
    year: '1941',
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: '1972',
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    year: '1994',
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {
  database
    .query('select * from movies')
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from');
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (movie != null) {
    res.json(movie);
  } else {
    res.status(404).send('Not Found');
  }
};

const getUsers = (req, res) => {
  database.query('Select * from users').then(([users]) => {
    res.json(users);
  });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database.query('select * from users where id = ?', [id]).then(([users]) => {
    if (users[0] != null) {
      res.json(users[0]);
    } else {
      res.status(404).send('Not found');
    }
  });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      'INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)',
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res
        .location(`/api/movies/${result.insertId}`)
        .status(201)
        .send('Film created');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving the movie');
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      'INSERT INTO users(firstname, lastname, email, city, language) VALUES (?,?,?,?,?)',
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res
        .location(`/api/users.${result.insertId}`)
        .status(201)
        .send('User Created');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error creating user');
    });
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
};
