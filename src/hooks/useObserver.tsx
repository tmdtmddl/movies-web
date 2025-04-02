"use client";

import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const useObserver = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("is in the view");
        setIsInView(true);
      } else {
        setIsInView(false);
      }
    });

    if (ref.current) {
      observer.observe(ref.current!);
    }

    return () => {
      if (ref.current) {
        observer.observe(ref.current!);
      }
    };
  }, []);
  const Wrapper = useCallback((props: ComponentProps<"div">) => {
    return <div {...props} ref={ref} />;
  }, []);
  return { isInView, Wrapper, ref };
};

export default useObserver;
