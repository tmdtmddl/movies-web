export async function POST(req: Request) {
  const keyword = await req.json();

  // if (!keyword || keyword.length) {
  //   return Response.json(null, { status: 500, statusText: "오류남" });
  // }

  const pageNo = new URL(req.url).searchParams.get("pageNo");
  // console.log(pageNo, 8);

  const confmKey = process.env.JUSO_API_KEY!;
  const currentPage = 1;
  const countPerPage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${currentPage}&countPerPage=${countPerPage}&keyword=${keyword}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(data, 19);
  return Response.json(data);
}
