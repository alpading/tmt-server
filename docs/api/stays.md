# Stays API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/stays` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |

---

## 엔드포인트 목록

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/stays/filters/basic` | 기본 필터 목록 조회 | 필요 |
| GET | `/stays/filters/categories` | 카테고리 목록 조회 | 필요 |
| GET | `/preferences/filters/stay` | 성향 기반 필터 목록 조회 | 필요 |
| GET | `/stays/search/district/:districtId` | 지역별 숙소 검색 | 필요 |
| POST | `/stays/rating` | 리뷰 작성 | 필요 |

---

## GET /stays/filters/basic

기본 필터 항목 목록 조회. 검색 화면에서 필터 UI 구성 시 사용.

### Response

**성공 `200`**

```json
[
  { "key": "hasParking",             "label": "주차" },
  { "key": "allowsCooking",          "label": "취사" },
  { "key": "isWheelchairAccessible", "label": "휠체어 접근 가능" },
  { "key": "allowsPets",             "label": "애견 동반" },
  { "key": "hasBathtub",             "label": "욕조" },
  { "key": "hasBreakfast",           "label": "조식" },
  { "key": "hasTv",                  "label": "TV" },
  { "key": "hasBbq",                 "label": "바베큐" }
]
```

---

## GET /stays/filters/categories

숙소 카테고리 목록 조회.

### Response

**성공 `200`**

```json
[
  { "id": 1, "name": "호텔" },
  { "id": 2, "name": "펜션" }
]
```

---

## GET /preferences/filters/stay

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
    "categoryId": 4,
    "categoryName": "분위기 및 공간 취향",
    "targetRating": "interior_rating",
    "attributes": [
      { "id": 9,  "name": "주변 풍경이 좋은",        "profileCol": "stay_view" },
      { "id": 10, "name": "인테리어와 분위기가 좋은", "profileCol": "stay_interior" },
      { "id": 11, "name": "공간이 넓고 쾌적한",       "profileCol": "stay_space" }
    ]
  },
  {
    "categoryId": 5,
    "categoryName": "이용환경 및 서비스 취향",
    "targetRating": "clean_rating",
    "attributes": [
      { "id": 12, "name": "방음이 잘 되어 조용한",      "profileCol": "stay_noise" },
      { "id": 13, "name": "청결 및 위생 관리가 잘 된",  "profileCol": "stay_clean" },
      { "id": 14, "name": "직원 응대 및 서비스가 좋은", "profileCol": "stay_service" }
    ]
  }
]
```

---

## GET /stays/search/district/:districtId

성향 및 기본 필터를 적용하여 해당 지역의 숙소를 추천 순으로 최대 5개 반환.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| districtId | integer | Y | 지역 ID |

### Query Parameters

| 파라미터 | 타입 | 필수 | 제약 | 설명 |
|---|---|---|---|---|
| categoryId | integer | N | 최대 1개 | 숙소 카테고리 ID |
| basicFilters | string | N | 최대 3개, 콤마 구분 | 기본 필터 key 목록 |
| prefAttrIds | string | N | 최대 2개, 콤마 구분 | 성향 속성 ID 목록 |

> **`prefAttrIds` 선택 규칙**
> - 카테고리별 최대 1개씩 선택 가능 (분위기 및 공간 취향 1개 + 이용환경 및 서비스 취향 1개, 총 최대 2개)
> - 속성 ID는 `/preferences/filters/stay` 응답의 `attributes[].id` 값을 사용

### Request 예시

```
GET /api/stays/search/district/5?categoryId=2&basicFilters=hasBathtub,hasBreakfast&prefAttrIds=9,12
```

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| results | array | 추천 숙소 목록 (최대 5개, score 내림차순) |
| results[].id | integer | 숙소 ID |
| results[].name | string | 숙소 이름 |
| results[].imageUrl | string | 이미지 URL |
| results[].score | number | 추천 점수 (소수점 2자리) |
| preferenceConditions | array | 선택한 성향 필터 조건 및 평균 점수 |
| preferenceConditions[].attributeId | integer | 속성 ID |
| preferenceConditions[].attributeName | string | 속성 이름 |
| preferenceConditions[].avgTargetRating | number \| null | 해당 지역에서 동일 성향 유저들의 평균 평점. 데이터 없으면 `null` |

```json
{
  "results": [
    { "id": 3, "name": "오션뷰 펜션", "imageUrl": "https://...", "score": 4.61 },
    { "id": 9, "name": "감성 숙소",   "imageUrl": "https://...", "score": 4.42 }
  ],
  "preferenceConditions": [
    { "attributeId": 9,  "attributeName": "주변 풍경이 좋은",      "avgTargetRating": 4.30 },
    { "attributeId": 12, "attributeName": "방음이 잘 되어 조용한", "avgTargetRating": 3.90 }
  ]
}
```

> `prefAttrIds` 미입력 시 `preferenceConditions`는 빈 배열 `[]` 반환

---

## POST /stays/rating

숙소 리뷰 작성. 유저의 현재 성향 프로필 값이 자동으로 스냅샷 저장됨.

### Request Body

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|---|---|---|---|---|
| stayId | integer | Y | 양의 정수 | 숙소 ID |
| overallRating | number | Y | 0~5, 소수점 1자리 | 종합 평점 |
| interiorRating | number | Y | 0~5, 소수점 1자리 | 분위기 및 공간 평점 |
| cleanRating | number | Y | 0~5, 소수점 1자리 | 이용환경 및 청결 평점 |
| visitPartySize | integer | Y | 양의 정수 | 방문 인원 수 |
| totalSpentAmount | integer | Y | 양의 정수 | 총 결제 금액 (원) |

### Request 예시

```json
{
  "stayId": 3,
  "overallRating": 4.5,
  "interiorRating": 4.5,
  "cleanRating": 4.0,
  "visitPartySize": 2,
  "totalSpentAmount": 150000
}
```

### Response

**성공 `201`** — 저장된 리뷰 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 숙소 | `404` | `RESOURCE_NOT_FOUND` |
| 필드 누락 또는 형식 오류 | `400` | `INVALID_FORMAT` |
| 토큰 없음 또는 만료 | `401` | `UNAUTHORIZED` |
