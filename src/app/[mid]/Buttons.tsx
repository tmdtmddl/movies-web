"use client";
import { TMDBMovieDetail } from "@/types/tmdb";
import { getAgent, saveAgent, saveMovie } from "@/utils";
import { useRouter } from "next/navigation";
import { AiOutlinePaperClip, AiOutlineShareAlt } from "react-icons/ai";

const Buttons = ({ mid, movie }: { mid: string; movie: TMDBMovieDetail }) => {
  const navi = useRouter();

  return (
    <>
      <button
        className={icon}
        onClick={() => {
          try {
            const url = `${process.env.NEXT_PUBLIC_URL!}/${mid}`;
            navigator.clipboard.writeText(url);
            if (
              confirm(
                "영화 정보 링크를 복사하였습니다. 친구에게 공유하시겠습니까?"
              )
            ) {
              const a = document.createElement("a");
              const body = encodeURIComponent(`[영화제목]\n
                링크: ${url}\n\n너의친구가!`);
              a.href = `sms:01012341234&body=${body}`;
              a.click();
            }
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        <AiOutlinePaperClip />
      </button>
      <button
        className={icon}
        onClick={async () => {
          const agent = getAgent();
          if (!agent) {
            saveAgent(navigator.userAgent);
          } else {
            saveMovie(movie);
            if (confirm("영화를 담았습니다. 이동 ㄱ??")) {
              navi.push("/my?target=scrap");
              navi.replace("/my?target=scrap");
            }
            return;
            alert("영화를 담았습니다. 이동 ㄱ??");
          }
        }}
      >
        <AiOutlineShareAlt />
      </button>
    </>
  );
};

const icon =
  "flex justify-center items-center size-10 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer";

export default Buttons;
