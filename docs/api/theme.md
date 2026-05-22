# Theme API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/theme` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |

---

## 엔드포인트 목록

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/theme/list` | 전체 테마 목록 조회 | 필요 |
| GET | `/theme/:themeId/district/:districtId` | 테마별 일정 추천 | 필요 |

---

## GET /theme/list

전체 테마 목록 조회. MBTI 기반 테마(id: 8)는 요청 유저의 MBTI 값이 이름에 반영됨.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| id | integer | 테마 ID |
| name | string | 테마 이름 (MBTI 테마는 유저 MBTI로 치환) |
| description | string | 테마 설명 |
| imageUrl | string | 테마 이미지 URL |

```json
[
  { "id": 1,  "name": "인기 있는 곳만 콕콕",       "description": "...", "imageUrl": "https://..." },
  { "id": 2,  "name": "인스타 감성가득 핫플레이스", "description": "...", "imageUrl": "https://..." },
  { "id": 3,  "name": "나의 취향 저격",             "description": "...", "imageUrl": "https://..." },
  { "id": 8,  "name": "INFP 스타일 여행",           "description": "...", "imageUrl": "https://..." }
]
```

---

## GET /theme/:themeId/district/:districtId

선택한 테마와 지역 기준으로 일정 추천. 일수(`days`)에 따라 숙소·식당·액티비티를 조합한 일정 반환.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| themeId | integer | Y | 테마 ID (1~13) |
| districtId | integer | Y | 지역 ID |

### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| days | integer | N | `1` | 1~3 | 여행 일수 |

### 일정 구성 규칙

| 항목 | 설명 |
|---|---|
| 식당 | 하루 2곳 × days (총 days×2개) |
| 액티비티 | 하루 1곳 × days (총 days개) |
| 숙소 | `days > 1`이면 1곳, 당일치기(`days = 1`)이면 null |
| 피크-엔드 적용 | 가장 높은 평점의 액티비티를 `Math.min(round(days×0.8), days) - 1` 번째 날에 배치 |

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| days | integer | 여행 일수 |
| stay | object \| null | 숙소 정보. 당일치기이면 `null` |
| stay.id | integer | 숙소 ID |
| stay.name | string | 숙소 이름 |
| stay.imageUrl | string | 이미지 URL |
| schedule | array | 일자별 일정 |
| schedule[].day | integer | 일차 (1부터 시작) |
| schedule[].restaurants | array | 해당 일자 식당 목록 (최대 2곳) |
| schedule[].restaurants[].id | integer | 식당 ID |
| schedule[].restaurants[].name | string | 식당 이름 |
| schedule[].restaurants[].imageUrl | string | 이미지 URL |
| schedule[].activity | object \| null | 해당 일자 액티비티. 없으면 `null` |
| schedule[].activity.id | integer | 액티비티 ID |
| schedule[].activity.name | string | 액티비티 이름 |
| schedule[].activity.imageUrl | string | 이미지 URL |

```json
{
  "days": 2,
  "stay": { "id": 3, "name": "오션뷰 펜션", "imageUrl": "https://..." },
  "schedule": [
    {
      "day": 1,
      "restaurants": [
        { "id": 12, "name": "맛있는 식당", "imageUrl": "https://..." },
        { "id": 7,  "name": "분위기 좋은 곳", "imageUrl": "https://..." }
      ],
      "activity": { "id": 22, "name": "국립 박물관 관람", "imageUrl": "https://..." }
    },
    {
      "day": 2,
      "restaurants": [
        { "id": 5,  "name": "해산물 맛집",  "imageUrl": "https://..." },
        { "id": 18, "name": "뷰 맛집 카페", "imageUrl": "https://..." }
      ],
      "activity": { "id": 31, "name": "힐링 산책 코스", "imageUrl": "https://..." }
    }
  ]
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 테마 | `404` | `RESOURCE_NOT_FOUND` |
| days 범위 초과 (1~3 외) | `400` | `INVALID_FORMAT` |
| 토큰 없음 또는 만료 | `401` | `UNAUTHORIZED` |
