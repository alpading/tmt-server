import { apiClient } from './apiClient';
import { CourseSpot, SavedCourse, SavedPlace } from '../types';

// ─── 서버 즐겨찾기 응답 타입 ───────────────────────────────────────────────────
interface FavRestaurantRow { id: number; restaurantId: number; restaurant: { name: string; imageUrl: string }; avgRating: number | null }
interface FavStayRow       { id: number; stayId: number;       stay:       { name: string; imageUrl: string }; avgRating: number | null }
interface FavActivityRow   { id: number; activityId: number;   activity:   { name: string; imageUrl: string }; avgRating: number | null }
interface FavListResponse  { restaurants: FavRestaurantRow[]; stays: FavStayRow[]; activities: FavActivityRow[] }

// ─── 서버 코스 응답 타입 ───────────────────────────────────────────────────────
interface CourseListItem { id: number; themeId: number; themeName: string; name: string; duration: number; createdAt: string }

interface SavedCourseDetailItem { id: number; name: string; imageUrl: string; avgRating: number | null }
interface SavedCourseScheduleSlot { day: number; restaurants: SavedCourseDetailItem[]; activity: SavedCourseDetailItem | null }
export interface SavedCourseDetailResponse {
  id: number; themeId: number; themeName?: string; name: string; duration: number; createdAt: string;
  stay: SavedCourseDetailItem | null;
  schedule: SavedCourseScheduleSlot[];
}

export interface PlaceDetail {
  name: string;
  category: string;
  location: string;
  rating: string;
  image: string;
  description?: string;
  features?: string[];
}

// ─── 지역 타입 ─────────────────────────────────────────────────────────────────

/** 서버 GET /regions 응답 + 지도 오버레이 메타데이터를 합친 시/도 */
export interface Province {
  id: number;
  dbName: string;       // DB에 저장된 이름 (e.g., '경기')
  displayName: string;  // 화면 표시 이름 (e.g., '경기도')
  top: string;
  left: string;
  color: string;
  pulse?: boolean;
}

/** 서버 GET /regions/:id/districts 응답 */
export interface DistrictOption {
  id: number;
  name: string;
}

// DB 단축 이름 → 화면 표시 이름
const PROVINCE_DISPLAY_NAME: Record<string, string> = {
  경기: '경기도', 강원: '강원도',
  충북: '충청북도', 충남: '충청남도',
  전북: '전라북도', 전남: '전라남도',
  경북: '경상북도', 경남: '경상남도',
  제주: '제주도',
};

// 지도 오버레이 좌표 (표시 이름 기준)
const REGION_COORDS: Record<string, Omit<Province, 'id' | 'dbName' | 'displayName'>> = {
  '서울':    { top: '28%', left: '43%', color: 'bg-orange-500' },
  '인천':    { top: '29%', left: '32%', color: 'bg-green-500' },
  '경기도':  { top: '36%', left: '45%', color: 'bg-yellow-500' },
  '강원도':  { top: '26%', left: '65%', color: 'bg-cyan-500' },
  '충청북도': { top: '44%', left: '58%', color: 'bg-lime-500' },
  '충청남도': { top: '52%', left: '38%', color: 'bg-purple-500' },
  '전라북도': { top: '64%', left: '42%', color: 'bg-blue-500' },
  '경상북도': { top: '55%', left: '70%', color: 'bg-amber-500' },
  '전라남도': { top: '78%', left: '38%', color: 'bg-teal-500' },
  '경상남도': { top: '74%', left: '62%', color: 'bg-rose-500' },
  '제주도':  { top: '94%', left: '40%', color: 'bg-emerald-500', pulse: true },
};

// 폴백 (API 실패 시)
const STATIC_PROVINCES: Province[] = Object.entries(REGION_COORDS).map(([displayName, coords]) => ({
  id: 0,
  dbName: displayName,
  displayName,
  ...coords,
}));

// ─── 테마 / 코스 추천 타입 ────────────────────────────────────────────────────

/** GET /api/theme/list 응답 */
export interface ThemeResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

