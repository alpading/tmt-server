# Restaurants API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/restaurants` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |

---

## 엔드포인트 목록

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/restaurants/filters/basic` | 기본 필터 목록 조회 | 필요 |
| GET | `/restaurants/filters/categories` | 카테고리 목록 조회 | 필요 |
| GET | `/preferences/filters/restaurant` | 성향 기반 필터 목록 조회 | 필요 |
| GET | `/restaurants/:restaurantId` | 식당 상세 조회 | 필요 |
| GET | `/restaurants/search/district/:districtId` | 지역별 식당 검색 | 필요 |
| POST | `/restaurants/rating` | 리뷰 작성 | 필요 |

---

## GET /restaurants/filters/basic

기본 필터 항목 목록 조회. 검색 화면에서 필터 UI 구성 시 사용.

### Response

**성공 `200`**

```json
[
  { "key": "hasParking",       "label": "주차" },
  { "key": "hasSingleSeating", "label": "혼밥 전용 공간" },
  { "key": "allowsPets",       "label": "애견 동반" },
  { "key": "hasTableSeating",  "label": "입식" },
  { "key": "hasFloorSeating",  "label": "좌식" },
  { "key": "hasBarTable",      "label": "바테이블" },
  { "key": "hasBabyChair",     "label": "유아 의자" },
  { "key": "hasGroupSeating",  "label": "단체석" },
  { "key": "hasPrivateRoom",   "label": "룸" }
]
```

---

## GET /restaurants/filters/categories

식당 카테고리 목록 조회.

### Response

**성공 `200`**

```json
[
  { "id": 1, "name": "한식" },
  { "id": 2, "name": "양식" }
]
```

---

## GET /preferences/filters/restaurant

성향 기반 필터 항목 목록 조회. 검색 화면에서 성향 필터 UI 구성 시 사용.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| categoryId | integer | 성향 카테고리 ID |
| categoryName | string | 카테고리 이름 |
| targetRating | string | 이 카테고리가 영향을 주는 평점 컬럼 |
| attributes | array | 해당 카테고리의 속성 목록 |
| attributes[].id | integer | 속성 ID (검색 API의 `prefAttrIds`에 사용) |
| attributes[].name | string | 속성 이름 |
| attributes[].profileCol | string | 유저 성향 프로필 컬럼명 |

```json
[
  {
    "categoryId": 1,
    "categoryName": "음식 취향",
    "targetRating": "taste_rating",
    "attributes": [
      { "id": 1, "name": "기름지고 느끼한",       "profileCol": "res_oily" },
      { "id": 2, "name": "건강하고 담백한",       "profileCol": "res_mild" },
      { "id": 3, "name": "달고 짠 자극적인",     "profileCol": "res_stim" },
      { "id": 4, "name": "스트레스 풀리는 매운", "profileCol": "res_spicy" }
    ]
  },
  {
    "categoryId": 2,
    "categoryName": "공간 및 서비스 취향",
    "targetRating": "space_rating",
    "attributes": [
      { "id": 5, "name": "인테리어와 분위기가 좋은",    "profileCol": "res_interior" },
      { "id": 6, "name": "직원의 응대가 친절한",      "profileCol": "res_service" },
      { "id": 7, "name": "소음이 없고 조용한",        "profileCol": "res_noise" },
      { "id": 8, "name": "위생 및 청결 상태가 깔끔한", "profileCol": "res_clean" }
    ]
  }
]
```

---

## GET /restaurants/:restaurantId

식당 상세 정보 조회.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| restaurantId | integer | Y | 식당 ID |

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| id | integer | 식당 ID |
| name | string | 식당 이름 |
| imageUrl | string | 이미지 URL |
| address | string | 주소 |
| latitude | number \| null | 위도 |
| longitude | number \| null | 경도 |
| naverPlaceId | string \| null | 네이버 장소 ID (`https://map.naver.com/v5/entry/place/{naverPlaceId}`) |
| categoryId | integer | 카테고리 ID |
| districtId | integer | 지역 ID |

