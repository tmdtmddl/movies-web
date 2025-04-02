"use client";

import { TMDBMovieDetail } from "@/types/tmdb";
import { fetchMyMovies } from "@/utils";
import { useEffect, useState } from "react";
import MovieItem from "../MovieItem";

const MyPage = () => {
  const [myMovies, setMyMovies] = useState<TMDBMovieDetail[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchedMovies = fetchMyMovies();
      console.log({ fetchedMovies });
      setMyMovies(fetchedMovies);
    }
  }, []);

  return (
    <div>
      <div>
        <h1>내가 스크랩한 영화들</h1>
        {myMovies.length > 0 && (
          <ul className="grid grid-cols-2 gap-5 px-5 sm:grid-cols-3 md:grid-cols-4 max-w-300 mx-auto">
            {myMovies.map((movie) => (
              <MovieItem {...movie} key={movie.id} isScrap />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPage;
