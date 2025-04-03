"use client";
import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import RootLoading from "../loading";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
} from "react-icons/io5";

interface JusoProps {
  bdMgtSn: string; //! unique id
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [items, setItems] = useState<JusoProps[]>([]);

  const keywordRef = useRef<HTMLInputElement>(null);
  const restRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("검색어를 입력해주세요.");
        return keywordRef.current?.focus();
      }
      startTransition(async () => {
        const res = await fetch(`/api/v0/test/juso?pageNo=${pageNo}`, {
          method: "POST",
          body: JSON.stringify(keyword),
        });

        try {
          const data = await res.json();
          setIsShowing(true);
          setTotalCount(data.totalCount);
          setItems(data.items);
        } catch (error: any) {
          console.log(error);
        }
      });
    },
    [keyword, juso]
  );

  const onSaveJuso = useCallback(() => {
    if (!juso) {
      if (items.length === 0) {
        alert("주소를 검색해주세요.");
        setKeyword("");
        setIsShowing(false);
        return keywordRef.current?.focus();
      }
      alert("주소를 선택해주세요.");
      return setIsShowing(true);
    }
    if (rest.length === 0) {
      alert("나머지 주소를 입력해주세요.");
      return restRef.current?.focus();
    }

    if (
      confirm(
        `입력하신 주소가 ${juso.roadAddr}, ${rest}, 우편번호 ${juso.zipNo}가 맞으신가요?`
      )
    ) {
      return alert("주소를 저장하였습니다.");
    }
    restRef.current?.focus();
  }, [rest, juso, items]);

  return (
    <div className="mt-5 max-w-100 mx-auto">
      {isPending && <RootLoading />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(currentPage);
        }}
        className="max-w-100 mx-auto"
      >
        <div className="flex gap-x-2.5">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="대전 중구 중앙로 121"
            ref={keywordRef}
            className={input}
            id="keyword"
          />
          <button className={twMerge(btn, "text-2xl")}>
            <AiOutlineSearch />
          </button>
        </div>
      </form>

      {items.length > 0 && (
        <button
          onClick={() => setIsShowing((prev) => !prev)}
          className={twMerge(
            btn,
            "px-2.5 size-auto gap-x-2.5 py-1 mt-5 mb-2.5"
          )}
        >
          {!isShowing ? (
            <>
              펼치기
              <IoChevronDown />
            </>
          ) : (
            <>
              접기
              <IoChevronUp />
            </>
          )}
        </button>
      )}
      {isShowing &&
        (items.length > 0 ? (
          <div>
            <ul className="flex flex-col gap-y-2.5">
              {items.map((item) => {
                const selected = item.bdMgtSn === juso?.bdMgtSn;
                return (
                  <li key={item.bdMgtSn} className="flex">
                    <button
                      className={twMerge(
                        "bg-gray-50 p-2.5 cursor-pointer rounded hover:bg-gray-100",
                        selected && "bg-sky-500 text-white hover:bg-sky-400"
                      )}
                      onClick={() => {
                        setJuso(item);
                        setIsShowing(false);
                        setTimeout(() => restRef.current?.focus(), 100);
                      }}
                    >
                      {item.roadAddr}
                    </button>
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap gap-2.5 my-2.5 justify-center">
              {1 !== currentPage && (
                <li>
                  <button
                    className={twMerge(btn, "size-8")}
                    onClick={() => {
                      let copy = currentPage;
                      if (copy > 0) {
                        copy--;
                      }

                      onSubmit(copy);
                      setCurrentPage(copy);
                    }}
                  >
                    <IoChevronBack />
                  </button>
                </li>
              )}
              {Array.from({ length: Math.ceil(totalCount / 20) }).map(
                (_, index) => {
                  const selected = currentPage === index + 1;
                  const li = (
                    <li key={index}>
                      <button
                        className={twMerge(
                          btn,
                          "size-8 bg-gray-50 hover:bg-gray-100 text-black",
                          selected && "bg-sky-500 text-white hover:bg-sky-400"
                        )}
                        onClick={() => {
                          setCurrentPage(index + 1);
                          onSubmit(index + 1);
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  );

                  const totalLength = Math.ceil(totalCount / 20);
                  const length = 5; // 현재 페이지를 포함 +- 2개씩
                  const arr = Array.from({ length });
                  //! currentPage === 1 왼쪽에 숫자 없음, 오른쪽에 2, 3
                  //! currentpage === 2 1, 3,4
                  //! 3 1,2,4,5
                  //! 4 1,2,3,5,6
                  //! 25 1, 23, 24, 26, 27, 28
                  //! 26 1, 24, 25, 27, 28
                  //! 27 => 1, 25, 26, 28
                  //! 28 => 1, 26, 27, 28

                  const items: number[] = [];
                  arr.map((_, i) => {
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
                    className={twMerge(btn, "size-8")}
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
          <label htmlFor="keyword">
            해당 검색어로 조회된 주소가 존재하지 않습니다.
          </label>
        ))}

      {juso && (
        <form
          className="flex flex-col gap-y-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            onSaveJuso();
          }}
        >
          <div className="flex gap-x-2.5">
            <label
              htmlFor="keyword"
              className={twMerge(input, "flex items-center flex-1")}
            >
              {juso.roadAddr}
            </label>
            <label
              htmlFor="keyword"
              className={twMerge(input, "flex items-center w-auto")}
            >
              {juso.zipNo}
            </label>
          </div>
          <div className="flex gap-x-2.5">
            <input
              value={rest}
              onChange={(e) => setRest(e.target.value)}
              placeholder="나머지 주소"
              className={twMerge(input, "flex-1")}
              ref={restRef}
            />
            <button className={btn}>저장</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Juso;

const input =
  "border border-gray-200 bg-gray-50 outline-none focus:border-sky-500 h-12 rounded focus:bg-transparent px-2.5 w-full";

const btn =
  "rounded cursor-pointer bg-sky-500 text-white flex justify-center items-center size-12";
