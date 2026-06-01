import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User as UserIcon,
  ArrowLeft,
  Star,
  MessageSquare,
  Loader2,
  CheckCircle,
  Heart,
  Bookmark
} from 'lucide-react';
import { reviewService } from '../services/reviewService';

interface LocationState {
  type?: 'restaurant' | 'stay' | 'activity';
  itemId?: number;   // 상세 페이지에서 전달
  name?: string;
  category?: string;
  image?: string;
}

const ratingTexts = {
  overall: {
    1: '많이 아쉬웠어요 😢',
    2: '조금 아쉬웠어요 😕',
    3: '무난했어요 🙂',
    4: '만족스러웠어요 😊',
    5: '정말 만족했어요 😍'
  },
  restaurant: {
    food: {
      1: '취향과 많이 달랐어요 😢',
      2: '조금 아쉬웠어요 😕',
      3: '무난했어요 🙂',
      4: '꽤 만족스러웠어요 😊',
      5: '정말 취향저격이었어요 🔥'
    },
    service: {
      1: '아쉬운 부분이 있었어요 😢',
      2: '조금 불편했어요 😕',
      3: '무난했어요 🙂',
      4: '분위기가 좋았어요 😊',
      5: '분위기와 서비스 모두 만족스러웠어요 ✨'
    }
  },
  stay: {
    atmosphere: {
      1: '취향과 많이 달랐어요 😢',
      2: '조금 아쉬웠어요 😕',
      3: '무난했어요 🙂',
      4: '꽤 만족스러웠어요 😊',
      5: '정말 취향저격이었어요 🔥'
    },
    service: {
      1: '불만족스러웠어요 😢',
      2: '조금 아쉬웠어요 😕',
      3: '무난했어요 🙂',
      4: '만족스러웠어요 😊',
      5: '이용 환경과 서비스가 정말 만족스러웠어요 ✨'
    }
  },
  activity: {
    food: {
      1: '취향과 많이 달랐어요 😢',
      2: '조금 아쉬웠어요 😕',
      3: '무난했어요 🙂',
      4: '꽤 만족스러웠어요 😊',
      5: '정말 취향저격이었어요 🔥'
    },
    service: {
      1: '아쉬운 부분이 있었어요 😢',
      2: '조금 불편했어요 😕',
      3: '무난했어요 🙂',
      4: '분위기가 좋았어요 😊',
      5: '분위기와 서비스 모두 만족스러웠어요 ✨'
    }
  }
};

const getRatingText = (type: string, category: 'overall' | 'food' | 'service', val: number) => {
  if (val === 0) return '';
  const rounded = Math.round(val);
  const key = Math.max(1, Math.min(5, rounded)) as 1 | 2 | 3 | 4 | 5;

  if (category === 'overall') {
    return ratingTexts.overall[key];
  }

  if (type === 'stay') {
    if (category === 'food') {
      return ratingTexts.stay.atmosphere[key];
    } else {
      return ratingTexts.stay.service[key];
    }
  }

  if (type === 'activity') {
    if (category === 'food') {
      return ratingTexts.activity.food[key];
    } else {
      return ratingTexts.activity.service[key];
    }
  }

  // Default to restaurant
  if (category === 'food') {
    return ratingTexts.restaurant.food[key];
  } else {
    return ratingTexts.restaurant.service[key];
  }
};

interface HalfStarRatingProps {
  rating: number;
  hoverRating: number | null;
  setRating: (rating: number) => void;
  setHoverRating: (rating: number | null) => void;
}

