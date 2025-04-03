const fetchAnimals = async () => {
  const url =
    "https://data.mafra.go.kr/opendata/data/indexOpenDataDetail.do?data_id=20210806000000001532&TYPE=json";
  const res = await fetch(url);
  console.log({ res }, 4);
  const data = await res.json();
  console.log({ data }, 6);
};

const AnimalPage = async () => {
  return (
    <div>
      <h1>AnimalPage</h1>
    </div>
  );
};

export default AnimalPage;
