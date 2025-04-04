# 무한 스크롤 왜 씀?

- 멋진 기술이기 때문에 포폴 추가용

- 다른 페이지 이동 없이 한페이지에서 데이터를 볼 수 있음
- 서버에 한 꺼번에 많은 데이터를 호출하면 데이터를 호출하면 비용(돈,시간) 발생(쓸데없는 낭비 ㄴㄴ)
- 한 번의 요청에 20개 또는 10개 등의 데이터 수를 제한

## 필요한 값

- 한 페이지의 데이터 갯수 예)10-20
- 현재 불러오는 페이지
- 다음 페이지( 모든데이터의 갯수 / 한 페이지의 데이터 값 올림처림 = 페이지의 갯수 )
- 현재 페이지 < 페이지의 갯수 => 다음 페이지를 불러올 수 있음
- 총 데이터의 갯수

- 트리거 (언제 불러옴?)
- 스크롤을 끝까지 내렸을 때를 감지하여서 동작
- 화면에 요소가 등장하는 것을 나타내는 상태
- new IntersectiongObserver()
- react-intersection-observer 이거 쓰면 짱 쉬움
- useInfiniteQuery
- 다음페이지가 잇는지, 로딩중인지, 에러가 있는 지, 데이터값 (페이지들),다음페이지 불러오는 함수

### useInfiniteQuery

1. queryKey => 유니크한 쿼리 키 값 배열로 주기

2. initialPageParam:1 => 0안됨 1로 시작

3. get...

   - 다음 페이지가 있다면 다음 페이지의 숫자를 return
   - 다음 페이지가 없다면 ...
   - 현재 페이지 < 총.....
   - return ...

4. queryFn => 다음페이지도 불러오고 최초의 페이지도 불러오는 함수

   - (하나의인자) => 하나의 인자는 {pageParam}등 여러 ...
   - 공공데이터 특 => pageNo의 쿼리값을 줌
   - 필요한 로직 수행

5. infiniteQuery가 주는 휼륭한 값들

   1. isPending

      - 최초 1회 로딩중인지 알려줌
      - 무한스크롤 시 또다른 데이터 가져올 때 로딩중인지도 알려줌

   2. error

      - 잘못된거 있어도 알려줌

   3. hasNextPage

      - 다음페이지가 있는 알려주는 불리언
      - get...
      - undfined => 거짓

   4. fetchNextPage(함수)
      queryFn 그 잡채

   5. data(배열[]배열[])

   ```javascript
   const data =[]
   [
       pageData[],
       pageData[],
       pageData[],
   ]

   data.map(
       //<key={XXX}></>
       (page,pageIndex)=><React.Fragment key={pageIndex}>
       {page.map(
           (item,itemIndex)=><ItemComponent {...item} key={.................}/>
       )}
       </React.Fragment>

   )
   ```

#### 리액트쿼리 안쓰고 리액트로 다 구현하기

1. 최초 1회 로딩 상태
2. 무한...
3. 현재 페이지
4. 모든 ...
5. 다음 페이지...
6. 함수 만들기
7. 최초의 데이터 배열
8. 무한 ...

   - 무한 스크롤로 받아온 데이터를 무한 스크롤 데이털르 받아오는 것이 종료되면 최초의 데이터 배열에 ....
