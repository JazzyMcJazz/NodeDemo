const service = require('./movie-service.js');

module.exports = {
  launch: (app) => {
    getMovies(app), //     GET    /movies
      getMovie(app), //    GET    /movies/{id}
      getTeapot(app), //   GET    /teapot
      postMovie(app), //   POST   /movies
      putMovie(app), //    PUT    /movies/{id}
      patchMovie(app), //  PATCH  /movies/{id}
      deleteMovie(app); // DELETE /movies/{id}
  },
};

const getMovies = (app) => {
  app.get('/movies', (_, res) => {
    res.send(service.getMovies());
  });
};

const getMovie = (app) => {
  app.get('/movies/:id', (req, res) => {
    const movie = service.getMovie(req.params.id);
    if (movie == undefined) res.status(404).send();
    else res.send(movie);
  });
};

const getTeapot = (app) => {
  app.get('/teapot', (_, res) => {
    res.status(418).send(`I'm a Teapot`);
  });
};

const postMovie = (app) => {
  app.post('/movies', (req, res) => {
    const movie = service.postMovie(req.body);
    if (movie == undefined) res.status(400).send();
    else res.status(201).send(movie);
  });
};

const putMovie = (app) => {
  app.put('/movies/:id', (req, res) => {
    req.body.id = Number.parseInt(req.params.id);
    const movie = service.putMovie(req.body);
    if (movie == undefined) res.status(404).send();
    else res.send(movie);
  });
};

const patchMovie = (app) => {
  app.patch('/movies/:id', (req, res) => {
    req.body.id = Number.parseInt(req.params.id);
    const movie = service.putMovie(req.body);
    if (movie == undefined) res.status(404).send();
    else res.send(movie);
  });
};

const deleteMovie = (app) => {
  app.delete('/movies/:id', (req, res) => {
    service.deleteMovie(req.params.id)
      ? res.status(204).send()
      : res.status(404).send();
  });
};
