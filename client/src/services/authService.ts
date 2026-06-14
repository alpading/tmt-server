import { User } from '../types';
import { apiClient, tokenStore } from './apiClient';

// ─── 서버 응답 타입 ────────────────────────────────────────────────────────────
export interface PreferenceQuestion {
  id: number;
  text: string;
  prefKey: string;
  options: [string, string, string];
}

export interface PreferenceSection {
  sectionTitle: string;
  sectionOrder: number;
  questions: PreferenceQuestion[];
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: number; name: string; role: string };
}

interface ProfileResponse {
  id: number;
  loginId: string;
  name: string;
  gender: string;
  birthDate: string;
  mbti: string;
  hormone: string;        // 'TETO' | 'EGEN'
  role: string;
}

// ─── 변환 헬퍼 ────────────────────────────────────────────────────────────────

/** 서버 hormone('TETO'|'EGEN') → 클라이언트 tendency('teto'|'egen') */
const toTendency = (hormone: string): User['tendency'] =>
  hormone?.toLowerCase() === 'teto' ? 'teto' : 'egen';

/** 클라이언트 tendency 표현('테토'|'teto'|'에겐'|'egen') → 서버 HormoneEnum */
const toHormone = (tendency: string): string =>
  ['테토', 'teto', 'TETO'].includes(tendency) ? 'TETO' : 'EGEN';

/** 클라이언트 gender 표현('남성'|'여성'|'male'|'female') → 서버 GenderEnum */
const toServerGender = (gender: string): string => {
  if (gender === '남성' || gender === 'male' || gender === 'MALE') return 'MALE';
  if (gender === '여성' || gender === 'female' || gender === 'FEMALE') return 'FEMALE';
  return 'MALE';
};

/** 서버 GenderEnum('MALE'|'FEMALE') → 클라이언트 내부값('male'|'female') */
const toClientGender = (gender: string): User['gender'] =>
  gender === 'MALE' ? 'male' : 'female';

/** YYYYMMDD → YYYY-MM-DD (서버 @IsDateString 형식) */
const toIsoDate = (raw: string): string => {
  const s = raw.replace(/-/g, '');
  return s.length === 8
    ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
    : raw;
};

/** 서버 날짜(ISO) → YYYYMMDD (클라이언트 내부 형식) */
const toClientDate = (serverDate: string): string =>
  (serverDate ?? '').slice(0, 10).replace(/-/g, '');

/** 서버 User → 클라이언트 User */
const toClientUser = (p: ProfileResponse): User => ({
  id: String(p.id),
  loginId: p.loginId ?? '',
  name: p.name,
  gender: toClientGender(p.gender),
  birthDate: toClientDate(p.birthDate),
  mbti: p.mbti ?? '',
  tendency: toTendency(p.hormone),
  savedCoursesCount: 0,
  savedPlacesCount: 0,
});

/** 회원가입 시 전송되는 기본 성향 (중립값=2) — 여행 테스트 후 PATCH /me/preference로 업데이트 */
const DEFAULT_PREFERENCES = {
  resOily: 2, resMild: 2, resClean: 2, resStim: 2,
  resSpicy: 2, resNoise: 2, resInterior: 2, resService: 2,
  stayView: 2, stayInterior: 2, staySpace: 2, stayNoise: 2,
  stayClean: 2, stayService: 2,
  actCulture: 2, actView: 2, actHealing: 2, actActive: 2,
};

const VALID_MBTIS = new Set([
  'ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
  'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ',
]);

