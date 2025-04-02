import { tmdbOptions } from "@/types/tmdb";

export async function GET(req: Request) {
  const mid = new URL(req.url).searchParams.get("mid");
  let url = "";
  if (!mid) {
    url =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
  } else {
    url = `https://api.themoviedb.org/3/movie/${mid}?language=en-US`;
  }

  const res = await fetch(url, tmdbOptions());
  const data = await res.json();
  if (data.data && !data.data.success) {
    return Response.json(data.data, { status: 500 });
  }
  return Response.json(data, { status: 200 });
}
