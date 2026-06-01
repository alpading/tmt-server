import { apiClient } from './apiClient';
import { ReviewAnalytics } from '../types';

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
