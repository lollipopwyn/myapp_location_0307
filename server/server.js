const express = require('express');         // 서버 구동
const cors = require('cors');               // 다른 곳에서도 우리 서버 접근할 수 있게 설정
const app = express();                      // app이라는 이름으로 서버 구동
const port = 3000;                           // 포트 번호로 변경


app.use(cors()); // 모든 요청 허용

app.get('/bldg/nearby', (req, res) => {
  //'/bldg/nearby'라는 주소를 누가 부르면 이 안의 코드를 실행
  const { x, y, radius } = req.query;       // x, y, radius를 받아옴

  if (!x || !y || !radius) {
    return res.status(400).json({ error: 'x, y, radius 파라미터가 필요합니다.' }); // 메시지 유지
  }

  // x, y, radius를 숫자로 변환
  const centerX = parseFloat(x);        
  const centerY = parseFloat(y);
  const radiusValue = parseFloat(radius);

  if (isNaN(centerX) || isNaN(centerY) || isNaN(radiusValue)) {
    //숫자로 못 바꾸면 (잘못된 값이면) 에러 메시지 출력
    return res.status(400).json({ error: '잘못된 좌표 값입니다.' }); // 메시지 유지
  }

  const buildings = [
    {
      // 좌표 4개로 건물 하나는 사각형으로 표현
      coordinates: [
        { x: centerX + 0.001, y: centerY + 0.001 },
        { x: centerX + 0.001, y: centerY - 0.001 },
        { x: centerX - 0.001, y: centerY - 0.001 },
        { x: centerX - 0.001, y: centerY + 0.001 },
      ],
    },
  ];

  res.json(buildings);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}/bldg/nearby에서 실행 중입니다.`); // URL 형식으로 출력 개선
});

// 주석 설명:
// 1. `port`를 3000으로 변경: Express의 `app.listen()`은 포트 번호를 숫자로 받아야 함.
// 2. 출력 메시지 개선: 포트 번호를 포함한 전체 URL을 명확히 표시하도록 수정.