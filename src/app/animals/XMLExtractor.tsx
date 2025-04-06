"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import RootLoading from "../loading";
import Image from "next/image";

// const Fn = (data: string) =>{}
// Fn('asdfasdfsd')
// <Fn data={'asdfadsfasd'} />

interface Animal {
  adoptionStatusCd: string;
  age: string;
  animalSeq: string;
  classification: string;
  fileNm: string;
  filePath: string;
  foundPlace: string;
  gender: string;
  gu: string;
  hairColor: string;
  hitCnt: string;
  memo: string;
  modDtTm: string;
  noticeDate?: string;
  regDtTm: string;
  regId: string;
  rescueDate: string;
  species: string;
  weight: string;
}
const XMLExtractor = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  const { isPending, error, hasNextPage, fetchNextPage, data } =
    useInfiniteQuery({
      queryKey: ["animals", "abandoned animals"],
      initialPageParam: currentPage,
      getNextPageParam: () => {
        if (currentPage < totalPage) {
          return currentPage + 1;
        }
        return undefined;
      },
      queryFn: async ({ pageParam }): Promise<Animal[]> => {
        const res = await fetch(`/api/v0/animals?pageNo=${pageParam}`);

        const animalXml = await res.json();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(animalXml, "text/xml");

        let errorMessage: null | { authMessage: string; message: string } =
          null;

        const message = xmlDoc.getElementsByTagName("errMsg");
        const authMessage = xmlDoc.getElementsByTagName("returnAuthMsg");

        if (message.length > 0 && authMessage.length > 0) {
          errorMessage = {
            message: message[0].textContent!,
            authMessage: authMessage[0].textContent!,
          };
        }

        if (errorMessage) {
          alert(`${errorMessage.message}: ${errorMessage.authMessage}`);
          return [];
        }

        const pageNo = xmlDoc.getElementsByTagName("pageNo")[0].textContent;
        const totalPage =
          xmlDoc.getElementsByTagName("totalPage")[0].textContent;

        setCurrentPage(Number(pageNo));
        setTotalPage(Number(totalPage));

        const items = xmlDoc.getElementsByTagName("items");

        const targets = [
          "adoptionStatusCd",
          "age",
          "animalSeq",
          "classification",
          "fileNm",
          "filePath",
          "foundPlace",
          "gender",
          "gu",
          "hairColor",
          "hitCnt",
          "memo",
          "modDtTm",
          "noticeDate",
          "regDtTm",
          "regId",
          "rescueDate",
          "species",
          "weight",
        ];

        const animals: Animal[] = [];
        for (const item of items) {
          const data: any = {};
          console.log({ data }, 111);

          targets.map((target) => {
            const values = item.getElementsByTagName(target);
            console.log(item, 112);
            console.log(values, 114);
            if (values.length > 0 && values[0].textContent) {
              console.log(values[0].textContent, 116);
              data[target] = values[0].textContent;
            }
          });

          animals.push(data);
          console.log(animals, 123);
        }
        return animals;
      },
    });
  console.log(data?.pages, 124);

  useEffect(() => {
    if (inView && !isPending && hasNextPage) {
      console.log("무한 스크롤 트리거 작동!");
      fetchNextPage();
    }
  }, [inView, isPending, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <RootLoading />;
  }
  if (error || !data) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 p-2.5">
        {data.pages.map((page, pageIndex) => {
          return (
            <React.Fragment key={pageIndex}>
              {page.map((animal, index) => (
                <li key={animal.regId ?? index}>
                  <Image
                    src={`http://www.daejeon.go.kr/${animal.filePath}`}
                    alt={animal.species}
                    width={100}
                    height={100}
                    className="w-full"
                  />
                </li>
              ))}
            </React.Fragment>
          );
        })}
        <li className="border h-25" ref={ref}>
          무한 스크롤 트리거
        </li>
      </ul>
    </div>
  );
};

export default XMLExtractor;
