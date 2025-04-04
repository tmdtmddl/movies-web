"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { PropsWithChildren } from "react";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <header className="fixed top-0 left-0 z-40 bg-white w-full border-b border-gray-200">
        <div className="h-15 max-w-300 mx-auto flex justify-between">
          <Link
            href="/"
            className="h-full flex justify-center items-center px-2.5 font-black text-2xl hover:text-sky-500"
          >
            영화정보통
          </Link>
          <div>
            <Link
              href="/my"
              className="h-full flex justify-center hover:text-sky-500 items-center px-2.5"
            >
              내가 스크랩한 영화
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-15">{children}</main>
    </QueryClientProvider>
  );
};

export default AppLayout;
