import WCom from "./WCom";

const onLoad = async (): Promise<any | { message: string }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v0/test`);

  if (!res.ok) {
    console.log("error:", res.statusText, 7);
    return { message: res.statusText };
  }
  const data = await res.json();
  console.log(data, 11);
  return data;
};

const TestPage = async () => {
  const data = await onLoad();
  return <WCom {...data} />;
};

export default TestPage;