```json
{
  "id": 12,
  "name": "맛있는 식당",
  "imageUrl": "https://...",
  "address": "제주특별자치도 제주시 ...",
  "latitude": 33.4996,
  "longitude": 126.5312,
  "naverPlaceId": "1234567890",
  "categoryId": 1,
  "districtId": 5
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 식당 | `404` | `RESOURCE_NOT_FOUND` |

---

## GET /restaurants/search/district/:districtId

성향 및 기본 필터를 적용하여 해당 지역의 식당을 추천 순으로 최대 5개 반환.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| districtId | integer | Y | 지역 ID |

### Query Parameters

| 파라미터 | 타입 | 필수 | 제약 | 설명 |
|---|---|---|---|---|
| categoryId | integer | N | 최대 1개 | 식당 카테고리 ID |
| basicFilters | string | N | 최대 3개, 콤마 구분 | 기본 필터 key 목록 |
| prefAttrIds | string | N | 최대 2개, 콤마 구분 | 성향 속성 ID 목록 |

> **`prefAttrIds` 선택 규칙**
> - 카테고리별 최대 1개씩 선택 가능 (음식 취향 1개 + 공간 및 서비스 취향 1개, 총 최대 2개)
> - 속성 ID는 `/preferences/filters/restaurant` 응답의 `attributes[].id` 값을 사용

> **⚠️ 매운 속성(id: 4) 선택 시**: 성향 스코어링과 함께 `has_spicy_food = true` 하드 필터가 자동 적용됩니다.

### Request 예시

```
GET /api/restaurants/search/district/5?categoryId=1&basicFilters=hasParking,allowsPets&prefAttrIds=1,7
```

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| results | array | 추천 식당 목록 (최대 5개, score 내림차순) |
| results[].id | integer | 식당 ID |
| results[].name | string | 식당 이름 |
| results[].imageUrl | string | 이미지 URL |
| results[].score | number | 추천 점수 (소수점 2자리) |
| preferenceConditions | array | 선택한 성향 필터 조건 및 평균 점수 |
| preferenceConditions[].attributeId | integer | 속성 ID |
| preferenceConditions[].attributeName | string | 속성 이름 |
| preferenceConditions[].avgTargetRating | number \| null | 해당 지역에서 동일 성향 유저들의 평균 평점. 데이터 없으면 `null` |

```json
{
  "results": [
    { "id": 12, "name": "맛있는 식당",   "imageUrl": "https://...", "score": 4.35 },
    { "id": 7,  "name": "분위기 좋은 곳", "imageUrl": "https://...", "score": 4.10 }
  ],
  "preferenceConditions": [
    { "attributeId": 1, "attributeName": "기름지고 느끼한", "avgTargetRating": 4.10 },
    { "attributeId": 7, "attributeName": "소음이 없고 조용한", "avgTargetRating": 3.85 }
  ]
}
```

> `prefAttrIds` 미입력 시 `preferenceConditions`는 빈 배열 `[]` 반환

---

## POST /restaurants/rating

식당 리뷰 작성. 유저의 현재 성향 프로필 값이 자동으로 스냅샷 저장됨.

### Request Body

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|---|---|---|---|---|
| restaurantId | integer | Y | 양의 정수 | 식당 ID |
| overallRating | number | Y | 0~5, 소수점 1자리 | 종합 평점 |
| tasteRating | number | Y | 0~5, 소수점 1자리 | 맛 평점 |
| spaceRating | number | Y | 0~5, 소수점 1자리 | 공간 평점 |
| visitPartySize | integer | Y | 양의 정수 | 방문 인원 수 |
| totalSpentAmount | integer | Y | 양의 정수 | 총 결제 금액 (원) |

### Request 예시

```json
{
  "restaurantId": 12,
  "overallRating": 4.5,
  "tasteRating": 4.5,
  "spaceRating": 4.0,
  "visitPartySize": 2,
  "totalSpentAmount": 35000
}
```

### Response

**성공 `201`** — 저장된 리뷰 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 식당 | `404` | `RESOURCE_NOT_FOUND` |
| 필드 누락 또는 형식 오류 | `400` | `INVALID_FORMAT` |
| 토큰 없음 또는 만료 | `401` | `UNAUTHORIZED` |
