// GET(가져오기),POST(몰래붙이기),PATCH(데이터를 업데이트),DELETE(삭제)
export async function GET(req: Request) {
  const serviceKey = process.env.W_SERVICE_KEY;
  const numOfRows = 871;
  const pageNo = 1;
  // const ftype = "SHRT";
  // const baseDateTime = "202504030800";
  const baseDate = "20250402";
  const baseTime = "0800";
  const nx = 55;
  const ny = 127;

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?dataType=JSON&servicekey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.response.header.resultCode === "01") {
    return Response.json(null, { status: 500, statusText: "test.." });
  }

  // console.log(data.response);

  // console.log(data.response.body.items);
  // console.log(data, 14);
  return Response.json(data.response);
}
