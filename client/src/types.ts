export interface User {
  id: string;
  loginId?: string;
  name: string;
  gender: 'male' | 'female' | '남성' | '여성';
  birthDate: string; // YYYYMMDD
  mbti: string;
  tendency: 'egen' | 'teto' | '에겐' | '테토';
  savedCoursesCount: number;
  savedPlacesCount: number;
}

export interface CourseSpot {
  itemId?: number;   // 서버 item ID (bookmark/review에 사용)
  category: 'restaurant' | 'stay' | 'activity' | 'cafe';
  name: string;
  rating: number;
  image: string;
  desc: string;
  memo: string;
  cost?: string;
  day?: number;
}

export interface SavedCourse {
  id?: number;       // 서버 course ID (삭제에 사용)
  title: string;
  info: string;
  image: string;
  iconType: string;
  themeName?: string; // 원본 테마 이름
}

export interface SavedPlace {
  itemId?: number;                                    // 서버 item ID
  domain?: 'restaurant' | 'stay' | 'activity';       // 도메인
  name: string;
  location: string;
  category: string;
  rating: string;
  image: string;
}

export interface Region {
  name: string;
  top: string;
  left: string;
  color: string;
  pulse?: boolean;
}

export interface PlaceAttribute {
  key?: string;
  label: string;
  value: string;
}

export interface ReviewAnalytics {
  top_mbti_group: { group: string; average_rating: number } | null;
  top_style_group: { group: string; average_rating: number } | null;
  top_preference_attributes: { category: string; attribute: string; average_rating: number }[];
}

