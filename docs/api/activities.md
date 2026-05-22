# Activities API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/activities` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |

---

## 엔드포인트 목록

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/activities/filters/basic` | 기본 필터 목록 조회 | 필요 |
| GET | `/preferences/filters/activity` | 성향 기반 필터 목록 조회 | 필요 |
| GET | `/activities/search/district/:districtId` | 지역별 액티비티 검색 | 필요 |
| POST | `/activities/rating` | 리뷰 작성 | 필요 |

---

## GET /activities/filters/basic

기본 필터 항목 목록 조회. 검색 화면에서 필터 UI 구성 시 사용.

### Response

**성공 `200`**

```json
[
  { "key": "availableParking",       "label": "주차" },
  { "key": "isKidFriendly",          "label": "아이와 함께" },
  { "key": "isShopping",             "label": "쇼핑" },
  { "key": "isCafe",                 "label": "카페, 디저트" },
  { "key": "isFree",                 "label": "무료" },
  { "key": "isWheelchairAccessible", "label": "휠체어 가능 여부" },
  { "key": "allowsPets",             "label": "애견 동반" }
]
```

---

## GET /preferences/filters/activity

성향 기반 필터 항목 목록 조회. 검색 화면에서 성향 필터 UI 구성 시 사용.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| categoryId | integer | 성향 카테고리 ID |
| categoryName | string \| null | 카테고리 이름 (액티비티는 `null`) |
| targetRating | string | 이 카테고리가 영향을 주는 평점 컬럼 |
| attributes | array | 해당 카테고리의 속성 목록 |
| attributes[].id | integer | 속성 ID (검색 API의 `prefAttrIds`에 사용) |
| attributes[].name | string | 속성 이름 |
| attributes[].profileCol | string | 유저 성향 프로필 컬럼명 |

```json
[
  {
    "categoryId": 3,
    "categoryName": null,
    "targetRating": "overall_rating",
    "attributes": [
      { "id": 15, "name": "문화 / 전시",     "profileCol": "act_culture" },
      { "id": 16, "name": "풍경 / 감상",     "profileCol": "act_view" },
      { "id": 17, "name": "힐링 / 휴식",     "profileCol": "act_healing" },
      { "id": 18, "name": "레저 / 액티비티", "profileCol": "act_active" }
    ]
  }
]
```

---

## GET /activities/search/district/:districtId

성향 및 기본 필터를 적용하여 해당 지역의 액티비티를 추천 순으로 최대 5개 반환.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| districtId | integer | Y | 지역 ID |

### Query Parameters

| 파라미터 | 타입 | 필수 | 제약 | 설명 |
|---|---|---|---|---|
| basicFilters | string | N | 최대 3개, 콤마 구분 | 기본 필터 key 목록 |
| prefAttrIds | string | N | 최대 2개, 콤마 구분 | 성향 속성 ID 목록 |

> **`prefAttrIds` 선택 규칙**
> - 동일 카테고리 내에서 최대 2개 선택 가능
> - 속성 ID는 `/preferences/filters/activity` 응답의 `attributes[].id` 값을 사용

> **⚠️ 하이브리드 필터 (성향 스코어링 + 하드 필터 동시 적용)**
>
> | 속성 | id | 추가 적용 조건 |
> |---|---|---|
> | 문화 / 전시 | 15 | `is_exhibition = true` 인 액티비티만 조회 |
> | 레저 / 액티비티 | 18 | `is_active = true` 인 액티비티만 조회 |

### Request 예시

```
GET /api/activities/search/district/5?basicFilters=isFree&prefAttrIds=15,17
```

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| results | array | 추천 액티비티 목록 (최대 5개, score 내림차순) |
| results[].id | integer | 액티비티 ID |
| results[].name | string | 액티비티 이름 |
| results[].imageUrl | string | 이미지 URL |
| results[].score | number | 추천 점수 (소수점 2자리) |
| preferenceConditions | array | 선택한 성향 필터 조건 및 평균 점수 |
| preferenceConditions[].attributeId | integer | 속성 ID |
| preferenceConditions[].attributeName | string | 속성 이름 |
| preferenceConditions[].avgTargetRating | number \| null | 해당 지역에서 동일 성향 유저들의 평균 평점. 데이터 없으면 `null` |

```json
{
  "results": [
    { "id": 22, "name": "국립 박물관 관람", "imageUrl": "https://...", "score": 4.55 },
    { "id": 31, "name": "힐링 산책 코스",   "imageUrl": "https://...", "score": 4.20 }
  ],
  "preferenceConditions": [
    { "attributeId": 15, "attributeName": "문화 / 전시",  "avgTargetRating": 4.40 },
    { "attributeId": 17, "attributeName": "힐링 / 휴식",  "avgTargetRating": 4.15 }
  ]
}
```

> `prefAttrIds` 미입력 시 `preferenceConditions`는 빈 배열 `[]` 반환

---

## POST /activities/rating

액티비티 리뷰 작성. 유저의 현재 성향 프로필 값이 자동으로 스냅샷 저장됨.

### Request Body

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|---|---|---|---|---|
| activityId | integer | Y | 양의 정수 | 액티비티 ID |
| overallRating | number | Y | 0~5, 소수점 1자리 | 종합 평점 |

### Request 예시

```json
{
  "activityId": 22,
  "overallRating": 4.5
}
```

### Response

**성공 `201`** — 저장된 리뷰 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 액티비티 | `404` | `RESOURCE_NOT_FOUND` |
| 필드 누락 또는 형식 오류 | `400` | `INVALID_FORMAT` |
| 토큰 없음 또는 만료 | `401` | `UNAUTHORIZED` |
