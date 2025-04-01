import { TMDBMovie } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";

const MovieSlideItem = (movie: TMDBMovie) => {
  return (
    <Link href={`/${movie.id}`}>
      <div className="mx-2.5 overflow-hidden rounded-xl">
        <Image
          alt={movie.title}
          src={`${process.env.NEXT_PUBLIC_TMDB_IMG_URL}/w500${movie.poster_path}`}
          width={100}
          height={100}
          className="w-full"
        />
      </div>
    </Link>
  );
};

export default MovieSlideItem;