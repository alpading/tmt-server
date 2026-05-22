# Stat API

## 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | `/api/stat` |
| 인증 방식 | Bearer JWT (`Authorization: Bearer {accessToken}`) |
| 에러 응답 포맷 | `{ "error": { "code": string, "message": string } }` |
| 모든 엔드포인트 | 인증 필요 |

### Path Parameters (공통)

| 파라미터 | 타입 | 설명 |
|---|---|---|
| domain | string | `restaurant` \| `stay` \| `activity` |
| itemId | integer | 해당 장소의 ID |

---

## 엔드포인트 목록

| Method | URL | 설명 |
|---|---|---|
| GET | `/stat/{domain}/{itemId}/mbti` | MBTI별 최고 평점 집단 조회 |
| GET | `/stat/{domain}/{itemId}/hormone` | 에겐/테토별 최고 평점 집단 조회 |
| GET | `/stat/{domain}/{itemId}/overall` | 전체 평점 조회 |
| GET | `/stat/{domain}/{itemId}/preference` | 성향 속성별 최고 평점 집단 조회 |

---

## GET /stat/{domain}/{itemId}/mbti

16가지 MBTI 중 해당 장소의 `overall_rating` 평균이 가장 높은 집단과 평균 평점 반환.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| mbti | string | 최고 평점 MBTI 유형 |
| avgRating | number | 해당 MBTI 집단의 평균 종합 평점 (소수점 1자리) |

```json
{ "mbti": "INFP", "avgRating": 4.8 }
```

> 리뷰 데이터가 없으면 `null` 반환

---

## GET /stat/{domain}/{itemId}/hormone

에겐(`EGEN`) / 테토(`TETO`) 중 `overall_rating` 평균이 더 높은 집단과 평균 평점 반환.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| hormone | string | 최고 평점 호르몬 유형 (`EGEN` \| `TETO`) |
| avgRating | number | 해당 집단의 평균 종합 평점 (소수점 1자리) |

```json
{ "hormone": "EGEN", "avgRating": 4.6 }
```

> 리뷰 데이터가 없으면 `null` 반환

---

## GET /stat/{domain}/{itemId}/overall

해당 장소의 전체 평균 평점과 리뷰 수 반환.

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| avgRating | number \| null | 평균 종합 평점 (소수점 1자리). 리뷰 없으면 `null` |
| count | integer | 총 리뷰 수 |

```json
{ "avgRating": 4.5, "count": 128 }
```

---

## GET /stat/{domain}/{itemId}/preference

도메인별 성향 카테고리(중분류)마다, 선호도가 높은 집단(`snap_value = 3`)중 `target_rating` 평균이 가장 높은 속성을 반환.

### 카테고리 구성

| domain | 카테고리 | target_rating | 포함 속성 |
|---|---|---|---|
| restaurant | 맛 | `taste_rating` | 느끼한, 담백한, 자극적인, 매운 |
| restaurant | 공간 | `space_rating` | 인테리어, 친절도, 소음, 청결도 |
| stay | 인테리어 및 풍경 | `interior_rating` | 풍경, 인테리어, 협소하지 않은 공간 |
| stay | 쾌적도 | `clean_rating` | 방음, 청결도, 친절도 |
| activity | (없음) | `overall_rating` | 문화·전시, 풍경·감상, 힐링·휴식, 활동·경험 |

### Response

**성공 `200`**

| 필드 | 타입 | 설명 |
|---|---|---|
| category | string \| null | 카테고리 이름. 액티비티는 `null` |
| attribute | string | 해당 카테고리에서 최고 평점을 기록한 속성 이름 |
| avgRating | number | 해당 속성 선호 집단의 평균 `target_rating` (소수점 1자리) |

**식당 예시**
```json
[
  { "category": "맛",  "attribute": "담백한", "avgRating": 4.9 },
  { "category": "공간", "attribute": "인테리어", "avgRating": 4.7 }
]
```

**숙소 예시**
```json
[
  { "category": "인테리어 및 풍경", "attribute": "풍경",  "avgRating": 4.8 },
  { "category": "쾌적도",          "attribute": "청결도", "avgRating": 4.6 }
]
```

**액티비티 예시**
```json
[
  { "category": null, "attribute": "힐링·휴식", "avgRating": 4.7 }
]
```

> 특정 카테고리의 `snap_value = 3` 리뷰가 없으면 해당 카테고리 항목은 응답에서 제외됨
