"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import RootLoading from "../loading";
import { useInView } from "react-intersection-observer";

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
  const [states, setStates] = useState({
    pageNo: 1,
    totalCount: 0,
    numOfRows: 20,
    totalPage: 0,
  });

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  const { isPending, error, data, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["animals"],
      queryFn: async ({ pageParam }) => {
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
            authMessage: message[0].textContent!,
          };
        }
        if (errorMessage) {
          return alert(`${errorMessage}:${errorMessage.authMessage}`);
        }
        const numOfRows =
          xmlDoc.getElementsByTagName("numOfRows")[0].textContent;

        const pageNo = xmlDoc.getElementsByTagName("pageNo")[0].textContent;

        const totalCount =
          xmlDoc.getElementsByTagName("totalCount")[0].textContent;

        const totalPage =
          xmlDoc.getElementsByTagName("totalPage")[0].textContent;

        setStates({
          numOfRows: Number(numOfRows),
          totalPage: Number(totalPage),
          pageNo: Number(pageNo),
          totalCount: Number(totalCount),
        });

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
        // console.log(items[0]);

        //반복문돌리기전에 껍데기임
        const animals: Animal[] = [];
        for (const item of items) {
          const data: any = {};
          targets.map((target) => {
            const values = item.getElementsByTagName(target);
            if (values.length > 0 && values[0].textContent) {
              data[target] = values[0].textContent;
            }
          });
          animals.push(data); //animals에 data를 푸쉬해줌
        }
        return animals;
      },

      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (states.pageNo < states.totalPage) {
          return states.pageNo + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView && !isPending && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isPending]);

  const [xml, setXml] = useState("");

  const [animals, setAnimals] = useState<Animal[]>([]);

  const onXML = useCallback(() => {
    console.log(xml, typeof xml);
    if (!xml || typeof xml !== "string") {
      return;
    }
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(xml, "text/xml");
    // console.log(xmlDoc);
    // let errorMessage: null | { authMessage: string; message: string } = null;
    // const message = xmlDoc.getElementsByTagName("errMsg");
    // const authMessage = xmlDoc.getElementsByTagName("returnAuthMsg");
    // if (message.length > 0 && authMessage.length > 0) {
    //   errorMessage = {
    //     message: message[0].textContent!,
    //     authMessage: message[0].textContent!,
    //   };
    // }
    // if (errorMessage) {
    //   return [];
    // }
    // const numOfRows = xmlDoc.getElementsByTagName("numOfRows")[0].textContent;

    // const pageNo = xmlDoc.getElementsByTagName("pageNo")[0].textContent;

    // const totalCount = xmlDoc.getElementsByTagName("totalCount")[0].textContent;

    // const totalPage = xmlDoc.getElementsByTagName("totalPage")[0].textContent;

    // setStates({
    //   numOfRows: Number(numOfRows),
    //   totalPage: Number(totalCount),
    //   pageNo: Number(pageNo),
    //   totalCount: Number(totalCount),
    // });

    // const items = xmlDoc.getElementsByTagName("items");

    // const targets = [
    //   "adoptionStatusCd",
    //   "age",
    //   "animalSeq",
    //   "classification",
    //   "fileNm",
    //   "filePath",
    //   "foundPlace",
    //   "gender",
    //   "gu",
    //   "hairColor",
    //   "hitCnt",
    //   "memo",
    //   "modDtTm",
    //   "noticeDate",
    //   "regDtTm",
    //   "regId",
    //   "rescueDate",
    //   "species",
    //   "weight",
    // ];
    // // console.log(items[0]);

    // //반복문돌리기전에 껍데기임
    // const animals: Animal[] = [];
    // for (const item of items) {
    //   const data: any = {};
    //   console.log(data);
    //   targets.map((target) => {
    //     const values = item.getElementsByTagName(target);
    //     if (values.length > 0 && values[0].textContent) {
    //       data[target] = values[0].textContent;
    //     }
    //   });
    //   animals.push(data); //animals에 data를 푸쉬해줌
    // }

    // setAnimals(animals); //setAnimals에 껍데기에 들어가있는 것넣어줌
  }, [xml]);

  if (isPending) {
    return <RootLoading />;
  }
  if (error || !data) {
    return <h1>{error?.message}</h1>;
  }

  return (
    <div>
      {data.pages?.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2.5 p-2.5">
          {data.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page?.map((animal) => (
                <li key={animal.regId}>
                  <Image
                    width={100}
                    height={100}
                    src={`http://www.daejeon.go.kr/${animal.filePath}`}
                    alt={animal.species}
                    className="w-full"
                  />
                  {animal.species}
                  {animal.hairColor}
                  {animal.memo}
                  {animal.rescueDate}
                </li>
              ))}
            </React.Fragment>
          ))}

          <li className="p-10 boreder" ref={ref}>
            fetch more animals
          </li>
        </ul>
      ) : (
        <h1>유기동물 공고 내역이 존재하지 않습니다.</h1>
      )}
    </div>
  );
};

export default XMLExtractor;
