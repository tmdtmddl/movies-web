"use client";
//여기는 프론트엔드 구간

import { useCallback, useRef, useState, useTransition } from "react";
import RootLoading from "../loading";
import { FaSortDown, FaCaretUp } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  bdMgtSn: string; // 아이디로 활용할 것
  roadAddr: string;
  siNm: string;
  sggNm: string;
  rn: string;
  zipNo: string;
}

const MyJusoPage = () => {
  const [keyword, setKeyword] = useState("");
  const [detailaddress, setDetailaddress] = useState("");
  const [items, setItems] = useState<JusoProps[]>([]);
  const [juso, setJuso] = useState<JusoProps | null>(null);
  const [isShowing, setIsShowing] = useState(true);
  const [address, setAddress] = useState("");
  const itemRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const navi = useRouter();
  const onSubmit = useCallback(() => {
    startTransition(async () => {
      const res = await fetch(`/api/v1/juso`, {
        method: "POST",
        body: JSON.stringify(keyword),
      });
      console.log(keyword);
      const data = await res.json();
      console.log({ data });
      setItems(data.items ?? []); //item에 data에서 넘어온걸 담아야 화면에 나옴
      if (data.items.length === 0) {
        alert("주소를 상세히 입력해주세요.");
        return itemRef.current?.focus();
      }
    });
  }, [keyword]);

  const ondeatilJuso = useCallback(() => {
    if (!juso) {
      if (items.length === 0) {
        alert("주소를 먼저 검색해주세요");
        setKeyword("");
        setIsShowing(false);
        return itemRef.current?.focus();
      }
      alert("주소를 선택해주세요");
      return itemRef.current?.focus();
    }
    if (detailaddress.length === 0) {
      alert("상세주소를 입력해주세요.");
      return detailRef.current?.focus();
    }
    if (
      confirm(
        `입력하신주소가 ${juso.roadAddr}${detailaddress}, 우편번호${juso.zipNo}가 맞나요?`
      )
    ) {
      alert("확인되었습니다.");
      return navi.push("/");
    } else {
      return alert("다시확인해주세요.");
    }
  }, [juso, items, detailaddress]);
  return (
    <div className="mt-5 max-w-100 mx-auto flex flex-col gap-y-2.5">
      {isPending && <RootLoading />}
      <form
        action=""
        className="flex max-w-100 mx-auto gap-x-1"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border h-10 rounded p-2 min-w-70 bg-white border-amber-500 focus:border-amber-400"
          placeholder="주소를 ㅇㅇ구까지 입력해주세요."
          id="keyword"
        />
        <button className="bg-amber-300 p-2 rounded">검색</button>
      </form>
      {items.length > 0 && (
        <div>
          <button
            onClick={() => {
              setIsShowing((prev) => !prev);
            }}
            className="border p-1 rounded bg-amber-300 text-gray-600"
          >
            {isShowing ? (
              <div className="flex">
                접기
                <FaCaretUp />
              </div>
            ) : (
              <div className="flex">
                펼치기
                <FaSortDown />
              </div>
            )}
          </button>
        </div>
      )}
      {isShowing && (
        <div>
          <ul className="flex flex-col gap-y-2.5">
            {items.map((item) => {
              return (
                <li key={item.bdMgtSn}>
                  <button
                    className="hover:text-amber-500 hover:border hover:border-amber-700 hover:p-1 hover:rounded-xl cursor-pointer"
                    onClick={() => {
                      setJuso(item);
                      setIsShowing(false);
                      return detailRef.current?.focus();
                    }}
                  >
                    {item.roadAddr}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {juso && (
        <>
          <div className="flex gap-x-2">
            <label
              htmlFor="keyword"
              className="border-2 p-2.5 bg-amber-100 rounded border-amber-400 "
            >
              {juso?.roadAddr}
            </label>
            <label
              htmlFor="keyword"
              className="border-2 p-2.5 bg-amber-100 rounded border-amber-400 "
            >
              {juso?.zipNo}
            </label>
          </div>
          <form
            action=""
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              ondeatilJuso();
            }}
          >
            <label htmlFor="" className="text-md">
              상세주소
            </label>
            <div className="flex gap-x-1">
              <input
                type="text"
                className="border p-1 rounded border-amber-400"
                value={detailaddress}
                onChange={(e) => setDetailaddress(e.target.value)}
                ref={detailRef}
              />
              <button className=" p-1 rounded bg-amber-300">입력</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MyJusoPage;
