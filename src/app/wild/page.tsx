"use client";

import { useRouter } from "next/navigation";
import { GiBoarTusks, GiDeerHead } from "react-icons/gi";
import Img1 from "../../imgs/foot.png";
import Image from "next/image";
import { useTransition } from "react";
import RootLoading from "../loading";

const WildPage = () => {
  const navi = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-lime-600 w-full h-screen relative border">
      {isPending && <RootLoading />}
      <div className="bg-white min-w-80 max-w-100 mx-auto p-5 rounded flex flex-col items-center relative top-[50%] left-[20px]">
        <button
          onClick={() => navi.push("/wild/wId")}
          className="flex flex-col"
        >
          <p className="font-bold text-3xl">유해야생동물 포획 현황</p>
        </button>

        <div className="text-7xl -rotate-12 absolute bottom-20 right-100">
          <GiBoarTusks />
        </div>
        <div className="text-7xl rotate-12 absolute top-20 left-100 ">
          <GiDeerHead />
        </div>
      </div>

      <div>
        <div className="size-20 absolute bottom-20 rotate-45 left-25">
          <Image src={Img1} alt="foot" />
        </div>
        <div className="size-20 absolute bottom-10 rotate-45 left-10">
          <Image src={Img1} alt="foot" />
        </div>
        <div className="size-20 absolute bottom-0 rotate-45 ">
          <Image src={Img1} alt="foot" />
        </div>
      </div>

      <div>
        <div className="size-20 absolute top-20 rotate-45 right-25">
          <Image src={Img1} alt="foot" />
        </div>
        <div className="size-20 absolute top-10 rotate-45 right-10">
          <Image src={Img1} alt="foot" />
        </div>
        <div className="size-20 absolute top-0 rotate-45 right-0 ">
          <Image src={Img1} alt="foot" />
        </div>
      </div>
    </div>
  );
};

export default WildPage;
