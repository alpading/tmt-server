# Me API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/me` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |
| 모든 엔드포인트 | 인증 필요 |

---

## 엔드포인트 목록

| Method | URL | 설명 |
|---|---|---|
| GET | `/me` | 내 프로필 조회 |
| PUT | `/me` | 내 프로필 수정 |
| GET | `/me/preference` | 내 성향 조회 |
| PUT | `/me/preference` | 내 성향 수정 |
| POST | `/me/favorites` | 장소 저장 |
| GET | `/me/favorites/list` | 저장한 장소 목록 조회 |
| DELETE | `/me/favorites` | 저장한 장소 삭제 |
| POST | `/me/course` | 코스 저장 |
| GET | `/me/course/list` | 코스 목록 조회 |
| GET | `/me/course/:courseId` | 코스 상세 조회 |
| PATCH | `/me/course/name` | 코스 이름 수정 |
| DELETE | `/me/course` | 코스 삭제 |

---

## GET /me

내 프로필 조회.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| id | integer | 사용자 ID |
| loginId | string | 로그인 ID |
| name | string | 이름 |
| birthDate | string | 생년월일 (`YYYY-MM-DD`) |
| gender | string | 성별 (`MALE` \| `FEMALE`) |
| mbti | string | MBTI |
| hormone | string | 에겐/테토 (`EGEN` \| `TETO`) |
| role | string | 권한 |
| createdAt | string | 가입일시 |

