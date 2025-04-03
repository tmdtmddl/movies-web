"use client";
import { twMerge } from "tailwind-merge";
import { useCallback, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import * as Charts from "react-chartjs-2";
Chart.register(...registerables);

interface WProps {
  baseDate: string;
  baseTime: string;
  category: ShortValueTarget;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}
const categories: ShortCategory[] = [
  "강수확률",
  "강수형태",
  "1시간 강수량",
  "습도",
  "1시간 신적설",
  "하늘상태",
  "1시간 기온",
  "일 최저기온",
  "일 최고기온",
  "풍속(동서성분)",
  "풍속(남북성분)",
  "파고",
  "풍향",
  "풍속",
];
const WCom = (props: any | { message: string }) => {
  const [data, setData] = useState(props);

  const [category, setCategory] = useState<ShortCategory>("강수확률");
  const [items, setItems] = useState<WProps[]>([]);

  useEffect(() => {
    if (data.message) {
      alert(data.message);
    } else {
      //! data 가공
      const copy: WProps[] = [];
      data.body.items.item.map((item: WProps) => {
        const found = getShortValue(item.category) === category;
        if (found) {
          copy.push(item);
        }
      });

      console.log(copy);
      setItems(copy);
    }
  }, [data, category]);

  const onTest = useCallback(() => {
    let totalPage = 0;
    totalPage = Math.ceil(data.body.totalCount / data.body.numOfRows);
    const copy: WProps[] = [];
    data.body.items.item.map((item: WProps) => {
      const found = getShortValue(item.category) === category;
      if (found) {
        copy.push(item);
      }
    });

    console.log(copy);
    setItems(copy);
  }, [data, category]);
  return (
    <div className="mt-[1px]">
      <ul className="flex overflow-x-auto">
        {categories.map((cate) => (
          <li key={cate}>
            <button
              onClick={() => setCategory(cate)}
              className={twMerge(
                "min-w-25 border py-2.5 text-center cursor-pointer hover:bg-gray-50",
                cate === category &&
                  "bg-sky-500 text-white border-sky-500 hover:bg-sky-400"
              )}
            >
              {cate}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onTest}>{category}</button>
      {/* <ul>
        {items.map(({ category, fcstValue, baseTime, fcstTime }, index) => (
          <li key={index}>
            [{getShortValue(category)}] - {fcstValue} ({baseTime}/예보시간:
            {fcstTime})
          </li>
        ))}
      </ul> */}
      <Charts.Line
        data={{
          labels: items.map((item) => item.fcstTime),
          datasets: [
            {
              label: category,
              data: items.map((item) => item.fcstValue),
              borderWidth: 1,
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default WCom;

type ShortValueTarget =
  | "POP"
  | "PTY"
  | "PCP"
  | "REH"
  | "SNO"
  | "SKY"
  | "TMP"
  | "TMN"
  | "TMX"
  | "UUU"
  | "VVV"
  | "WAV"
  | "VEC"
  | "WSD";

type ShortCategory =
  | "강수확률"
  | "강수형태"
  | "1시간 강수량"
  | "습도"
  | "1시간 신적설"
  | "하늘상태"
  | "1시간 기온"
  | "일 최저기온"
  | "일 최고기온"
  | "풍속(동서성분)"
  | "풍속(남북성분)"
  | "파고"
  | "풍향"
  | "풍속";

const getShortValue = (target: ShortValueTarget): ShortCategory => {
  switch (target) {
    case "POP":
      return "강수확률";
    case "PTY":
      return "강수형태";
    case "PCP":
      return "1시간 강수량";
    case "REH":
      return "습도";
    case "SNO":
      return "1시간 신적설";
    case "SKY":
      return "하늘상태";
    case "TMP":
      return "1시간 기온";
    case "TMX":
      return "일 최고기온";
    case "TMN":
      return "일 최저기온";
    case "UUU":
      return "풍속(동서성분)";
    case "VVV":
      return "풍속(남북성분)";
    case "WAV":
      return "파고";
    case "VEC":
      return "풍향";
    case "WSD":
      return "풍속";
  }
};

// import { Line } from 'react-chartjs-2';

// <Line
//   datasetIdKey='id'
//   data={{
//     labels: ['Jun', 'Jul', 'Aug'],
//     datasets: [
//       {
//         id: 1,
//         label: '',
//         data: [5, 6, 7],
//       },
//       {
//         id: 2,
//         label: '',
//         data: [3, 2, 1],
//       },
//     ],
//   }}
// />
