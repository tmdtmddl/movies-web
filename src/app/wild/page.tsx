"use client";

import { useRouter } from "next/navigation";
import { GiBoarTusks, GiDeerHead, GiDeerTrack } from "react-icons/gi";
import { useTransition } from "react";
import RootLoading from "../loading";
import { twMerge } from "tailwind-merge";

const WildPage = () => {
  const navi = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-lime-700 h-screen relative ">
      {isPending && <RootLoading />}
      <div className="relative top-[40%]  ">
        <button
          onClick={() => navi.push("/wild/wId")}
          className="flex flex-col cursor-pointer flex-1 p-5 w-full  relative bg-white min-w-80 max-w-100 mx-auto  rounded  items-center  border-2 border-teal-950 hover:shadow-md hover:shadow-green-800 hover:border-teal-800 "
        >
          <p className="font-bold text-3xl  hover:text-teal-800">
            유해야생동물 포획 현황
          </p>

          <div className="text-7xl -rotate-12 absolute top-[-90%] right-95  ">
            <GiBoarTusks />
          </div>

          <div className="text-7xl rotate-12 absolute top-[85px] left-90 ">
            <GiDeerHead />
          </div>
        </button>
      </div>

      <div className="text-3xl relative top-100">
        <GiDeerTrack className={twMerge(icons, "left-18")} />
        <GiDeerTrack className={twMerge(icons, "top-10 left-10")} />
        <GiDeerTrack className={twMerge(icons, "top-20 left-3")} />
      </div>
      <div className="text-3xl  ">
        <GiDeerTrack className={twMerge(icons, "top-2 right-5")} />
        <GiDeerTrack className={twMerge(icons, "top-10  right-15")} />
        <GiDeerTrack className={twMerge(icons, "top-20  right-25")} />
      </div>
    </div>
  );
};

export default WildPage;

const icons = "absolute rotate-12";
