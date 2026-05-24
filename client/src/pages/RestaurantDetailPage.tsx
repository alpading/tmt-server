import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User, 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Star, 
  MessageSquare,
  Flame,
  User as UserIcon,
  Accessibility,
  Armchair,
  XCircle,
  ParkingCircle,
  Dog,
  Users,
  DoorOpen,
  Monitor,
  Loader2
} from 'lucide-react';
import { travelService } from '../services/travelService';
import { reviewService } from '../services/reviewService';
import { apiClient } from '../services/apiClient';
import { ReviewAnalytics } from '../types';
import MapSection from '../components/MapSection';
import AttributeSection from '../components/AttributeSection';
import ReviewAnalyticsSection from '../components/ReviewAnalyticsSection';

interface RestaurantData {
  id: number; name: string; imageUrl: string; categoryName: string | null;
  hasParking: boolean; allowsPets: boolean; hasSpicyFood: boolean;
  hasSingleSeating: boolean; hasTableSeating: boolean;
  hasGroupSeating: boolean; hasPrivateRoom: boolean; hasBarTable: boolean; hasBabyChair: boolean;
  latitude: string; longitude: string; naverPlaceId: string | null;
}

export default function RestaurantDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state || {}) as { itemId?: number; name?: string; image?: string; domain?: string };

  const ITEM_ID    = navState.itemId ?? null;
  const PLACE_NAME = navState.name   || '식당';
  const IMAGE      = navState.image  || '';

  // State
  const [isSavedInCourse, setIsSavedInCourse] = React.useState(false);
  const [isBookmarked, setIsBookmarked]         = React.useState(false);
  const [reviewAnalytics, setReviewAnalytics]   = React.useState<ReviewAnalytics | null>(null);
  const [loading, setLoading]                   = React.useState(true);
  const [placeCoords, setPlaceCoords]           = React.useState<{ lat: number; lng: number; naverPlaceId: string | null } | null>(null);
  const [placeData, setPlaceData]               = React.useState<RestaurantData | null>(null);
  const [avgRating, setAvgRating]               = React.useState<number | null>(null);

  React.useEffect(() => {
    async function loadDetailData() {
      try {
        setLoading(true);
        const promises: Promise<any>[] = [
          travelService.getSavedCourses(),
          travelService.getSavedPlaces(),
          reviewService.getReviewAnalytics(ITEM_ID, 'restaurant'),
        ];
        if (ITEM_ID) {
          promises.push(apiClient.get<RestaurantData>(`/restaurants/${ITEM_ID}`));
          promises.push(apiClient.get<{ avgRating: number | null; count: number }>(`/stat/restaurant/${ITEM_ID}/overall`));
        }
        const [courses, savedPlaces, analytics, placeRes, statRes] = await Promise.all(promises);
        setIsSavedInCourse(courses.length > 0);
        setIsBookmarked(
          ITEM_ID
            ? savedPlaces.some(p => p.domain === 'restaurant' && p.itemId === ITEM_ID)
            : savedPlaces.some(p => p.name === PLACE_NAME),
        );
        setReviewAnalytics(analytics);
        if (placeRes?.data) {
          setPlaceData(placeRes.data);
          setPlaceCoords({
            lat: parseFloat(placeRes.data.latitude),
            lng: parseFloat(placeRes.data.longitude),
            naverPlaceId: placeRes.data.naverPlaceId ?? null,
          });
        }
        if (statRes?.data?.avgRating != null) setAvgRating(statRes.data.avgRating);
      } catch (err) {
        console.error('[RestaurantDetailPage] failed to pre-fetch details', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetailData();
  }, []);

  // DB 데이터로 어트리뷰트 동적 생성 (true인 항목만)
  const restaurantAttributes = placeData ? ([
    placeData.hasSpicyFood     && { key: 'spicy_food',   label: '매운 음식',      value: '취급' },
    placeData.hasSingleSeating && { key: 'single_seat',  label: '혼밥 전용 공간', value: '있음' },
    placeData.hasTableSeating  && { key: 'table_seat',   label: '입식',           value: '가능' },
    placeData.hasBarTable      && { key: 'bar_table',    label: '바테이블',        value: '있음' },
    placeData.hasBabyChair     && { key: 'baby_chair',   label: '유아용 의자',     value: '있음' },
    placeData.hasParking       && { key: 'parking',      label: '주차',           value: '가능' },
    placeData.allowsPets       && { key: 'pets',         label: '반려동물 동반',   value: '가능' },
    placeData.hasGroupSeating  && { key: 'group_seat',   label: '단체석',         value: '가능' },
    placeData.hasPrivateRoom   && { key: 'private_room', label: '룸',             value: '있음' },
  ].filter(Boolean) as import('../types').PlaceAttribute[]) : [];

  const toggleBookmark = async () => {
    if (!ITEM_ID) return; // itemId 없으면 북마크 불가
    try {
      if (isBookmarked) {
        await travelService.unsavePlace('restaurant', ITEM_ID);
        setIsBookmarked(false);
      } else {
        await travelService.savePlace('restaurant', ITEM_ID);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('[RestaurantDetailPage] toggle bookmark error', err);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] font-sans min-h-screen antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex justify-center items-center h-16">
        <div className="w-full max-w-[1024px] px-8 flex justify-between items-center h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="떠먹트립 로고" 
              className="h-8 w-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="text-xl font-black tracking-tighter text-neutral-900">&nbsp;떠먹트립</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors">
              <Search className="w-5 h-5 text-neutral-900" />
            </button>
            <button 
              onClick={() => navigate('/mypage')}
              className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <User className="w-5 h-5 fill-current text-neutral-900" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 max-w-[1024px] mx-auto px-8">
        {/* Hero Section */}
        <section className="relative h-[340px] w-full rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] border border-neutral-200 mb-6">
          <div className="absolute top-3 left-3 z-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-neutral-200 font-bold text-xs shadow-sm active:scale-95 transition-all text-black cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>뒤로 가기</span>
            </button>
          </div>
          <img className="w-full h-full object-cover"
            alt={PLACE_NAME}
            src={placeData?.imageUrl || IMAGE} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white bg-transparent">
            {placeData?.categoryName && (
              <span className="inline-block px-3 py-0.5 rounded-full bg-white text-black text-[10px] font-bold mb-2 uppercase tracking-wider">{placeData.categoryName}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-black bg-transparent">{PLACE_NAME}</h1>
          </div>
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            {/* Heart is just indicator (non-button div, styled look) */}
            <div 
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-neutral-200 shadow-sm transition-all"
              title={isSavedInCourse ? "내가 저장한 코스에 포함된 장소입니다 ❤️" : "코스에 저장되지 않은 장소입니다"}
            >
              <Heart className={`w-5 h-5 transition-transform ${isSavedInCourse ? 'fill-red-500 text-red-500 scale-105' : 'text-neutral-300'}`} />
            </div>
            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              disabled={!ITEM_ID}
              className={`w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-black border border-neutral-200 shadow-sm transition-all active:scale-95 group ${ITEM_ID ? 'hover:bg-neutral-50 cursor-pointer' : 'opacity-40 cursor-default'}`}
              title={!ITEM_ID ? '코스 추천에서 이동 시 저장 가능합니다' : isBookmarked ? '장소 저장 해제하기' : '장소 저장하기'}
            >
              <Bookmark className={`w-5 h-5 transition-all ${isBookmarked ? 'fill-amber-500 text-amber-500 scale-105' : 'text-neutral-700 group-hover:scale-110'}`} />
            </button>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Basic Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-black text-black">{placeData?.name || PLACE_NAME}</h2>
                <div className="bg-black text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0 text-sm">
                  <Star className="text-yellow-400 w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{avgRating != null ? avgRating.toFixed(1) : '-'}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/write-review', { state: { type: 'restaurant', itemId: ITEM_ID, name: placeData?.name || PLACE_NAME, category: '식당', image: placeData?.imageUrl || IMAGE } })}
                className="w-full bg-black text-white py-2.5 px-4 rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 text-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                리뷰 남기기
              </button>
            </div>

            {/* Map Section Integration */}
            <MapSection
              placeName={PLACE_NAME}
              latitude={placeCoords?.lat}
              longitude={placeCoords?.lng}
              naverPlaceId={placeCoords?.naverPlaceId}
            />
          </div>

          {/* Right Column: Detailed Attributes */}
          <div className="lg:col-span-7">
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
              <h3 className="text-xl font-black mb-4 text-black">상세 정보</h3>
              <AttributeSection attributes={restaurantAttributes} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] mt-12">
          <h3 className="text-2xl font-black mb-8 text-black">다른 사람들의 리뷰</h3>
          {loading ? (
            <div className="flex justify-center items-center py-10 w-full">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            </div>
          ) : (
            <ReviewAnalyticsSection analytics={reviewAnalytics} />
          )}
        </div>
      </main>
    </div>
  );
}
