import Image from "next/image";
import { TMDBMovie } from "../types/tmdb";
import Link from "next/link";

const MovieSlideItem = (movie: TMDBMovie) => {
  return (
    <Link href={`/${movie.id}`}>
      <div>
        <Image
          alt={movie.title}
          src={`${process.env.NEXT_PUBLIC_TMDB_IMG_URL}/w500${movie.poster_path}`}
          width={180}
          height={320}
          className="w-full"
        />
      </div>
    </Link>
  );
};

export default MovieSlideItem;
