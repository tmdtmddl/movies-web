import { TMDBMovieDetail } from "@/types/tmdb";

export const saveAgent = (agent: string) => {
  localStorage.setItem("agent", agent);
};

export const getAgent = () => {
  const data = localStorage.getItem("agent");
  return data;
};

export const removeAgent = () => {
  localStorage.removeItem("agent");
};

export const saveMovie = (movie: TMDBMovieDetail) => {
  const data = localStorage.getItem("movies");
  if (data) {
    const movies = JSON.parse(data) as TMDBMovieDetail[];
    const found = movies.find((item) => item.id === movie.id);
    if (!found) {
      localStorage.setItem("movies", JSON.stringify([...movies, movie]));
    }
  } else {
    localStorage.setItem("movies", JSON.stringify([movie]));
  }
};

export const fetchMyMovies = () => {
  const data = localStorage.getItem("movies");
  if (!data) {
    return [];
  }
  const movies = JSON.parse(data) as TMDBMovieDetail[];
  return movies;
};
