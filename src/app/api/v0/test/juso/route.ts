import response from "@/app/api";
import axios from "axios";

export async function POST(req: Request) {
  const { keyword } = await req.json();
  if (!keyword || keyword.length === 0) {
    // return Response.json(
    //   { message: "키워들 입력해주세요. 최소 2개의 단어 이상을 입력해주세요." },
    //   { status: 500, statusText: "No Keyword sent" }
    // );
    return response.error("최소2단어 이상임");
  }
  const pageNo = new URL(req.url).searchParams.get("pageNo");
  if (!pageNo) {
    return Response.json("페이지넘버.", {
      status: 500,
      statusText: "No page Number",
    });
  }

  const confmKey = process.env.JUSO_API_KEY!;
  const countPerPage = 20;

  // const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${pageNo}&countPerPage=${countPerPage}&keyword=${keyword}`;
  // get(url,)뒤에 params로 적어서 없애도 됨
  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do`;

  // const res = await fetch(url);

  // const data = await res.json();

  // if (data.results.common.errorCode !== "0") {
  //   return response.error(data.results.common.errorMessage, {
  //     status: 500,
  //     statusText: data.results.common.errorCode,
  //   });
  // }

  try {
    const { data } = await axios.get(url, {
      params: {
        confmKey,
        currentPage: pageNo,
        countPerPage,
        keyword,
        resultType: "json",
      },
    });
    if (data.results.common.errorCode !== "0") {
      return response.error(data.results.common.errorMessage, {
        status: 500,
        statusText: data.results.common.errorCode,
      });
    }

    const payload: JusoApiResponse = {
      totalCount: Number(data.results.common.totalCount),
      countPerPage,
      currentPage: Number(pageNo),
      items: data.results.juso,
    };
    return response.send(payload);
  } catch (error: any) {
    return response.error(error.message);
  }

  // const payload: JusoApiResponse = {
  //   totalCount: Number(data.results.common.totalCount),
  //   countPerPage,
  //   currentPage: Number(pageNo),
  //   items: data.results.juso,
  // };

  // return response.send<JusoApiResponse>({ ...payload });
}

interface JusoApiResponse {
  totalCount: number;
  countPerPage: number;
  currentPage: number;
  items: any[];
}
