export async function POST(dreq: Request) {
  const keyword = await dreq.json();

  if (!keyword || keyword.length) {
    return Response.json(null, { status: 500, statusText: "오류남" });
  }

  const pageNo = new URL(dreq.url).searchParams.get("pageNo");
  console.log(pageNo, 8);

  const jusoKey = process.env.JUSO_API_KEY!;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(data, 17);
}
