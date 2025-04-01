// import Image from "next/image";
import { TMDBResponse } from "../types/tmdb";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieSlideItem from "./MovieSlideItem";

const MovieSlide = ({ results }: TMDBResponse) => {
  const options: Settings = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 500,
    infinite: true,
  };
  return (
    <div>
      <h2>{results.length}개의 영화</h2>
      <div>
        <Slider
          {...options}
          className="border h-100 overflow-auto relative m-5"
          nextArrow={
            <button className="absolute top-[50%] right-0 border z-10 translate-y-[50%] cursor-pointer p-1.5 rounded border-gray-200">
              다음
            </button>
          }
          prevArrow={
            <button className="absolute top-[50%] left-0 border z-10 translate-y-[50%] cursor-pointer p-1.5 rounded border-gray-200">
              이전
            </button>
          }
        >
          {results.map((movie) => (
            <MovieSlideItem key={movie.id} {...movie} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MovieSlide;
