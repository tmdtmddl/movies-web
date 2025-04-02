import { TMDBResponse } from "@/types/tmdb";
import ReadMore from "./ReadMore";

const fetchMovies = async (): Promise<TMDBResponse> => {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/v0/tmdb`;
  try {
    const res = await fetch(url);
    console.log(res, 10);
    if (!res.ok) {
    }
    const data = await res.json();
    if (data.status_code && !data.success) {
      console.log(data, 14);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    return data as TMDBResponse;
  } catch (error: any) {
    console.log(error.message);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

const Home = async () => {
  const movies = await fetchMovies();
  return <ReadMore {...movies} />;
};

export default Home;
