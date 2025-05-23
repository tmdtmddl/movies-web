// "use client";

// import React, { useCallback, useEffect, useState, useTransition } from "react";
// import WildItemPage from "../wildItem/page";
// import RootLoading from "@/app/loading";
// import Pagination from "react-js-pagination";
// import "./pagination.css";

// export interface WildProps {
//   capt_de: string;
//   capt_plce_adrs: string;
//   data_stdr_de: string;
//   rward_pymt_amnt: number;
//   rward_pymt_de: string;
//   sn: number;
//   wdbr_co: number;
//   wtdr_co: number;
// }

// const WildHomePage = () => {
//   const [wilds, setWilds] = useState<WildProps[]>([]);

//   const [page, setPage] = useState<number>(1); //현재 페이지 번호
//   const postPerPage = 5; //페이지당 게시글 개수
//   const indexOfLastPost = page * postPerPage; //마지막 인덱스
//   const indexOfFirstPost = indexOfLastPost - postPerPage; //처음인덱스
//   const wildLength = wilds.length;

//   const handlePageChange = (page: number) => {
//     setPage(page);
//   };

//   const [isPending, startTransition] = useTransition();
//   const fetchWilds = useCallback(() => {
//     startTransition(async () => {
//       const res = await fetch(`/api/v1/wild`, {
//         method: "POST",
//         body: JSON.stringify(wilds),
//       });

//       const data = await res.json();
//       console.log(data);
//       setWilds(data.items ?? []);
//     });
//   }, []);

//   useEffect(() => {
//     fetchWilds();
//   }, [fetchWilds]);

//   return (
//     <div className="flex flex-col gap-y-2.5">
//       {isPending && <RootLoading />}
//       <div className="bg-lime-600 p-2.5 flex flex-col items-center shadow-xl">
//         <p className="font-bold text-xl ">대전광역시 서구</p>
//         <p className="font-bold text-xl">유해야생동물 포획 현황</p>
//       </div>
//       <div className="mt-2.5 max-w-130 mx-auto">
//         <ul className="flex flex-col gap-y-2.5">
//           {/* 맵을 slice를 이용해서 현재 페이지에나올것만 보여주기 */}
//           {wilds.slice(indexOfFirstPost, indexOfLastPost).map((wild) => (
//             <li
//               key={wild.sn}
//               className="border-3 border-gray-400 bg-lime-50 rounded hover:border-green-800 hover:shadow-xl"
//             >
//               <WildItemPage {...wild} />
//             </li>
//           ))}
//         </ul>
//       </div>

//       <Pagination
//         activePage={page} //현재페이지
//         itemsCountPerPage={postPerPage} //한페이지랑 보여줄 아이템 갯수
//         totalItemsCount={wildLength} //총 아이템갯수
//         pageRangeDisplayed={5} //paginator의 페이지 범위
//         prevPageText={"<"} //이전을 나타낼 텍스트
//         nextPageText={">"} //다음을 나타낼 텍스트
//         onChange={handlePageChange} //페이지변경을 핸들링하는 함수
//         //Pagination 컴포넌트는 사용자가 페이지 번호를 클릭할 때마다, 그 클릭된 페이지 번호를 onChange 핸들러 함수에 인수로 전달합니다.
//       />
//     </div>
//   );
// };

// export default WildHomePage;
