//여기는 백엔드구간

export async function POST(req: Request) {
  const keyword = await req.json();
  console.log(keyword, 3);
  // if (!keyword || keyword.length === 0) {
  //   return Response.json(null, { status: 500, statusText: "오류남" });
  // }

  // const pageNo = new URL(req.url).searchParams.get("pageNo");
  // console.log(pageNo, 8);

  const confmKey = process.env.JUSO_API_KEY!;
  const currentPage = 1;
  const countPerPage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${currentPage}&countPerPage=${countPerPage}&keyword=${keyword}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data, 19);

  const payload = { items: data.results.juso ?? [] };
  if (data.results.common.errorCode !== "0") {
    return Response.json(payload, {
      status: 500,
      statusText: "error",
    });
  }

  return Response.json(payload);
}