/** 코스 내 개별 장소 (서버 응답) */
export interface ItineraryItem {
  id: number;
  name: string;
  imageUrl: string;
  score: number;      // 랭킹용 가중 점수
  avgRating: number;  // 표시용 평균 총 평점
}

/** 하루 일정 */
export interface DaySchedule {
  day: number;
  restaurants: ItineraryItem[];
  activity: ItineraryItem;
}

/** GET /api/theme/:id/district/:districtId?days= 응답 */
export interface ItineraryResponse {
  days: number;
  stay: ItineraryItem | null;
  schedule: DaySchedule[];
}

// 카테고리별 플레이스홀더 이미지 (DB imageUrl이 비어있을 때 사용)
const PLACEHOLDER = {
  restaurant: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80',
  activity:   'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
  stay:       'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
};

/** ItineraryResponse → CourseSpot[] 변환 (itemId 보존) */
export function mapItinerary(data: ItineraryResponse): import('../types').CourseSpot[] {
  const spots: import('../types').CourseSpot[] = [];
  // 중복 방지: 같은 식당 ID가 여러 일차에 걸쳐 들어오는 경우 한 번만 추가
  const seenRestaurantIds = new Set<number>();

  const addRestaurant = (r: ItineraryItem | undefined, day: number, desc: string) => {
    if (!r || seenRestaurantIds.has(r.id)) return;
    seenRestaurantIds.add(r.id);
    spots.push({
      itemId: r.id,
      day, category: 'restaurant',
      name: r.name,
      rating: r.avgRating ?? Math.round(r.score * 10) / 10,
      image: r.imageUrl || PLACEHOLDER.restaurant,
      desc, memo: '',
    });
  };

  // 2일 이상 여행에서만 숙소를 1일차 맨 처음에 1번 추가
  if (data.days >= 2 && data.stay) {
    spots.push({
      itemId: data.stay.id,
      day: 1, category: 'stay',
      name: data.stay.name,
      rating: data.stay.avgRating ?? Math.round(data.stay.score * 10) / 10,
      image: data.stay.imageUrl || PLACEHOLDER.stay,
      desc: '추천 숙소', memo: '',
    });
  }

  data.schedule.forEach(({ day, restaurants, activity }) => {
    addRestaurant(restaurants[0], day, '현지 인기 맛집');
    addRestaurant(restaurants[1], day, '현지 인기 맛집');
    if (activity) {
      spots.push({
        itemId: activity.id,
        day, category: 'activity',
        name: activity.name,
        rating: activity.avgRating ?? Math.round(activity.score * 10) / 10,
        image: activity.imageUrl || PLACEHOLDER.activity,
        desc: '이 지역 대표 액티비티', memo: '',
      });
    }
    addRestaurant(restaurants[2], day, '저녁 추천 맛집');
  });

  return spots;
}


/** SavedCourseDetailResponse → CourseSpot[] 변환 */
export function mapSavedCourse(data: SavedCourseDetailResponse): import('../types').CourseSpot[] {
  const spots: import('../types').CourseSpot[] = [];

  if (data.stay) {
    spots.push({
      itemId: data.stay.id,
      day: 1, category: 'stay',
      name: data.stay.name,
      rating: data.stay.avgRating ?? 0,
      image: data.stay.imageUrl || PLACEHOLDER.stay,
      desc: '추천 숙소', memo: '',
    });
  }

  for (const slot of data.schedule) {
    for (const r of slot.restaurants) {
      spots.push({
        itemId: r.id,
        day: slot.day, category: 'restaurant',
        name: r.name,
        rating: r.avgRating ?? 0,
        image: r.imageUrl || PLACEHOLDER.restaurant,
        desc: '현지 인기 맛집', memo: '',
      });
    }
    if (slot.activity) {
      spots.push({
        itemId: slot.activity.id,
        day: slot.day, category: 'activity',
        name: slot.activity.name,
        rating: slot.activity.avgRating ?? 0,
        image: slot.activity.imageUrl || PLACEHOLDER.activity,
        desc: '이 지역 대표 액티비티', memo: '',
      });
    }
  }
  return spots;
}

