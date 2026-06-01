import { apiClient } from './apiClient';
import { Review, ReviewAnalytics } from '../types';

export const reviewService = {
  /** POST /api/:domain/rating */
  async submitRating(
    type: 'restaurant' | 'stay' | 'activity',
    payload: Record<string, unknown>,
  ): Promise<void> {
    const endpoint =
      type === 'restaurant' ? '/restaurants/rating' :
      type === 'stay'       ? '/stays/rating' :
                              '/activities/rating';
    await apiClient.post(endpoint, payload);
  },

  /**
   * Submit a new review
   * Real API Note: Replace with POST '/api/reviews'
   */
  async submitReview(reviewData: {
    placeName: string;
    type: 'restaurant' | 'stay' | 'activity' | 'cafe';
    overallRating: number;
    subRating1: number; // Food / Atmosphere
    subRating2: number; // Service
    content: string;
    authorName?: string;
  }): Promise<Review> {
    console.log('[reviewService] submitting review', reviewData);
    
    await apiClient.post('/reviews', reviewData);

    const newReview: Review = {
      id: Math.random().toString(36).substring(7),
      author: reviewData.authorName || '홍길동',
      rating: reviewData.overallRating,
      date: new Date().toISOString().split('T')[0],
      content: reviewData.content,
    };

    // Storing locally in user history
    const stored = localStorage.getItem('user_written_reviews');
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch {
        list = [];
      }
    }
    list.unshift({ ...newReview, placeName: reviewData.placeName });
    localStorage.setItem('user_written_reviews', JSON.stringify(list));

    return newReview;
  },

  /**
   * Get reviews for a particular place
   * Real API Note: Replace with GET '/api/reviews?placeName=X'
   */
  async getReviews(placeName: string): Promise<Review[]> {
    await apiClient.get(`/reviews?placeName=${placeName}`);

    const baseReviews: Review[] = [
      {
        id: '1',
        author: '김민준',
        rating: 5.0,
        content: '인생 최고의 경험이었습니다! 직원분들도 모두 너무 친절하셨고, 공간 인테리어 하나하나 대접받는 행복감이 가득했습니다. 강추합니다!',
        date: '2026.04.12',
      },
      {
        id: '2',
        author: '이지은',
        rating: 4.5,
        content: '분위기가 정말 좋습니다. 아쉬운 점은 웨이팅이 조금 길고 주차가 복잡하다는 점이지만, 음식 퀄리티와 맛을 보면 모든 것이 다 용서되는 수준이네요.',
        date: '2026.04.05',
      },
    ];

    // Read matching local reviews
    const stored = localStorage.getItem('user_written_reviews');
    if (stored) {
      try {
        const list = JSON.parse(stored);
        const filtered = list.filter((r: any) => r.placeName === placeName);
        return [...filtered, ...baseReviews];
      } catch {
        return baseReviews;
      }
    }

    return baseReviews;
  },

  /**
   * GET /stat/:domain/:itemId/mbti|hormone|preference
   * itemId: DB ID of the place (null → returns null, detail page shows placeholder)
   */
  async getReviewAnalytics(
    itemId: number | null,
    category: 'restaurant' | 'stay' | 'activity',
  ): Promise<ReviewAnalytics | null> {
    if (!itemId) return null;

    const domain = category; // 'restaurant' | 'stay' | 'activity'

    try {
      const [mbtiRes, hormoneRes, prefRes] = await Promise.all([
        apiClient.get<{ mbti: string; avgRating: number } | null>(
          `/stat/${domain}/${itemId}/mbti`,
        ),
        apiClient.get<{ hormone: string; avgRating: number } | null>(
          `/stat/${domain}/${itemId}/hormone`,
        ),
        apiClient.get<Array<{ category: string | null; attribute: string; avgRating: number }>>(
          `/stat/${domain}/${itemId}/preference`,
        ),
      ]);

      const mbti   = mbtiRes.data;
      const hormone = hormoneRes.data;
      const prefs  = prefRes.data ?? [];

      // hormone 값(TETO/EGEN) → 한글 표기
      const hormoneLabel =
        hormone?.hormone === 'TETO' ? '테토' :
        hormone?.hormone === 'EGEN' ? '에겐' :
        null;

      return {
        top_mbti_group: mbti
          ? { group: mbti.mbti, average_rating: mbti.avgRating }
          : null,
        top_style_group: (hormone && hormoneLabel)
          ? { group: hormoneLabel, average_rating: hormone.avgRating }
          : null,
        top_preference_attributes: prefs.map((p) => ({
          category: p.category ?? '',
          attribute: p.attribute,
          average_rating: p.avgRating,
        })),
      };
    } catch (err) {
      console.warn('[reviewService] getReviewAnalytics failed', err);
      return null;
    }
  },
};
