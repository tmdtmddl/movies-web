"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
//무한 스크롤에서 "화면에 이 엘리먼트가 보여지면" 을 감지하는 훅이야.
//ref랑 inView를 주는 함수
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
  //페이지 상태값 관리
  const [currentPage, setCurrentPage] = useState(1);
  //currentPage: 지금 몇 번째 페이지인지 저장(지금 몇 페이지 보고 있는지 상태로 관리해. 기본값은 1페이지.)
  const [totalPage, setTotalPage] = useState(0);
  //totalPage: 총 몇 페이지까지 있는지 저장. 처음엔 0.

  const { ref, inView } = useInView({
    threshold: 0.75,
  });
  //어떤 요소가 화면의 75% 이상 보이면 inView가 true가 됨.
  //ref는 그 요소에 달아주는 거임.(ref를 어떤 태그에 붙이면,화면에 75% 정도 보일 때 inView가 true로 바뀜.)

  //데이터를 페이지별로 불러오는 도구.
  const { isPending, error, hasNextPage, fetchNextPage, data } =
    //fetchNextPage: 다음 페이지 불러오기,hasNextPage: 다음 페이지가 있는지,data.pages: 지금까지 불러온 모든 페이지 데이터
    useInfiniteQuery({
      queryKey: ["animals", "abandoned animals"],
      //쿼리의 고유 이름이야. 캐시 관리에 사용돼.
      initialPageParam: currentPage,
      // 첫 페이지는 1로 시작하겠다는 뜻

      //다음 페이지 번호를 정해줘.현재 페이지가 전체 페이지보다 작을 때만 다음 페이지로 넘겨줌.
      getNextPageParam: () => {
        //다음 페이지 있을 때만 다음 페이지 번호를 넘김.없으면 undefined로 끝냄.
        if (currentPage < totalPage) {
          return currentPage + 1;
        }
        return undefined;
      },

      //실제 데이터 가져오는 함수
      queryFn: async ({ pageParam }): Promise<Animal[]> => {
        //pageParam은 몇 번째 페이지인지 알려주는 값.
        //1) 페이지 데이터 가져오기
        const res = await fetch(`/api/v0/animals?pageNo=${pageParam}`);
        //fetch로 XML 형태의 데이터를 가져옴.(/api/v0/animals 주소로 데이터를 요청. pageNo=2 이런 식으로 페이지 넘겨줌)
        const animalXml = await res.json();
        //백엔드에서 xml을 문자열로 주니까 .json()으로 받는 거야.
        //응답 받은 걸 JSON으로 변환. (XML이긴 한데 여기선 JSON 포장일 수 있음)

        //2) XML을 파싱해서 JS로 바꾸기
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(animalXml, "text/xml");
        //DOMParser로 문자열(XML) → JavaScript 객체(XML 문서 객체) 로 바꿔.
        //진짜 XML 데이터면 이걸로 HTML처럼 읽을 수 있는 문서로 바꿔줘.

        //3) 에러 메시지 체크
        //에러 메시지 담을 변수야. 처음엔 null로 시작.
        let errorMessage: null | { authMessage: string; message: string } =
          null;
        const message = xmlDoc.getElementsByTagName("errMsg");
        const authMessage = xmlDoc.getElementsByTagName("returnAuthMsg");
        //XML 안에서 <errMsg>, <returnAuthMsg> 태그를 찾음

        // 에러 메시지 있으면 errorMessage에 담아줘.
        if (message.length > 0 && authMessage.length > 0) {
          errorMessage = {
            message: message[0].textContent!,
            authMessage: authMessage[0].textContent!,
          };
        }
        //에러 있으면 경고창 띄우고 빈 배열 반환
        if (errorMessage) {
          alert(`${errorMessage.message}: ${errorMessage.authMessage}`);
          return [];
        } //에러가 있는지 확인.둘 중 하나라도 있으면 alert 띄우고 빈 배열 반환.

        //4) 페이지 정보 가져오기
        //현재 페이지와 전체 페이지를 XML에서 꺼내옴.
        const pageNo = xmlDoc.getElementsByTagName("pageNo")[0].textContent;
        const totalPage =
          xmlDoc.getElementsByTagName("totalPage")[0].textContent;

        setCurrentPage(Number(pageNo));
        setTotalPage(Number(totalPage));
        //현재 페이지와 총 페이지 수를 XML에서 꺼내와서 state에 저장.(상태 업데이트)

        //5) 동물 데이터 꺼내오기
        //동물 한 마리씩 담긴 <items> 태그들 찾기.
        const items = xmlDoc.getElementsByTagName("items");

        //동물 정보 중에서 뽑고 싶은 항목들을 미리 배열로 저장.예: "age", "gender", "filePath"
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

        //최종적으로 저장할 동물 리스트!
        const animals: Animal[] = [];
        //동물 하나씩 돌면서 빈 객체 data 만들고,
        for (const item of items) {
          const data: any = {};
          //data는 빈 객체로, 각 item에서 특정 데이터를 추출해서 넣기 위한 컨테이너 역할을 합니다.
          console.log({ data }, 111);
          //target 이름을 하나씩 꺼내서 XML에서 그 태그 값을 찾고, 있으면 data[target]에 넣음.
          // 예:target = "age" → <age>3살</age> → data["age"] = "3살"
          targets.map((target) => {
            //target은 targets 배열의 각 항목으로, 예를 들어 "age", "name", "species" 등의 문자열이 될 수 있습니다.(target: target은 targets 배열에 있는 각 문자열 값을 가리킵니다. 예를 들어, "age" 또는 "name" 같은 값이 될 수 있습니다.)
            const values = item.getElementsByTagName(target);
            console.log(item, 112);
            console.log(values, 114);
            if (values.length > 0 && values[0].textContent) {
              console.log(values[0].textContent, 116);
              // data는 객체이고, target은 그 객체의 동적 키로 사용됩니다. 즉, data 객체에서 target 값을 키로 사용하여 해당하는 값을 설정하는 방식입니다.
              data[target] = values[0].textContent;
              //item.getElementsByTagName(target)을 통해 item(XML 요소)에서 target 태그의 값을 찾아옵니다. values는 해당 태그들을 배열로 반환하며, 그 배열의 첫 번째 요소(values[0])의 텍스트 내용(textContent)을 가져옵니다.
            }
          });
          //다 끝나면 하나의 data를 animals 배열에 넣어줌.
          animals.push(data);
          console.log(animals, 123);
        }
        //최종적으로 animals를 반환!
        return animals;
      },
    });
  console.log(data?.pages, 124);
  //items 안에 들어 있는 각 동물에서 targets 리스트에 있는 속성들만 꺼내서 data[target] = 값 형태로 저장. 이걸 animals 배열에 추가.

  //스크롤하면 다음 페이지 자동으로 가져오기
  //마지막 요소가 보일 때(inView) 다음 페이지 자동 요청.
  useEffect(() => {
    //ref 붙인 곳이 화면에 보이면(inView),아직 로딩 중 아니고, 다음 페이지도 있으면,fetchNextPage() → 다음 데이터 가져와!
    if (inView && !isPending && hasNextPage) {
      console.log("무한 스크롤 트리거 작동!");
      fetchNextPage();
    }
  }, [inView, isPending, hasNextPage, fetchNextPage]);

  // 로딩 상태 처리
  if (isPending) {
    return <RootLoading />;
  }
  if (error || !data) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 p-2.5">
        {/* 화면에 보여주기 */}
        {data.pages.map((page, pageIndex) => {
          // 각 페이지 안의 동물들을 <li>로 보여줘.
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
                  <p>{animal.age}</p>
                </li>
              ))}
            </React.Fragment>
          );
        })}
        {/* 마지막 li가 무한 스크롤 트리거 (이 li가 보이면 다음 페이지 요청됨!)*/}
        {/* 마지막 <li ref={ref}> 이게 화면에 보이면 → 다음 페이지 불러오는 트리거 역할 */}
        <li className="border h-25" ref={ref}>
          무한 스크롤 트리거
        </li>
      </ul>
    </div>
  );
};

export default XMLExtractor;
