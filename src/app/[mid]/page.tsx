import {
  PageProps,
  TMDBMovieDetail,
  tmdbOptions,
  TMDBResponse,
} from "@/types/tmdb";
import Image from "next/image";
import MovieSlide from "./MovieSlide";

const fetchMovie = async (
  props: PageProps<{ mid: string }>
): Promise<TMDBMovieDetail> => {
  const { mid } = await props.params;
  const url = `https://api.themoviedb.org/3/movie/${mid}?language=en-US`;

  const res = await fetch(url, tmdbOptions());
  const data = (await res.json()) as TMDBMovieDetail;

  return data;
};

const fetchSimilarMovies = async (
  props: PageProps<{ mid: string }>
): Promise<TMDBResponse> => {
  const { mid } = await props.params;
  const url = `https://api.themoviedb.org/3/movie/${mid}/similar?language=en-US&page=1`;

  const res = await fetch(url, tmdbOptions());
  const data = await res.json();

  return data;
};

const MovieIdPage = async (props: PageProps<{ mid: string }>) => {
  const movie = await fetchMovie(props);
  const response = await fetchSimilarMovies(props);
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <Image
            alt={movie.title}
            src={`${process.env.TMDB_IMG_URL}/w500${movie.backdrop_path}`}
            width={100}
            height={100}
            className="w-full"
          />
        </div>
        <div className="p-5 flex flex-col gap-y-2.5 flex-1">
          <div>
            {movie.adult && <p className="text-red-500">19금</p>}
            <h1 className="font-semibold">
              {movie.title} <span>{movie.origin_country}</span>
            </h1>
            {movie.title !== movie.original_title && (
              <p className="text-gray-500 text-xs">{movie.original_title}</p>
            )}
            <p className="text-gray-500 text-xs">{movie.release_date}</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="bg-gray-50 rounded-md p-2 py-1 hover:bg-gray-100 text-sm"
              >
                {genre.name}
              </li>
            ))}
          </ul>
          <div>
            <p>{movie.overview}</p>
          </div>
          <div>
            <p>{movie.popularity}</p>
            <p>{movie.vote_count}명이 투표함</p>
            <div className="flex gap-x-2.5 items-center">
              <div className="flex-1 h-4 rounded-full bg-yellow-50 flex flex-col justify-center px-1">
                <span
                  className="block h-2 rounded-full bg-yellow-200"
                  style={{
                    width: `${(movie.vote_average / 10) * 100}%`,
                  }}
                />
              </div>
              <p>{movie.vote_average}점</p>
            </div>
          </div>
        </div>
      </div>

      <MovieSlide {...response} />
    </>
  );
};

export default MovieIdPage;