# Auth API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/auth` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| Access Token 만료 | 1시간 |
| Refresh Token 만료 | 30일 |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |

### ENUM 값

| 필드 | 값 |
|---|---|
| gender | `MALE` \| `FEMALE` |
| mbti | `INTJ` \| `INTP` \| `ENTJ` \| `ENTP` \| `INFJ` \| `INFP` \| `ENFJ` \| `ENFP` \| `ISTJ` \| `ISFJ` \| `ESTJ` \| `ESFJ` \| `ISTP` \| `ISFP` \| `ESTP` \| `ESFP` |
| hormone | `EGEN` \| `TETO` |
| role | `USER` \| `ADMIN` |

---

## 엔드포인트 목록

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| POST | `/auth/signup` | 회원가입 및 여행 성향 저장 | 불필요 |
| POST | `/auth/login` | 로그인 | 불필요 |
| POST | `/auth/refresh` | 토큰 갱신 | 불필요 |
| POST | `/auth/logout` | 로그아웃 | 필요 |

---

## POST /auth/signup

회원가입 및 여행 성향 테스트 정보 저장

### Request Body

#### 사용자 정보

| 필드 | 타입 | 필수 | 제약 조건 |
|---|---|---|---|
| loginId | string | Y | - |
| password | string | Y | 최소 6자 |
| name | string | Y | - |
| birthDate | string | Y | `YYYY-MM-DD` |
| gender | string | Y | `GenderEnum` |
| mbti | string | Y | `MbtiEnum` |
| hormone | string | Y | `HormoneEnum` |
| preferences | object | Y | 아래 참고 |

#### preferences

1~3 사이의 정수 (1: 낮음, 2: 보통, 3: 높음)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| resOily | integer | Y | 음식 기름기 선호도 |
| resClean | integer | Y | 음식 담백함 선호도 |
| resStim | integer | Y | 음식 자극적임 선호도 |
| resSpicy | integer | Y | 음식 매움 선호도 |
| resNoise | integer | Y | 식당 소음 선호도 |
| resInterior | integer | Y | 식당 인테리어 선호도 |
| resService | integer | Y | 식당 서비스 선호도 |
| stayView | integer | Y | 숙소 전망 선호도 |
| stayInterior | integer | Y | 숙소 인테리어 선호도 |
| staySpace | integer | Y | 숙소 공간 선호도 |
| stayNoise | integer | Y | 숙소 소음 민감도 |
| stayClean | integer | Y | 숙소 청결도 선호도 |
| stayService | integer | Y | 숙소 서비스 선호도 |
| actCulture | integer | Y | 문화 활동 선호도 |
| actView | integer | Y | 전망 활동 선호도 |
| actHealing | integer | Y | 힐링 활동 선호도 |
| actActive | integer | Y | 액티브 활동 선호도 |

### Request 예시

```json
{
  "loginId": "user123",
  "password": "password123",
  "name": "홍길동",
  "birthDate": "1995-03-15",
  "gender": "MALE",
  "mbti": "INFP",
  "hormone": "EGEN",
  "preferences": {
    "resOily": 1, "resClean": 2, "resStim": 3, "resSpicy": 1,
    "resNoise": 2, "resInterior": 3, "resService": 1,
    "stayView": 2, "stayInterior": 3, "staySpace": 1,
    "stayNoise": 2, "stayClean": 3, "stayService": 1,
    "actCulture": 2, "actView": 3, "actHealing": 1, "actActive": 2
  }
}
```

### Response

**성공 `201`**

| 필드 | 타입 | 설명 |
|---|---|---|
| accessToken | string | JWT Access Token (1시간) |
| refreshToken | string | JWT Refresh Token (30일) |
| user.id | integer | 사용자 ID |
| user.name | string | 사용자 이름 |
| user.role | string | 사용자 권한 |

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": 1, "name": "홍길동", "role": "USER" }
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 아이디 중복 | `400` | `DUPLICATE_LOGIN_ID` |
| 필드 누락 또는 형식 오류 | `400` | `REQUIRED_FIELD_MISSING` |

---

## POST /auth/login

로그인

### Request Body

| 필드 | 타입 | 필수 | 제약 조건 |
|---|---|---|---|
| loginId | string | Y | - |
| password | string | Y | - |

### Request 예시

```json
{
  "loginId": "user123",
  "password": "password123"
}
```

### Response

**성공 `200`**

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": 1, "name": "홍길동", "role": "USER" }
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 존재하지 않는 아이디 | `404` | `RESOURCE_NOT_FOUND` |
| 비밀번호 불일치 | `400` | `INVALID_CREDENTIALS` |
| 필드 누락 | `400` | `REQUIRED_FIELD_MISSING` |

---

## POST /auth/refresh

Access Token 및 Refresh Token 갱신 (토큰 rotate)

### Request Body

| 필드 | 타입 | 필수 | 제약 조건 |
|---|---|---|---|
| refreshToken | string | Y | - |

### Request 예시

```json
{
  "refreshToken": "eyJhbGci..."
}
```

### Response

**성공 `200`**

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": 1, "name": "홍길동", "role": "USER" }
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 유효하지 않거나 만료된 토큰 | `400` | `INVALID_TOKEN` |
| 필드 누락 | `400` | `REQUIRED_FIELD_MISSING` |

---

## POST /auth/logout

로그아웃 (서버의 Refresh Token 무효화)

### Request Header

| 헤더 | 값 | 필수 |
|---|---|---|
| Authorization | `Bearer {accessToken}` | Y |

### Response

**성공 `200`**

```json
{
  "message": "ok"
}
```

**실패**

| 상황 | Status | code |
|---|---|---|
| 토큰 없음 또는 유효하지 않은 토큰 | `401` | - |
