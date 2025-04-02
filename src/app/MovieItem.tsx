"use client";
import { TMDBMovie } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";

const MovieItem = (movie: TMDBMovie & { isScrap?: boolean }) => {
  const [isHovering, setIsHovering] = useState(false);

  const content = (
    <div className="rounded-2xl p-2.5 border-gray-200 hover:shadow-md">
      <div className="overflow-hidden rounded-2xl hover:shadow-md hover:opacity-90">
        <Image
          alt={movie.title}
          src={`${process.env.NEXT_PUBLIC_TMDB_IMG_URL}/w500${movie.poster_path}`}
          width={180}
          height={320}
          className="w-full"
        />
      </div>
      <div>
        <div className="flex flex-col gap-y-1 mt-2.5">
          <h2 className="font-semibold">{movie.title}</h2>
          {movie.title !== movie.original_title && (
            <p className="text-gray-500 text-xs">{movie.original_title}</p>
          )}
          <p className="line-clamp-3">{movie.overview}</p>
        </div>
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
  );
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {movie.isScrap && isHovering && (
        <button
          className="size-10 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 flex justify-center items-center absolute top-5 right-5 z-10"
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_URL}/${movie.id}`
            );
            alert("영화 링크를 복사했습니다.");
          }}
        >
          <AiOutlinePaperClip />
        </button>
      )}
      <Link href={`/${movie.id}`}>{content}</Link>
    </div>
  );
};

export default MovieItem;
