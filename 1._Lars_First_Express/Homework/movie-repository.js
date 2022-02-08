const Movie = require('./movie.js');

let nextId = 1; // id of the next movie to be added. Is incremented each time a movie is added

const movies = []; // the "database"

// adds a movie to the "database" and increments nextId
const add = (movie) => {
  movies.push(new Movie(nextId, movie.title, movie.year));
  const id = nextId++;
  return movies.find((movie) => movie.id == id);
};

const put = (updatedMovie) => {
  const movie = movies.find((m) => m.id == updatedMovie.id);
  if (movie == undefined) return;
  for (const key in movie) {
    if (
      updatedMovie[key] != null &&
      updatedMovie[key] != undefined &&
      updatedMovie[key] != ''
    )
      movie[key] = updatedMovie[key];
  }
  return movie;
};

const patch = (updatedMovie) => {
  const movie = movies.find((m) => m.id == updatedMovie.id);
  if (movie == undefined) return;
  for (const key in movie) {
    if (
      updatedMovie[key] != null &&
      updatedMovie[key] != undefined &&
      updatedMovie[key] != ''
    )
      movie[key] = updatedMovie[key];
  }
  return movie;
};

const deleteMovie = (id) => {
  const movie = movies.find((movie) => movie.id == id);
  if (movie == undefined) return false;
  const index = movies.indexOf(movie);
  return movies.splice(index, 1) != -1;
};

// I wanted this at the top of the file, but that was impossible
// since some properties must be initialized first
module.exports = {
  movies: movies,
  nextId: nextId,
  add: (movie) => add(movie),
  put: (movie) => put(movie),
  patch: (movie) => patch(movie),
  deleteMovie: (id) => deleteMovie(id),
};
