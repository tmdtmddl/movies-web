"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import RootLoading from "../loading";
import { IoChevronForward } from "react-icons/io5";

interface JusoProps {
  bdMgtSn: string; //!unique id
  roadAddr: string;
  siNm: string;
  sggNm: string;
  rn: string;
  zipNo: string;
}

const Juso = () => {
  const [keyword, setKeyword] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [juso, setJuso] = useState<JusoProps | null>(null);
  const [rest, setRest] = useState("");
  const [items, setItems] = useState<JusoProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const keywordRef = useRef<HTMLInputElement>(null);
  const restRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("입력");
        return keywordRef.current?.focus();
      }
      startTransition(async () => {
        const res = await fetch(`/api/v0/test/juso?pageNo=${pageNo}`, {
          method: "POST",
          body: JSON.stringify(keyword),
        });
        const data = await res.json();

        try {
          setIsShowing(true);
          setTotalCount(data.totalCount);
          setItems(data.items);
          console.log(data.items);
        } catch (error: any) {
          console.log(error.message);
        }
      });
    },
    [keyword, juso, rest]
  );

  const onSaveJuso = useCallback(() => {
    if (!juso) {
      if (items.length === 0) {
        alert("주소검색");
        setKeyword("");
        setIsShowing(false);
        return keywordRef.current?.focus();
      }
      alert("주소 선택");
      return setIsShowing(true);
    }
    if (rest.length === 0) {
      alert("나머지주소");
      return restRef.current?.focus();
    }
    if (
      confirm(
        `입력하신 주소가 ${juso.roadAddr},${rest},우편번호 ${juso.zipNo}가 맞으신가요?`
      )
    ) {
      alert("주소저장");
      return restRef.current?.focus();
    }
  }, []);

  return (
    <div className="max-w-100 mx-auto ">
      {isPending && <RootLoading />}
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(currentPage);
        }}
        className="mt-5 max-w-100 mx-auto"
      >
        <div className="flex gap-x-2.5">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            ref={keywordRef}
            className={input}
            id="keyword"
          />
          <button className={twMerge("text-2xl items-center px-2.5", btn)}>
            <AiOutlineSearch />
          </button>
        </div>
      </form>
      {items?.length > 0 && (
        <button
          onClick={() => setIsShowing((prev) => !prev)}
          className={twMerge(
            btn,
            "px-2.5 size-auto gap-x-2.5 pv-1 mt-5 mb-2.5"
          )}
        >
          {isShowing ? "접기" : "펼치기"}
        </button>
      )}
      {isShowing &&
        (items?.length > 0 ? (
          <div>
            <ul className="flex flex-col gap-y-2.5  mt-2.5 mx-auto max-w-75">
              {items?.map((item) => (
                <li key={item.bdMgtSn}>
                  <button onClick={() => setJuso(item)}>{item.roadAddr}</button>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2.5 mt-2.5 mx-auto max-w-75">
              {currentPage !== 1 && (
                <li>
                  <button
                    onClick={() => {
                      let copy = currentPage;
                      if (copy > 0) {
                        copy--;
                      }
                      onSubmit(copy);
                      setCurrentPage(copy);
                    }}
                  >
                    <IoChevronForward />
                  </button>
                </li>
              )}
              {Array.from({ length: Math.ceil(totalCount / 20) }).map(
                (_, index) => {
                  const selected = currentPage === index + 1;
                  const li = (
                    <li key={index}>
                      <button
                        className={twMerge(btn)}
                        onClick={() => {
                          setCurrentPage(index + 1);
                          onSubmit(index + 1);
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  );

                  const length = 5;
                  const arr = Array.from({ length });
                  //currentpage === 1 왼쪽에 숫자 없음, 오른쪽에 2,4
                  // currentpage === 2 1,3,4
                  //3 1,2,4,5
                  //4 1,2,4,5,6
                  //25 1,23,24,26,27,28
                  //26 1,24,25,27,28
                  //27 => 1,25,26,28
                  //28 =>1,26,27,28

                  const totalLength = Math.ceil(totalCount / 20) - 1;
                  // const min = currentPage > ?currentPage -2
                  const items: number[] = [];
                  arr.map((_, i) => {
                    //! i =0 or 1
                    let res = -1;
                    if (i === 2) {
                      res = -1;
                    } else {
                      res = currentPage + i - 2;
                    }
                    if (res >= 0 && res <= totalLength) {
                      items.push(res);
                    }
                  });
                  console.log(items);
                  if (
                    index === 0 ||
                    index + 1 === totalLength ||
                    index + 1 === currentPage ||
                    items.find((item) => item === index + 1)
                  ) {
                    return li;
                  }
                  return null;
                }
              )}

              {Math.ceil(totalCount / 20) !== currentPage && (
                <li>
                  <button
                    onClick={() => {
                      let copy = currentPage;
                      if (copy < Math.ceil(totalCount / 20)) {
                        copy++;
                      }
                      onSubmit(copy);
                      setCurrentPage(copy);
                    }}
                  >
                    <IoChevronForward />
                  </button>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <label htmlFor="keyword">해당검색어로된 주소가 존재하지 않음</label>
        ))}
      {juso && (
        <form
          className="flex flex-col gap-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSaveJuso();
          }}
        >
          <div>
            <label
              htmlFor="keyword"
              className={twMerge("flex items-center flex-1", input)}
            >
              {juso.roadAddr}
            </label>
            <label
              htmlFor="keyword"
              className={twMerge("flex items-center w-auto", input)}
            >
              {juso.zipNo}
            </label>
          </div>
          <div className="flex gap-x-2.5">
            <input
              type="text"
              value={rest}
              onChange={(e) => setRest(e.target.value)}
              className={twMerge(input)}
              placeholder="나머지 주소 "
              ref={restRef}
            />
            <button>저장</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Juso;
const input =
  "border border-gray-200 bg-gray-50  outline-none focus:border-sky-500 h-12 rounded px-2.5 w-full";

const btn = "rounded cursor-pointer bg-sky-500 text-white flex  ";
