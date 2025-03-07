const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // 포트 번호로 변경

app.use(cors()); // 모든 요청 허용

app.get('/api/buildings', (req, res) => {
  const { x, y, radius } = req.query;

  if (!x || !y || !radius) {
    return res.status(400).json({ error: 'x, y, radius 파라미터가 필요합니다.' }); // 메시지 유지
  }

  const centerX = parseFloat(x);
  const centerY = parseFloat(y);
  const radiusValue = parseFloat(radius);

  if (isNaN(centerX) || isNaN(centerY) || isNaN(radiusValue)) {
    return res.status(400).json({ error: '잘못된 좌표 값입니다.' }); // 메시지 유지
  }

  const buildings = [
    {
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
  console.log(`서버가 http://localhost:${port}/api에서 실행 중입니다.`); // URL 형식으로 출력 개선
});

// 주석 설명:
// 1. `port`를 3000으로 변경: Express의 `app.listen()`은 포트 번호를 숫자로 받아야 함.
// 2. 출력 메시지 개선: 포트 번호를 포함한 전체 URL을 명확히 표시하도록 수정.