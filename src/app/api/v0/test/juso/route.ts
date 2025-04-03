export async function POST(req: Request) {
  const keyword = await req.json();

  if (!keyword || keyword.length === 0) {
    return Response.json(null, { status: 500, statusText: "dd" });
  }
  const pageNo = new URL(req.url).searchParams.get("pageNo");
  if (!pageNo) {
    return Response.json(null, { status: 500, statusText: "no number" });
  }

  const confmKey = process.env.JUSO_API_KEY!;
  const countPerpage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${pageNo}&countPerpage=${countPerpage}&keyword=${keyword}`;

  const res = await fetch(url);
  const data = await res.json();
  //   console.log(data, 13);
  if (data.results.common.errCode!) {
    return Response.json(null, {
      status: 500,
      statusText: data.results.common.errorMessage,
    });
  }

  const payload = {
    totalCount: Number(data.results.common.totalCount),
    countPerpage,
    currentPage: pageNo,
    items: data.results.juso,
  };

  return Response.json(payload);
}
