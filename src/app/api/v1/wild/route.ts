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
  return Response.json(payload);
}
