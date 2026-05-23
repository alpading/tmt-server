import React from 'react';
import { Star, Award, Compass, Smile, Sparkles, MessageSquare } from 'lucide-react';
import { ReviewAnalytics } from '../types';

interface ReviewAnalyticsSectionProps {
  analytics?: ReviewAnalytics | null;
}

export default function ReviewAnalyticsSection({ analytics }: ReviewAnalyticsSectionProps) {
  // analytics 자체가 null → 로딩/에러 상태
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
        <Sparkles className="w-8 h-8 text-neutral-300 mb-2 animate-pulse" />
        <p className="text-sm font-medium text-neutral-400">분석 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { top_mbti_group, top_style_group, top_preference_attributes } = analytics;
  const hasMbti   = top_mbti_group !== null;
  const hasStyle  = top_style_group !== null;
  const hasPrefs  = top_preference_attributes.length > 0;
  const hasAnyData = hasMbti || hasStyle || hasPrefs;

  // 세 항목 모두 데이터 없음 → 리뷰 없음 상태
  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 gap-3">
        <MessageSquare className="w-8 h-8 text-neutral-300" />
        <p className="text-sm font-bold text-neutral-400">아직 리뷰가 없습니다</p>
        <p className="text-xs text-neutral-300 text-center">첫 번째 리뷰를 남겨서 다음 여행자에게 도움을 주세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MBTI & Travel Style Cards Grid */}
      {(hasMbti || hasStyle) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top MBTI Group Card */}
          {hasMbti && (
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)] hover:border-black/10 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded">
                    Top MBTI Group
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Smile className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-extrabold text-neutral-900 text-lg mb-1">
                  <span className="text-indigo-600 font-black">{top_mbti_group!.group}</span> 집단
                </h4>
                <p className="text-sm text-neutral-500 font-medium">
                  {top_mbti_group!.group} 유형이 가장 좋아했어요!
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-neutral-800 bg-neutral-50 p-2.5 rounded-xl self-start">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="font-black text-sm">{top_mbti_group!.average_rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Top Travel Style (Hormone) Card */}
          {hasStyle && (
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)] hover:border-black/10 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded">
                    Travel Style Group
                  </span>
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-extrabold text-neutral-900 text-lg mb-1">
                  <span className="text-teal-600 font-black">{top_style_group!.group}</span> 집단
                </h4>
                <p className="text-sm text-neutral-500 font-medium">
                  {top_style_group!.group} 집단이 가장 좋아했어요!
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-neutral-800 bg-neutral-50 p-2.5 rounded-xl self-start">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="font-black text-sm">{top_style_group!.average_rating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Preference Attributes */}
      {hasPrefs && (
        <div className="bg-neutral-50/50 rounded-2xl p-5 border border-neutral-100/85">
          <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-4">
            핵심 선호 집단
          </h4>
          <div className="space-y-3">
            {top_preference_attributes.map((pref, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-neutral-100/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 sm:mt-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {pref.category && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full self-start">
                        {pref.category}
                      </span>
                    )}
                    <span className="text-sm md:text-base font-extrabold text-neutral-800">
                      <span className="text-amber-600">{pref.attribute}</span> 선호 집단이 가장 좋아했어요!
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100/40 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="font-bold text-xs text-neutral-700">{pref.average_rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
