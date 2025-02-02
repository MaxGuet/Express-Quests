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
  let sql = 'select * from movies';
  const sqlValues = [];
  if (req.query.color != null) {
    sql += ' where color =?';
    sqlValues.push(req.query.color);
  }
  if (req.query.max_duration != null) {
    sql += ' where duration <= ?';
    sqlValues.push(parseInt(req.query.max_duration));
  }
  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from');
    });
  console.log(req.query);
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
  let sql = 'Select * from users';
  const sqlValues = [];
  if (req.query.language != null) {
    sql += ' where language =?';
    sqlValues.push(req.query.language);
    if (req.query.city != null) {
      sql += ' and city =?';
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += ' where city = ?';
    sqlValues.push(req.query.city);
  }

  database.query(sql, sqlValues).then(([users]) => {
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

const updateMovie = (req, res) => {
  const Id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      'update movies set title = ?, director = ?, year = ?, color = ? , duration = ? where id=?',
      [title, director, year, color, duration, Id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the movie');
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      'UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id=?',
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error editing the user');
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query('delete from movies where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting the movie');
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('delete from users where id=?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error deleting the element');
    });
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser,
};
