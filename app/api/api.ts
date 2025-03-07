// 서버와 통신하기 위한 API 호출 함수 정의



const API_URL = ''; // 실제 서버 URL로 변경 필요


export interface Building {     //건물 데이터의 타입 정의
 bldg_geom: {                   // bldg_geom은 건물의 모양을 나타내는 정보
   coordinates: number[][][][]; // coordinates는 건물의 위치를 숫자로 나타낸 것
 };
}

// fetchBuildings는 서버에서 건물 데이터를 가져오는 함수, x와 y는 위치, radius는 찾을 범위
export const fetchBuildings = async (x: number, y: number, radius: number): Promise<Building[]> => {
 try {
   const url = `${API_URL}/bldg/nearby?x=${x}&y=${y}&radius=${radius}`;   // 서버에 보낼 주소 만듬, 예를들어: https://서버 주소/bldg/nearby?x=127.123&y=37.123&radius=100
   console.log('API 요청:', url); 

 
   const response = await fetch(url);                // 서버에 요청을 보내고 응답 대기
   console.log('응답 상태 코드:', response.status); 


   if (!response.ok) {
     throw new Error(`서버 오류 발생: ${response.status}`); // 오류 메시지 유지
   }


   const data = await response.json() as Building[];      // 서버가 보낸 답을 읽어서 Building 모양으로 변환, 여러 건물이 리스트로 옴
   console.log('받은 데이터:', data); 
   return data;
 } catch (error) {
   console.error('건물 데이터를 가져오는 중 오류 발생:', error);
   throw error;
 }
};