function HalfStarRating({ rating, hoverRating, setRating, setHoverRating }: HalfStarRatingProps) {
  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFull = currentRating >= starIndex;
        const isHalf = !isFull && currentRating >= starIndex - 0.5;

        return (
          <div 
            key={starIndex} 
            className="relative w-9 h-9 select-none"
          >
            {/* Base Empty Star */}
            <Star className="w-9 h-9 text-neutral-200 transition-colors" />

            {/* Overlaid Full Star */}
            {isFull && (
              <div className="absolute inset-0 pointer-events-none">
                <Star className="w-9 h-9 text-amber-400 fill-amber-400" />
              </div>
            )}
            
            {/* Overlaid Half Star */}
            {isHalf && (
              <div className="absolute inset-0 w-[50%] overflow-hidden pointer-events-none">
                <Star className="w-9 h-9 text-amber-400 fill-amber-400 max-w-none" />
              </div>
            )}

            {/* Interactive Areas */}
            <div 
              className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10"
              onMouseEnter={() => setHoverRating(starIndex - 0.5)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(starIndex - 0.5)}
            />
            <div 
              className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10"
              onMouseEnter={() => setHoverRating(starIndex)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(starIndex)}
            />
          </div>
        );
      })}
      {currentRating > 0 && (
        <span className="text-sm font-black text-amber-500 ml-2 rounded-full bg-amber-50 px-2 py-0.5 border border-amber-100">
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  // Default to restaurant (우동신) if no state passed
  const type = state.type || 'restaurant';
  const name = state.name || (type === 'restaurant' ? '우동신 (서울점)' : type === 'stay' ? '신라호텔 서울' : '한강 카약 체험');
  const category = state.category || (type === 'restaurant' ? '한식' : type === 'stay' ? '호텔' : '수상 레저');
  const image = state.image || (
    type === 'restaurant' 
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ZSMkXSQ-A0r-jRcHBHDAQxg4Zjz0BnlAZuNIyWbJJ8H1VbL3L7RQDUF_VunQIR-Vv1PStNz1sPnk-TXtf3LBbxSCrF_Nz1IZ2GAun9W1ZZD-ZUNh2HsvUrDR8RCMydkDmFNoMPXwG98IN1LRFtgA38QMJLC0yYlYWLHACaK-fozt5TqxAWE0hBmayll8994QTN8OKnD2RU-qTrHkUHDYY_kH7TCR0JOyqu-us9JgVBgL0klxE9IjGciJdQp36CxRSwQGDMqI7fMA'
      : type === 'stay' 
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS02alZ-D_bBOrHb1a8bvEDMsLVQZSpSN2lEGXsG3rHrFsDwS3H94JbNy46B4hW37_LjoBqfEW2fFkjgx6XlwCrKW4OqHn_C-kgsvu6AK0hwrRORRDKTisCP2wrM6Nf_cwTgY2WmPhT8K0DVSlANcm9QHBrT3RED64RTSvDP6AzE8MBD4Jmq36Dec4WPKpuz9BHAQYOGTI0qbbrBzw04u528i5V8dTu6SNghN54v7pvqdwmdh2s88LkoIhPXX-UZ9MYkSjipobQRHT'
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSfWcYaHPi-pWJTnRAYai5_LQLg3T5vn_YZqHBmytCNOoUHvamDiA47O-oZ4ZQ8OI15DS9CHPUhjNyyjR9YjEiFtXVfBS8JNU3n9fHXFc__7_aEme5vHPkyVM8Lx1VCL9odCdzNt_lnVdiWg3Ds3jEK6ceCW1gjbh8sKZYe4WbsvgzNXf-eNGiUgBJ_Xbc0eXQKb2P7CtbDUXeCpe6KXzVEnQyyDyPaUeUT9_n3Y5kjQ9Gm6qTzSNHQPJtyXBozJRaoJo082HDFmpH'
  );

  // States for ratings
  const [overallRating, setOverallRating] = useState<number>(5);
  const [overallHover, setOverallHover] = useState<number | null>(null);

  const [foodRating, setFoodRating] = useState<number>(5);
  const [foodHover, setFoodHover] = useState<number | null>(null);

  const [serviceRating, setServiceRating] = useState<number>(5);
  const [serviceHover, setServiceHover] = useState<number | null>(null);

  // Restaurant-specific states
  const [totalSpent, setTotalSpent] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<string>('');

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleTotalSpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setTotalSpent('');
    } else {
      const formatted = Number(value).toLocaleString();
      setTotalSpent(formatted);
    }
  };

  const handleVisitorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setVisitorCount(value);
  };

  // Dynamic titles based on the category type
  const getQuestionTwoTitle = () => {
    if (type === 'stay') {
      return '🛏️ 숙소의 분위기와 공간은 취향에 잘 맞았나요?';
    } else if (type === 'activity') {
      return '🛶 액티비티의 체험 및 프로그램 설계는 마음에 드셨나요?';
    }
    return '🍕 식당의 분위기와 음식은 입맛에 잘 맞았나요?';
  };

  const getQuestionThreeTitle = () => {
    if (type === 'stay') {
      return '🧼 이용 환경과 서비스는 만족스러웠나요?';
    } else if (type === 'activity') {
      return '🛡️ 진행 장소의 청결환경과 강사님(안전 요원) 서비스에 만족하셨나요?';
    }
    return '🧼 위생 상태와 점원 서비스는 만족스러웠나요?';
  };

  const itemId = state.itemId ?? null;

  const handleSubmit = async () => {
    if (type !== 'activity' && (foodRating === 0 || serviceRating === 0)) {
      alert('모든 별점 항목을 평가해 주세요!');
      return;
    }
    if (!itemId) {
      alert('리뷰를 등록할 장소 정보가 없습니다.\n코스 추천 페이지에서 상세 페이지로 이동한 후 리뷰를 작성해 주세요.');
      return;
    }

    setSubmitStatus('loading');
    try {
      if (type === 'restaurant') {
        await reviewService.submitRating('restaurant', {
          restaurantId:     itemId,
          overallRating,
          tasteRating:      foodRating,
          spaceRating:      serviceRating,
          visitPartySize:   Number(visitorCount) || 1,
          totalSpentAmount: Number(totalSpent.replace(/,/g, '')) || 0,
        });
      } else if (type === 'stay') {
        await reviewService.submitRating('stay', {
          stayId:           itemId,
          overallRating,
          interiorRating:   foodRating,
          cleanRating:      serviceRating,
          visitPartySize:   Number(visitorCount) || 1,
          totalSpentAmount: Number(totalSpent.replace(/,/g, '')) || 0,
        });
      } else {
        await reviewService.submitRating('activity', {
          activityId: itemId,
          overallRating,
        });
      }
      setSubmitStatus('success');
      setTimeout(() => {
        alert('리뷰가 성공적으로 등록되었습니다!');
        navigate(-1);
      }, 1000);
    } catch (err: any) {
      setSubmitStatus('idle');
      alert(err?.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] font-sans min-h-screen antialiased pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-neutral-100 flex justify-center items-center h-20">
        <div className="w-full max-w-[1100px] px-8 flex justify-between items-center h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/main')}>
            <img 
              alt="떠먹트립 로고" 
              className="h-10 w-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" 
              referrerPolicy="no-referrer"
            />
            <span className="text-2xl font-black tracking-tighter text-neutral-900">&nbsp;떠먹트립</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Search className="w-6 h-6 text-neutral-900" />
            </button>
            <button 
              onClick={() => navigate('/mypage')}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <UserIcon className="w-6 h-6 fill-current text-neutral-900" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 max-w-[1100px] mx-auto px-8">
        <div className="space-y-6">
          {/* Hero Section */}
          <section className="relative rounded-[32px] overflow-hidden group shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] h-[450px] border border-neutral-200">
            <button 
              className="absolute top-6 left-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <img 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={image} 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white font-bold text-xs mb-2 rounded-lg uppercase tracking-wider">
                  {category}
                </span>
                <h1 className="text-white font-black text-4xl md:text-5xl">{name}</h1>
              </div>
            </div>
            {/* Removed heart and bookmark indicators as requested */}
          </section>

          {/* Review Card */}
          <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] border border-neutral-100">
            <div className="separate-flow space-y-12">
              
              {/* Question 1: Overall */}
              <div className="review-question">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h3 className="text-xl md:text-2xl font-black text-black">⭐ 전체적으로 만족스러우셨나요?</h3>
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <HalfStarRating 
                      rating={overallRating}
                      hoverRating={overallHover}
                      setRating={setOverallRating}
                      setHoverRating={setOverallHover}
                    />
                    <p className="font-bold text-sm text-neutral-600 h-6 transition-all duration-300">
                      {getRatingText(type, 'overall', overallRating)}
                    </p>
                  </div>
                </div>
              </div>

              {type !== 'activity' && (
                <>
                  <div className="h-px bg-neutral-100"></div>

                  {/* Question 2: Specific category taste/space */}
                  <div className="review-question">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <h3 className="text-xl md:text-2xl font-black text-black">{getQuestionTwoTitle()}</h3>
                      <div className="flex flex-col items-center md:items-end gap-2">
                        <HalfStarRating 
                          rating={foodRating}
                          hoverRating={foodHover}
                          setRating={setFoodRating}
                          setHoverRating={setFoodHover}
                        />
                        <p className={`font-bold text-sm text-neutral-600 h-6 transition-all duration-300 ${foodRating === 0 ? 'opacity-0' : 'opacity-100'}`}>
                          {getRatingText(type, 'food', foodRating)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-neutral-100"></div>

                  {/* Question 3: Service */}
                  <div className="review-question">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <h3 className="text-xl md:text-2xl font-black text-black">{getQuestionThreeTitle()}</h3>
                      <div className="flex flex-col items-center md:items-end gap-2">
                        <HalfStarRating 
                          rating={serviceRating}
                          hoverRating={serviceHover}
                          setRating={setServiceRating}
                          setHoverRating={setServiceHover}
                        />
                        <p className={`font-bold text-sm text-neutral-600 h-6 transition-all duration-300 ${serviceRating === 0 ? 'opacity-0' : 'opacity-100'}`}>
                          {getRatingText(type, 'service', serviceRating)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(type === 'restaurant' || type === 'stay') && (
                <>
                  <div className="h-px bg-neutral-100"></div>

                  {/* Restaurant & Stay Specific Fields */}
                  <div className="review-question space-y-6">
                    <h3 className="text-xl md:text-2xl font-black text-black">
                      {type === 'restaurant' ? '💬 방문 상세 정보 입력' : '💬 이용 상세 정보 입력'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Total Spent */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                          {type === 'restaurant' ? '총 지출 금액 (총 얼마를 사용하셨나요?)' : '총 이용 금액 (총 얼마를 사용하셨나요?)'}
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={totalSpent}
                            onChange={handleTotalSpentChange}
                            placeholder="예: 45,000"
                            className="w-full px-6 py-4 bg-neutral-50 border border-transparent focus:border-black focus:ring-0 rounded-full font-bold text-lg transition-all pr-12"
                          />
                          <span className="absolute right-6 text-neutral-400 font-bold">원</span>
                        </div>
                      </div>

                      {/* Visitor Count */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                          {type === 'restaurant' ? '방문 인원수 (몇 명이서 방문하셨나요?)' : '투숙 인원수 (몇 명이서 이용하셨나요?)'}
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={visitorCount}
                            onChange={handleVisitorCountChange}
                            placeholder="예: 2"
                            className="w-full px-6 py-4 bg-neutral-50 border border-transparent focus:border-black focus:ring-0 rounded-full font-bold text-lg transition-all pr-12"
                          />
                          <span className="absolute right-6 text-neutral-400 font-bold">명</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-8">
                <button 
                  onClick={handleSubmit}
                  disabled={submitStatus !== 'idle'}
                  className={`w-full py-5 text-white font-bold text-lg rounded-full active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                    submitStatus === 'loading'
                      ? 'bg-neutral-800 cursor-not-allowed'
                      : submitStatus === 'success'
                      ? 'bg-green-600'
                      : 'bg-black hover:bg-neutral-800'
                  }`}
                >
                  {submitStatus === 'loading' && (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>처리 중...</span>
                    </>
                  )}
                  {submitStatus === 'success' && (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>등록 완료!</span>
                    </>
                  )}
                  {submitStatus === 'idle' && (
                    <>
                      <span>리뷰 등록하기</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
