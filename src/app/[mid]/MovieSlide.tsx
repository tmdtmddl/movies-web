"use client";

import { TMDBResponse } from "@/types/tmdb";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieSlideItem from "./MovieSlideItem";
import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const MovieSlide = ({ results }: TMDBResponse) => {
  const options: Settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const slideRef = useRef<Slider>(null);
  return (
    results.length > 0 && (
      <div>
        <div className="relative">
          <button
            onClick={() => slideRef.current?.slickPrev()}
            className="absolute top-[50%] left-0 bg-white border z-10 translate-y-[-50%] cursor-pointer p-1.5 rounded border-gray-200"
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => slideRef.current?.slickNext()}
            className="absolute top-[50%] right-0 bg-white border z-10 translate-y-[-50%] cursor-pointer p-1.5 rounded border-gray-200"
          >
            <IoChevronForward />
          </button>
          <Slider {...options} className="overflow-hidden m-2.5" ref={slideRef}>
            {results.map((movie) => (
              <MovieSlideItem key={movie.id} {...movie} />
            ))}
          </Slider>
        </div>
      </div>
    )
  );
};

export default MovieSlide;