// ─── authService ──────────────────────────────────────────────────────────────
export const authService = {
  /**
   * POST /auth/login
   */
  async login(loginId: string, password?: string): Promise<User> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { loginId, password });
    tokenStore.set(data.accessToken, data.refreshToken);

    const profile = await this.getCurrentUser();
    if (!profile) throw new Error('프로필을 불러오지 못했습니다.');
    return profile;
  },

  /**
   * POST /auth/register
   */
  async register(
    registrationData: Omit<User, 'savedCoursesCount' | 'savedPlacesCount'> & { password?: string },
  ): Promise<User> {
    const rawMbti = (registrationData.mbti ?? '').toUpperCase();
    if (!VALID_MBTIS.has(rawMbti)) {
      throw new Error('MBTI를 선택해주세요.');
    }

    const { data } = await apiClient.post<LoginResponse>('/auth/signup', {
      loginId:     registrationData.id,
      password:    registrationData.password,
      name:        registrationData.name,
      gender:      toServerGender(registrationData.gender as string),
      birthDate:   toIsoDate(registrationData.birthDate ?? ''),
      mbti:        rawMbti,
      hormone:     toHormone(registrationData.tendency as string),
      preferences: DEFAULT_PREFERENCES,
    });
    tokenStore.set(data.accessToken, data.refreshToken);

    const profile = await this.getCurrentUser();
    if (!profile) throw new Error('프로필을 불러오지 못했습니다.');
    return profile;
  },

  /**
   * GET /me  (토큰 필요)
   */
  async getCurrentUser(): Promise<User | null> {
    if (!tokenStore.getAccess()) return null;
    try {
      const { data } = await apiClient.get<ProfileResponse>('/me');
      return toClientUser(data);
    } catch {
      return null;
    }
  },

  /**
   * POST /auth/logout  (서버 refresh token 무효화 + 로컬 토큰 삭제)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // 서버 오류나 토큰 만료가 있어도 로컬 토큰은 삭제
    } finally {
      tokenStore.clear();
    }
  },

  /**
   * PATCH /me
   */
  async updateProfile(_userId: string, data: Partial<User>): Promise<User> {
    const body: Record<string, any> = {};
    if (data.name)      body.name     = data.name;
    if (data.gender)    body.gender   = toServerGender(data.gender as string);
    if (data.birthDate) body.birthDate = toIsoDate(data.birthDate);
    if (data.mbti)      body.mbti     = data.mbti;
    if (data.tendency)  body.hormone  = toHormone(data.tendency as string);

    await apiClient.put('/me', body);
    const updated = await this.getCurrentUser();
    if (!updated) throw new Error('프로필 수정 후 조회 실패');
    return updated;
  },

  /**
   * GET /auth/check-id?loginId=  (아이디 중복 확인)
   */
  async checkIdExists(id: string): Promise<boolean> {
    try {
      const { data } = await apiClient.get<{ exists: boolean }>(
        `/auth/check-id?loginId=${encodeURIComponent(id)}`,
      );
      return data?.exists ?? false;
    } catch {
      return false;
    }
  },

  /**
   * GET /me/preference  (저장된 성향값 조회)
   * 반환: { [questionId(1~18)]: optionIdx(0=강함, 1=보통, 2=약함) }
   * snap → optionIdx: 3→0, 2→1, 1→2  (snap = 3 - optionIdx)
   */
  async getPreference(): Promise<Record<number, number> | null> {
    if (!tokenStore.getAccess()) return null;
    const KEY_TO_Q: Record<string, number> = {
      resOily: 1,    resMild: 2,    resStim: 3,    resSpicy: 4,
      resNoise: 5,   resClean: 6,   resInterior: 7, resService: 8,
      stayView: 9,   stayInterior: 10, staySpace: 11, stayNoise: 12,
      stayClean: 13, stayService: 14,
      actCulture: 15, actView: 16, actHealing: 17, actActive: 18,
    };
    try {
      const { data } = await apiClient.get<Record<string, number>>('/me/preference');
      const result: Record<number, number> = {};
      for (const [key, snap] of Object.entries(data)) {
        const qId = KEY_TO_Q[key];
        if (qId !== undefined && typeof snap === 'number') {
          result[qId] = 3 - snap; // snap 3→0, 2→1, 1→2
        }
      }
      return result;
    } catch {
      return null;
    }
  },

  /** GET /preferences/questions — 성향 질문 목록 (공개 API) */
  async getPreferenceQuestions(): Promise<PreferenceSection[]> {
    const res = await apiClient.get<PreferenceSection[]>('/preferences/questions');
    return res.data;
  },

  /**
   * DELETE /me  (회원 탈퇴 — 소프트 삭제)
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/me');
    tokenStore.clear();
  },

  /**
   * PUT /me/preference  (성향 퀴즈 결과 저장)
   * answers: { [questionId]: optionIdx(0=강함, 1=보통, 2=약함) }
   * prefKeyMap: { [questionId]: prefKey } — DB에서 받은 매핑
   * snap 변환: optionIdx 0→3, 1→2, 2→1
   */
  async updateTravelTendency(
    _userId: string,
    answers: Record<number, number>,
    prefKeyMap?: Record<number, string>,
  ): Promise<User> {
    // prefKeyMap이 없으면 기존 하드코딩 fallback (하위 호환)
    const Q_TO_KEY: Record<number, string> = prefKeyMap ?? {
      1:  'resOily',    2:  'resMild',    3:  'resStim',    4:  'resSpicy',
      5:  'resNoise',   6:  'resClean',   7:  'resInterior', 8: 'resService',
      9:  'stayView',   10: 'stayInterior', 11: 'staySpace', 12: 'stayNoise',
      13: 'stayClean',  14: 'stayService',
      15: 'actCulture', 16: 'actView',   17: 'actHealing', 18: 'actActive',
    };

    const body: Record<string, number> = {};
    for (const [qId, optionIdx] of Object.entries(answers)) {
      const key = Q_TO_KEY[Number(qId)];
      if (key !== undefined) body[key] = 3 - optionIdx; // 0→3, 1→2, 2→1
    }

    await apiClient.put('/me/preference', body);
    const updated = await this.getCurrentUser();
    if (!updated) throw new Error('성향 업데이트 후 조회 실패');
    return updated;
  },
};
