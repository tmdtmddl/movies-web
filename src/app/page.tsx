import { TMDBRESPONSE, TMDBResponse } from "@/types/tmdb";
import Link from "next/link";
import ReadMore from "./ReadMore";

const fetchMovies = async (): Promise<TMDBResponse> => {
  console.log(process.env.NEXT_PUBLIC_URL, 6);
  const url = `${process.env.NEXT_PUBLIC_URL}/api/v0/tmdb`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
    }
    const data = await res.json();
    if (data.status_code && !data.success) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    return data as TMDBResponse;
  } catch (error: any) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

const Home = async () => {
  const movies = await fetchMovies();
  return <ReadMore {...movies} />;
};

export default Home;
