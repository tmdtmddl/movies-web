import response from "../..";

export async function GET(req: Request) {
  const serviceKey = process.env.ANIMAL_API_KEY!;
  const pageNo = new URL(req.url).searchParams.get("pageNo") ?? 1;
  const numOfRows = 20;
  const url = `${process.env.ANIMAL_URL}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;
  const res = await fetch(url);
  console.log(res);

  const fetchedAnimalXml = await res.text();

  return response.send<string>(fetchedAnimalXml);
}
