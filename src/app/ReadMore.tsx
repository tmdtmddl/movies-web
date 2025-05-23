"use client";

import useObserver from "@/hooks/useObserver";
import { TMDBMovie, tmdbOptions, TMDBResponse } from "@/types/tmdb";
import { useCallback, useEffect, useState } from "react";
import MovieItem from "./MovieItem";
import { useSearchParams } from "next/navigation";

const ReadMore = (movies: TMDBResponse) => {
  const { Wrapper, isInView } = useObserver();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState<TMDBMovie[]>(movies.results);
  const [fetchedMovies, setFetchedMovies] = useState<TMDBMovie[]>([]);
  const fetchMovies = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;

      const res = await fetch(url, tmdbOptions());
      const data = await res.json();
      setFetchedMovies(data.results);
      setPage((prev) => prev + 1);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInView && !isLoading && page < movies.total_pages) {
      fetchMovies(page + 1);
    }
  }, [isInView, movies.total_pages, page, fetchMovies, isLoading]);

  useEffect(() => {
    console.log({ page, fetchedMovies, totalMovies });
  }, [page, fetchedMovies, totalMovies]);

  useEffect(() => {
    if (!isLoading && fetchedMovies.length > 0) {
      setTimeout(() => {
        setTotalMovies((prev) => [...prev, ...fetchedMovies]);
        setFetchedMovies([]);
      }, 1000);
    }
  }, [fetchedMovies, isLoading]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-5 px-5 sm:grid-cols-3 md:grid-cols-4 max-w-300 mx-auto">
        {totalMovies.map((movie) => (
          <li key={movie.title}>
            <MovieItem {...movie} />
          </li>
        ))}
        {fetchedMovies.length > 0 &&
          fetchedMovies.map((movie) => (
            <li key={movie.title}>
              <MovieItem {...movie} />
            </li>
          ))}
        {isLoading && <div className="p-10" />}
      </ul>
      <Wrapper className="p-5 border">
        {isLoading ? "loading..." : "ReadMore"}
      </Wrapper>
    </>
  );
};

export default ReadMore;