export const travelService = {
  /**
   * GET /api/regions — 지도에 표시할 시/도 목록 (좌표 포함)
   */
  async getRegions(): Promise<Province[]> {
    try {
      const { data } = await apiClient.get<{ id: number; name: string }[]>('/regions');
      return data
        .map((p) => {
          const displayName = PROVINCE_DISPLAY_NAME[p.name] ?? p.name;
          const coords = REGION_COORDS[displayName];
          if (!coords) return null; // 지도에 없는 시/도 제외
          return { id: p.id, dbName: p.name, displayName, ...coords };
        })
        .filter(Boolean) as Province[];
    } catch {
      return STATIC_PROVINCES;
    }
  },

  /**
   * GET /api/regions/:provinceId/districts — 선택된 시/도의 시/군/구 목록
   */
  async getDistricts(provinceId: number): Promise<DistrictOption[]> {
    const { data } = await apiClient.get<DistrictOption[]>(`/regions/${provinceId}/districts`);
    return data;
  },

  /**
   * GET /api/theme/list — 테마 목록
   */
  async getThemes(): Promise<ThemeResponse[]> {
    const { data } = await apiClient.get<ThemeResponse[]>('/theme/list');
    return data;
  },

  /**
   * GET /api/theme/:themeId/district/:districtId?days= — 개인화 코스 추천
   */
  async getItinerary(themeId: number, districtId: number, days: number): Promise<ItineraryResponse> {
    const { data } = await apiClient.get<ItineraryResponse>(
      `/theme/${themeId}/district/${districtId}?days=${days}`,
    );
    return data;
  },

  // ─── 즐겨찾기 ─────────────────────────────────────────────────────────────────

  /** GET /me/favorites/list — 저장된 장소 목록 */
  async getSavedPlaces(): Promise<SavedPlace[]> {
    const { data } = await apiClient.get<FavListResponse>('/me/favorites/list');
    const toRating = (avg: number | null) =>
      avg != null ? String(avg) : '-';
    const places: SavedPlace[] = [];
    for (const r of data.restaurants ?? []) {
      places.push({
        itemId: r.restaurantId, domain: 'restaurant',
        name: r.restaurant.name, category: '식당',
        location: '식당', rating: toRating(r.avgRating),
        image: r.restaurant.imageUrl || PLACEHOLDER.restaurant,
      });
    }
    for (const s of data.stays ?? []) {
      places.push({
        itemId: s.stayId, domain: 'stay',
        name: s.stay.name, category: '숙소',
        location: '숙소', rating: toRating(s.avgRating),
        image: s.stay.imageUrl || PLACEHOLDER.stay,
      });
    }
    for (const a of data.activities ?? []) {
      places.push({
        itemId: a.activityId, domain: 'activity',
        name: a.activity.name, category: '액티비티',
        location: '액티비티', rating: toRating(a.avgRating),
        image: a.activity.imageUrl || PLACEHOLDER.activity,
      });
    }
    return places;
  },

  /** POST /me/favorites — 즐겨찾기 추가 */
  async savePlace(domain: 'restaurant' | 'stay' | 'activity', itemId: number): Promise<void> {
    await apiClient.post('/me/favorites', { domain, itemId });
  },

  /** DELETE /me/favorites — 즐겨찾기 삭제 */
  async unsavePlace(domain: 'restaurant' | 'stay' | 'activity', itemId: number): Promise<void> {
    await apiClient.delete('/me/favorites', { domain, itemId });
  },

  // ─── 저장된 코스 ──────────────────────────────────────────────────────────────

  /** GET /me/course/list — 저장된 코스 목록 */
  async getSavedCourses(): Promise<SavedCourse[]> {
    const { data } = await apiClient.get<CourseListItem[]>('/me/course/list');
    const DURATION_LABEL: Record<number, string> = { 1: '당일치기', 2: '1박 2일', 3: '2박 3일' };
    const ICON_BY_THEME: Record<number, string> = { 1: 'clock', 2: 'pin', 3: 'moon', 4: 'waves' };
    return data.map((c) => ({
      id: c.id,
      title: c.name,
      themeName: c.themeName,
      info: DURATION_LABEL[c.duration] ?? `${c.duration}일 코스`,
      image: PLACEHOLDER.activity,
      iconType: ICON_BY_THEME[c.themeId % 4] ?? 'clock',
    }));
  },

  /** POST /me/course — 코스 저장 */
  async saveCourse(dto: {
    name: string; themeId: number; days: number;
    stay?: { id: number };
    schedule: { day: number; restaurants: { id: number }[]; activity?: { id: number } }[];
  }): Promise<{ courseId: number }> {
    const { data } = await apiClient.post<{ courseId: number }>('/me/course', dto);
    return data;
  },

  /** GET /me/course/:courseId — 저장된 코스 상세 조회 */
  async getSavedCourseDetail(courseId: number): Promise<SavedCourseDetailResponse> {
    const { data } = await apiClient.get<SavedCourseDetailResponse>(`/me/course/${courseId}`);
    return data;
  },

  /** PATCH /me/course/name — 저장된 코스 이름 변경 */
  async updateCourseName(courseId: number, name: string): Promise<void> {
    await apiClient.patch('/me/course/name', { courseId, name });
  },

  /** DELETE /me/course — 코스 삭제 (courseId 기준) */
  async unsaveCourse(courseId: number): Promise<void> {
    await apiClient.delete('/me/course', { courseId });
  },

  // ─── 개별 카테고리 검색 ──────────────────────────────────────────────────────

  /** GET /api/activities/search/district/:districtId */
  async searchActivities(districtId: number, params?: { basicFilters?: string; prefAttrIds?: string }): Promise<{ id: number; name: string; imageUrl: string | null; score: number }[]> {
    const q = new URLSearchParams();
    if (params?.basicFilters) q.set('basicFilters', params.basicFilters);
    if (params?.prefAttrIds)  q.set('prefAttrIds',  params.prefAttrIds);
    const query = q.toString() ? `?${q.toString()}` : '';
    const { data } = await apiClient.get<{ results: { id: number; name: string; imageUrl: string | null; score: number }[] }>(
      `/activities/search/district/${districtId}${query}`,
    );
    return data.results ?? [];
  },

  /** GET /api/restaurants/search/district/:districtId */
  async searchRestaurants(districtId: number, params?: { categoryId?: number; basicFilters?: string; prefAttrIds?: string }): Promise<{ id: number; name: string; imageUrl: string | null; score: number }[]> {
    const q = new URLSearchParams();
    if (params?.categoryId)   q.set('categoryId',   String(params.categoryId));
    if (params?.basicFilters) q.set('basicFilters', params.basicFilters);
    if (params?.prefAttrIds)  q.set('prefAttrIds',  params.prefAttrIds);
    const query = q.toString() ? `?${q.toString()}` : '';
    const { data } = await apiClient.get<{ results: { id: number; name: string; imageUrl: string | null; score: number }[] }>(
      `/restaurants/search/district/${districtId}${query}`,
    );
    return data.results ?? [];
  },

  /** GET /api/stays/search/district/:districtId */
  async searchStays(districtId: number, params?: { categoryId?: number; basicFilters?: string; prefAttrIds?: string }): Promise<{ id: number; name: string; imageUrl: string | null; score: number }[]> {
    const q = new URLSearchParams();
    if (params?.categoryId)   q.set('categoryId',   String(params.categoryId));
    if (params?.basicFilters) q.set('basicFilters', params.basicFilters);
    if (params?.prefAttrIds)  q.set('prefAttrIds',  params.prefAttrIds);
    const query = q.toString() ? `?${q.toString()}` : '';
    const { data } = await apiClient.get<{ results: { id: number; name: string; imageUrl: string | null; score: number }[] }>(
      `/stays/search/district/${districtId}${query}`,
    );
    return data.results ?? [];
  },
};
