export async function POST(req: Request) {
  const pageNo = 1;
  const numOfRows = 100;
  const url = `https://www.seogu.go.kr/seoguAPI/3660000/getHrflAnimalCapt?pageNo=${pageNo}&numOfRows=${numOfRows}&type=json`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data, 7);

  const payload = {
    items: data.response?.body?.items ?? [],
  };

  if (data.response.header.resultCode === "C10") {
    return Response.json(null, {
      status: 500,
      statusText: "잘못된 요청 파라메터 에러",
    });
  }
  if (data.response.header.resultCode === "C12") {
    return Response.json(null, {
      status: 500,
      statusText: "해당 오픈 API가 없거나 폐기됨",
    });
  }
  if (data.response.header.resultCode === "C99") {
    return Response.json(null, {
      status: 500,
      statusText: "기타에러",
    });
  }

  return Response.json(payload);
}
