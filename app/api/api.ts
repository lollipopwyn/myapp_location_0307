// 서버와 통신하기 위한 API 호출 함수 정의
// TypeScript 타입으로 데이터 구조를 명시

const API_URL = ''; // 실제 서버 URL로 변경 필요

interface Building {
  coordinates: { x: number; y: number }[];
}

export const fetchBuildings = async (x: number, y: number, radius: number = 200): Promise<Building[]> => {
  try {
    const url = `${API_URL}/bldg/nearby?x=${x}&y=${y}&radius=${radius}`;
    console.log('API 요청:', url); // 로깅 유지

    const response = await fetch(url);
    console.log('응답 상태 코드:', response.status); // 로깅 유지

    if (!response.ok) {
      throw new Error(`서버 오류 발생: ${response.status}`); // 오류 메시지 유지
    }

    const data = await response.json() as Building[];
    console.log('받은 데이터:', data); // 로깅 유지
    return data;
  } catch (error) {
    console.error('건물 데이터를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 주석 설명:
// 1. `data`에 타입 캐스팅 추가: `await response.json() as Building[]`로 수정하여 반환 타입이 `Building[]`와 일치하도록 보장.