```json
{
  "id": 1,
  "loginId": "user123",
  "name": "홍길동",
  "birthDate": "1995-03-15",
  "gender": "MALE",
  "mbti": "INFP",
  "hormone": "EGEN",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 유저 | `404` | `RESOURCE_NOT_FOUND` |

---

## PUT /me

내 프로필 수정. 모든 필드 선택적.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| name | string | N | 이름 |
| birthDate | string | N | 생년월일 (`YYYY-MM-DD`) |
| gender | string | N | 성별 (`MALE` \| `FEMALE`) |
| mbti | string | N | MBTI |
| hormone | string | N | 에겐/테토 (`EGEN` \| `TETO`) |

### Request 예시

```json
{
  "name": "김철수",
  "mbti": "ENFP"
}
```

### Response

**성공 `200`** — 수정된 프로필 객체 반환 (GET /me와 동일 형태)

---

## GET /me/preference

내 성향 조회.

### Response

**성공 `200`**

1~3 사이의 정수 (1: 낮음, 2: 보통, 3: 높음)

```json
{
  "userId": 1,
  "resOily": 1, "resMild": 3, "resClean": 2, "resStim": 1, "resSpicy": 2,
  "resNoise": 2, "resInterior": 3, "resService": 2,
  "stayView": 3, "stayInterior": 2, "staySpace": 2, "stayNoise": 1, "stayClean": 3, "stayService": 2,
  "actCulture": 2, "actView": 3, "actHealing": 1, "actActive": 2
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 성향 데이터 없음 | `404` | `RESOURCE_NOT_FOUND` |

---

## PUT /me/preference

내 성향 수정. 모든 필드 선택적.

### Request Body

1~3 사이의 정수. 수정할 필드만 전송.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| resOily | integer | N | 음식 기름기 선호도 |
| resMild | integer | N | 음식 담백함 선호도 |
| resClean | integer | N | 음식 청결 선호도 |
| resStim | integer | N | 음식 자극적임 선호도 |
| resSpicy | integer | N | 음식 매움 선호도 |
| resNoise | integer | N | 식당 소음 선호도 |
| resInterior | integer | N | 식당 인테리어 선호도 |
| resService | integer | N | 식당 서비스 선호도 |
| stayView | integer | N | 숙소 전망 선호도 |
| stayInterior | integer | N | 숙소 인테리어 선호도 |
| staySpace | integer | N | 숙소 공간 선호도 |
| stayNoise | integer | N | 숙소 소음 민감도 |
| stayClean | integer | N | 숙소 청결도 선호도 |
| stayService | integer | N | 숙소 서비스 선호도 |
| actCulture | integer | N | 문화 활동 선호도 |
| actView | integer | N | 전망 활동 선호도 |
| actHealing | integer | N | 힐링 활동 선호도 |
| actActive | integer | N | 액티브 활동 선호도 |

### Request 예시

```json
{
  "resMild": 2,
  "stayView": 3
}
```

### Response

**성공 `200`** — 수정된 성향 객체 반환 (GET /me/preference와 동일 형태)

---

## POST /me/favorites

장소 저장.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| domain | string | Y | `restaurant` \| `stay` \| `activity` |
| itemId | integer | Y | 장소 ID |

### Request 예시

```json
{
  "domain": "restaurant",
  "itemId": 12
}
```

### Response

**성공 `201`** — 생성된 즐겨찾기 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 이미 저장된 장소 | `400` | `ALREADY_EXISTS` |

---

## GET /me/favorites/list

저장한 장소 목록 조회. 도메인별로 구분하여 반환.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| restaurants | array | 저장한 식당 목록 |
| restaurants[].id | integer | 즐겨찾기 ID |
| restaurants[].restaurantId | integer | 식당 ID |
| restaurants[].restaurant.name | string | 식당 이름 |
| restaurants[].restaurant.imageUrl | string | 이미지 URL |
| stays | array | 저장한 숙소 목록 |
| stays[].id | integer | 즐겨찾기 ID |
| stays[].stayId | integer | 숙소 ID |
| stays[].stay.name | string | 숙소 이름 |
| stays[].stay.imageUrl | string | 이미지 URL |
| activities | array | 저장한 액티비티 목록 |
| activities[].id | integer | 즐겨찾기 ID |
| activities[].activityId | integer | 액티비티 ID |
| activities[].activity.name | string | 액티비티 이름 |
| activities[].activity.imageUrl | string | 이미지 URL |

```json
{
  "restaurants": [
    { "id": 1, "restaurantId": 12, "restaurant": { "name": "맛있는 식당", "imageUrl": "https://..." } }
  ],
  "stays": [
    { "id": 2, "stayId": 3, "stay": { "name": "오션뷰 펜션", "imageUrl": "https://..." } }
  ],
  "activities": []
}
```

---

## DELETE /me/favorites

저장한 장소 삭제.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| domain | string | Y | `restaurant` \| `stay` \| `activity` |
| itemId | integer | Y | 장소 ID |

### Request 예시

```json
{
  "domain": "restaurant",
  "itemId": 12
}
```

### Response

**성공 `200`** — 삭제된 즐겨찾기 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 저장되지 않은 장소 | `404` | `RESOURCE_NOT_FOUND` |

---

## POST /me/course

테마 추천 결과를 코스로 저장.

### Request Body

| 필드 | 타입 | 필수 | 제약 | 설명 |
|---|---|---|---|---|
| name | string | Y | - | 코스 이름 |
| themeId | integer | Y | 양의 정수 | 테마 ID |
| days | integer | Y | 1~3 | 여행 일수 |
| stay | object | N | - | 숙소. 당일치기이면 생략 |
| stay.id | integer | Y | 양의 정수 | 숙소 ID |
| schedule | array | Y | - | 일자별 일정 |
| schedule[].day | integer | Y | 1 이상 | 일차 |
| schedule[].restaurants | array | Y | - | 식당 목록 |
| schedule[].restaurants[].id | integer | Y | 양의 정수 | 식당 ID |
| schedule[].activity | object | N | - | 액티비티 |
| schedule[].activity.id | integer | Y | 양의 정수 | 액티비티 ID |

### Request 예시

```json
{
  "name": "제주 2박 힐링 여행",
  "themeId": 3,
  "days": 2,
  "stay": { "id": 3 },
  "schedule": [
    {
      "day": 1,
      "restaurants": [{ "id": 12 }, { "id": 7 }],
      "activity": { "id": 22 }
    },
    {
      "day": 2,
      "restaurants": [{ "id": 5 }, { "id": 18 }],
      "activity": { "id": 31 }
    }
  ]
}
```

### Response

**성공 `201`**

```json
{ "courseId": 1 }
```

---

## GET /me/course/list

내 코스 목록 조회. 최신순 정렬.

### Response

**성공 `200`**

```json
[
  {
    "id": 1,
    "themeId": 3,
    "name": "제주 2박 힐링 여행",
    "duration": 2,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## GET /me/course/:courseId

코스 상세 조회. 일자별 식당·액티비티와 숙소 정보 포함.

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| courseId | integer | Y | 코스 ID |

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| id | integer | 코스 ID |
| themeId | integer | 테마 ID |
| name | string | 코스 이름 |
| duration | integer | 여행 일수 |
| createdAt | string | 생성일시 |
| stay | object \| null | 숙소 정보 |
| stay.id | integer | 숙소 ID |
| stay.name | string | 숙소 이름 |
| stay.imageUrl | string | 이미지 URL |
| schedule | array | 일자별 일정 |
| schedule[].day | integer | 일차 |
| schedule[].restaurants | array | 식당 목록 |
| schedule[].restaurants[].id | integer | 식당 ID |
| schedule[].restaurants[].name | string | 식당 이름 |
| schedule[].restaurants[].imageUrl | string | 이미지 URL |
| schedule[].activity | object \| null | 액티비티 |

```json
{
  "id": 1,
  "themeId": 3,
  "name": "제주 2박 힐링 여행",
  "duration": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "stay": { "id": 3, "name": "오션뷰 펜션", "imageUrl": "https://..." },
  "schedule": [
    {
      "day": 1,
      "restaurants": [
        { "id": 12, "name": "맛있는 식당",   "imageUrl": "https://..." },
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
| 존재하지 않는 코스 | `404` | `RESOURCE_NOT_FOUND` |
| 본인 코스 아님 | `403` | `FORBIDDEN` |

---

## PATCH /me/course/name

코스 이름 수정.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| courseId | integer | Y | 코스 ID |
| name | string | Y | 새 코스 이름 |

### Request 예시

```json
{
  "courseId": 1,
  "name": "제주 힐링 코스 (수정)"
}
```

### Response

**성공 `200`** — 수정된 코스 객체 반환

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 코스 | `404` | `RESOURCE_NOT_FOUND` |
| 본인 코스 아님 | `403` | `FORBIDDEN` |

---

## DELETE /me/course

코스 삭제. 연결된 `course_items`도 CASCADE 삭제됨.

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| courseId | integer | Y | 코스 ID |

### Request 예시

```json
{ "courseId": 1 }
```

### Response

**성공 `200`** — 응답 바디 없음

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 코스 | `404` | `RESOURCE_NOT_FOUND` |
| 본인 코스 아님 | `403` | `FORBIDDEN` |
