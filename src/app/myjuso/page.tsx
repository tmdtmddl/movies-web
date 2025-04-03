"use client";

import { useCallback, useState, useTransition } from "react";

//Todo
// 1. api/v1/juso/route.ts
// 2. juso검색 기능 구현
// 2-1. keyword,pageNo//currentPage->dynamic 받아와서 구현
// 2-2. client에서 키워드와 커런트페이지를 어떻게 전달할지에 대한 전략을 수립
//! a. post method 로 전달,body => keyword 넣기
//! b. searchParams로 전달, ? 이름=값
// 3.주소 검색창구현
// 4.받아온 주소들 map으로 구현
// 5.pagination 구현
// 6.나머지 주소 입력 구현
interface JusoProps {
  bdMgtSn: string;
  roadAddr: string;
  siNm: string;
  sggNm: string;
  rn: string;
  zipNo: string;
}
const MyJusoPage = () => {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<JusoProps[]>([]);
  const [juso, setJuso] = useState<JusoProps | null>(null);
  const [isPending, startTransition] = useTransition();
  const onSubmit = useCallback(() => {
    startTransition(async () => {
      const res = await fetch(`/api/v1/juso`, {
        method: "POST",
        body: JSON.stringify({ keyword }),
      });
      const data = (await res).json();
      console.log(data);
    });
  }, []);
  return (
    <div className="mt-5">
      {/* <ul>
        {items.map((item, index) => (
          <li key={index}>{item.roadAddr}</li>
        ))}
      </ul> */}
      <form
        action=""
        className="flex max-w-80 mx-auto gap-x-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border h-10 rounded p-2"
          placeholder="주소를 입력해주세요."
        />
        <button className="bg-amber-300 p-2 rounded">검색</button>
      </form>

      <ul>
        {items?.map((item) => (
          <li key={item.bdMgtSn}>
            <button
              onClick={() => {
                setJuso(item);
              }}
            >
              {item.roadAddr}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyJusoPage;
