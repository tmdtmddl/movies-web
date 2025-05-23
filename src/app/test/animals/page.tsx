const fetchAnimals = async () => {
  const url =
    "https://data.mafra.go.kr/opendata/data/indexOpenDataDetail.do?data_id=20210806000000001532&TYPE=json";

  const res = await fetch(url);
  console.log(res, 5);
  const data = await res.json();
  console.log(data, 7);
};

const AnimalPage = async () => {
  await fetchAnimals();
  return <div>AnimalPage</div>;
};

export default AnimalPage;
