import React from "react";
import { WildProps } from "../wId/page";
import { PageProps } from "@/types/tmdb";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { GiBoarTusks, GiDeerHead } from "react-icons/gi";

//data를 가져오는 함수
const fetchWild = async (
  props: PageProps<{ sn: string }>
  //PageProps<{ sn: string }>는 params.sn을 받을 거라는 타입 명시
  //next.js에서는 동적라우팅을 할때 params라는 이름의 객체로 폴더명을 키로 그값을 받아오기 때문
): Promise<WildProps | null> => {
  // console.log(props);
  const { sn } = await props.params; //?
  //props는 객체고, 그 안에 params라는 필드가 있다는 뜻
  //예)props = { params: {sn: string; // ← URL에서 받아온 값 (예: /wild/3 이면 "3")}}
  //sn을 가지고 쓸 때가 있어서 비구조할당으로 꺼내옴 (url에 있는 sn의값이필요해서)

  // console.log(sn, 17);

  const url = `https://www.seogu.go.kr/seoguAPI/3660000/getHrflAnimalCapt?pageNo=1&numOfRows=100&type=json`;
  // 요청할 주소를 만든 거임.(pageNo=1 → 1페이지,numOfRows=20 → 20개 가져와(한페이지에 20개 씩가져와)) [어디에 요청 보낼지 주소 만들기]
  const res = await fetch(url);
  //url에 요청 보내고 응답(res) 받는 거임,fetch()는 "데이터 가져와!" 라는 명령임[	해당 주소에 요청 보내기]
  const data = await res.json();
  //res 안에 있는 JSON 데이터를 실제 JS 객체로 바꿔주는 작업,.json()은 응답을 읽어서 JavaScript 객체로 변환해줌 [응답 받은 데이터를 JavaScript 객체로 변환하기]
  // console.log(data);

  const items: WildProps[] = data?.response?.body?.items ?? [];
  //item은 wildProps타입의 배열인데 data의 items이 없다면 빈 배열을 보여주고
  console.log(items, 32);

  const wild =
    items.find((item) => {
      return item.sn === Number(sn);
      // console.log(item.sn, 37);
      // console.log(sn, 38);
    }) ?? null;
  //items에서 item으로 find를 해서 sn이랑비교해서 맞는게 없으면 null이고 있으면 wild에 저장함

  console.log(sn, 36);
  console.log(wild, 42);

  return wild;
  //딱맞는 데이터 하나를 반환
};

//데어터를 받아서 보여주는 곳
const WildDtailPage = async (props: PageProps<{ sn: string }>) => {
  // console.log(props, 37);
  const wild = await fetchWild(props);
  //fetchWild 함수가 props.params.sn을 꺼내서 데이터를 찾을 수 있음(안넘겨주면 못찾음)
  // console.log(wild, 39);
  // const navi = useRouter();

  return (
    <div>
      <div className="bg-lime-600 p-2.5 flex flex-col items-center shadow-xl">
        <p className="font-bold text-xl ">대전광역시 서구</p>
        <p className="font-bold text-xl">유해야생동물 포획 현황</p>
      </div>
      <Link
        href={"/wild/wId"}
        className="flex gap-x-1  items-center text-lg font-bold p-2.5"
      >
        <IoIosArrowBack />
        뒤로가기
      </Link>

      <div className=" pl-10 pr-80 py-25 bg-lime-50 max-w-150 min-w-135 border-3 border-green-900  mx-auto rounded mb-2.5  relative min-h-screen">
        <div className="flex flex-col items-start gap-y-5">
          <p>
            <b className={fontSize}>순번</b>:{wild?.sn}
          </p>
          <p>
            <b className={fontSize}>포획일자</b>:{wild?.capt_de}
          </p>
          <p>
            <b className={fontSize}>포획장소</b>:{wild?.capt_plce_adrs}
          </p>
          <p>
            <b className={fontSize}>멧돼지수</b>:{wild?.wdbr_co}
          </p>
          <p>
            <b className={fontSize}>고라니수</b>:{wild?.wtdr_co}
          </p>
          <p>
            <b className={fontSize}>포상지급액</b>:{wild?.rward_pymt_amnt}
          </p>
          <p>
            <b className={fontSize}>포상지급일자</b>:{wild?.data_stdr_de}
          </p>
        </div>
        <div className="text-6xl flex  absolute bottom-5 right-5 gap-x-2.5">
          <GiBoarTusks />
          <GiDeerHead />
        </div>
      </div>
    </div>
  );
};

export default WildDtailPage;
const fontSize = "text-lg";
