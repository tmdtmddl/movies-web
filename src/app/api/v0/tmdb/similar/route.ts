import { tmdbOptions } from "@/types/tmdb";

export async function GET(request: Request) {
  const mid = new URL(request.url).searchParams.get("mid");
  if (!mid) {
    return Response.json(
      {
        status_code: 34,
        status_message: "영화 아이디 안주고 뭐함??",
        success: false,
      },
      { status: 500 }
    );
  }

  const url = `https://api.themoviedb.org/3/movie/${mid}/similar?language=en-US&page=1`;

  const res = await fetch(url, tmdbOptions());
  const data = await res.json();
  if (data.status_code && !data.success) {
    return Response.json(data, { status: 500 });
  }

  return Response.json(data, { status: 200 });
}
