"use client";

import React, { useTransition } from "react";
import { WildProps } from "../wId/page";
import Link from "next/link";
import { GiBoarTusks, GiDeerHead } from "react-icons/gi";
import RootLoading from "@/app/loading";

const WildItemPage = (wild: WildProps) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      {isPending && <RootLoading />}
      <Link href={`/wild/${wild.sn}`}>
        <div className="flex flex-col items-start gap-y-1 pl-2.5 pr-80 py-8 relative ">
          <p>
            <b className={fontSize}>순번</b>:{wild.sn}
          </p>
          <p>
            <b className={fontSize}>포획일자</b>:{wild.capt_de}
          </p>
          <p className="min-w-60">
            <b className={fontSize}>포획장소</b>:{wild.capt_plce_adrs}
          </p>
          <p>
            <b className={fontSize}>멧돼지수</b>:{wild.wdbr_co}
          </p>
          <p>
            <b className={fontSize}>고라니수</b>:{wild.wtdr_co}
          </p>

          <div className="flex text-4xl absolute bottom-1 right-3 gap-x-2.5">
            <GiBoarTusks />
            <GiDeerHead />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WildItemPage;

const fontSize = "text-lg";
