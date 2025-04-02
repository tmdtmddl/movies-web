import { TMDBMovie } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MovieSlideItem = (movie: TMDBMovie) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="mx-2.5 overflow-hidden rounded-x relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        alt={movie.title}
        src={`${process.env.NEXT_PUBLIC_TMDB_IMG_URL}/w500${movie.poster_path}`}
        width={100}
        height={100}
        className="w-full"
      />
      {isHovering && (
        <Link
          href={`${movie.id}`}
          className="absolute bottom-0 left-0 w-full h-[50%] bg-black/50 text-white "
        >
          <p>{movie.title}</p>
        </Link>
      )}
    </div>
  );
};

export default MovieSlideItem;
