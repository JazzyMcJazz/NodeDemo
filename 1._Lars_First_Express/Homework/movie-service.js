const repo = require('./movie-repository.js');
const Movie = require('./movie.js');

module.exports = {
  getMovies: () => getMovies(),
  getMovie: (id) => getMovie(id),
  postMovie: (movie) => postMovie(movie),
  putMovie: (movie) => putMovie(movie),
  patchMovie: (movie) => patchMovie(movie),
  deleteMovie: (id) => deleteMovie(id),
};

const getMovies = () => {
  return repo.movies;
};

const getMovie = (id) => {
  return repo.movies.find((movie) => movie.id == id);
};

const postMovie = (movie) => {
  if (movie.title == undefined || movie.year == undefined) return;
  return repo.add(movie);
};

const putMovie = (movie) => {
  return repo.put(movie);
};

// copy of putMovie, because I couldn't be bothered writing individual logic.
const patchMovie = (movie) => {
  return repo.patch(movie);
};

const deleteMovie = (id) => {
  return repo.deleteMovie(id);
};

// add sample data
addSampleData();
function addSampleData() {
  const movies = [
    {
      title: 'Ironman',
      year: 2008,
    },
    {
      title: 'Avengers: Infinity War',
      year: 2018,
    },
  ];

  postMovie(movies[0]);
  postMovie(movies[1]);
}
