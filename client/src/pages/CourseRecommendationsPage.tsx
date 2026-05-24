import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Smile, User, Loader2, AlertCircle } from 'lucide-react';
import { travelService, mapItinerary } from '../services/travelService';

interface CourseSpot {
  itemId?: number;
  category: 'restaurant' | 'stay' | 'activity' | 'cafe';
  name: string;
  rating: number;
  image: string;
  desc: string;
  memo: string;
  cost?: string;
  day?: number;
}

export default function CourseRecommendationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isViewingSaved = !!(location.state as any)?.savedItinerary;
  const [selectedRegion, setSelectedRegion] = useState('제주도');
  const [selectedDistrict, setSelectedDistrict] = useState('서귀포시');
  const [themeName, setThemeName] = useState('스릴만점 액티비티 여행');
  const [themeId, setThemeId] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [itinerary, setItinerary] = useState<CourseSpot[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [customCourseName, setCustomCourseName] = useState('');
  const [savedCourseTitle, setSavedCourseTitle] = useState('');
  const [savedCourseId, setSavedCourseId] = useState<number | null>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(true);
  const [itineraryError, setItineraryError] = useState(false);

  useEffect(() => {
    // 저장된 코스 상세보기 모드
    const stateData = location.state as {
      savedItinerary?: CourseSpot[];
      savedCourseName?: string;
      savedCourseId?: number;
      savedDuration?: number;
    } | null;

    if (stateData?.savedItinerary) {
      setItinerary(stateData.savedItinerary);
      setSavedCourseId(stateData.savedCourseId ?? null);
      setSavedCourseTitle(stateData.savedCourseName ?? '');
      setCustomCourseName(stateData.savedCourseName ?? '');
      setSelectedDuration(stateData.savedDuration ?? 1);
      setActiveDay(1);
      setIsSaved(true);
      setLoadingItinerary(false);
      return;
    }

    // 일반 신규 추천 모드
    const region      = localStorage.getItem('selectedRegion')    || '제주도';
    const district    = localStorage.getItem('selectedDistrict')  || '서귀포시';
    const districtId  = Number(localStorage.getItem('selectedDistrictId') || '0');
    const savedThemeId   = Number(localStorage.getItem('selectedThemeId')   || '1');
    const savedThemeName = localStorage.getItem('selectedThemeName') || '스릴만점 액티비티 여행';
    const savedDuration  = Number(localStorage.getItem('selectedDuration')  || '1');

    setSelectedRegion(region);
    setSelectedDistrict(district);
    setThemeId(savedThemeId);
    setThemeName(savedThemeName);
    setSelectedDuration(savedDuration);
    setCustomCourseName(`${region} ${savedThemeName} 코스`);

    // 실제 추천 API 호출
    async function loadItinerary() {
      setLoadingItinerary(true);
      setItineraryError(false);
      try {
        const result = await travelService.getItinerary(savedThemeId, districtId, savedDuration);
        setItinerary(mapItinerary(result));
      } catch (err) {
        console.error('[CourseRecommendationsPage] 코스 추천 실패', err);
        setItineraryError(true);
      } finally {
        setLoadingItinerary(false);
      }
    }
    loadItinerary();

    // 저장된 코스 여부 확인
    async function checkSavedStatus() {
      try {
        const savedList = await travelService.getSavedCourses();
        const defaultName = `${region} ${savedThemeName} 코스`;
        const matched = savedList.find(c => c.title === defaultName);
        if (matched) {
          setIsSaved(true);
          setSavedCourseTitle(matched.title);
          setSavedCourseId(matched.id ?? null);
          setCustomCourseName(matched.title);
        }
      } catch {
        // 저장 상태 확인 실패 시 무시
      }
    }
    checkSavedStatus();
  }, []);

  const handleSaveCourse = async () => {
    const trimmedTitle = customCourseName.trim().slice(0, 30);
    if (!trimmedTitle) { alert('코스 이름을 입력해 주세요.'); return; }

    // 실제 DTO 빌드 — itinerary에 보존된 itemId 사용
    const staySpot = itinerary.find(s => s.category === 'stay');
    const schedule = Array.from({ length: selectedDuration }, (_, i) => i + 1).map((day) => {
      const daySpots = itinerary.filter(s => s.day === day);
      return {
        day,
        restaurants: daySpots
          .filter(s => s.category === 'restaurant' && s.itemId)
          .map(s => ({ id: s.itemId! })),
        activity: daySpots.find(s => s.category === 'activity' && s.itemId)
          ? { id: daySpots.find(s => s.category === 'activity')!.itemId! }
          : undefined,
      };
    });

    try {
      const { courseId } = await travelService.saveCourse({
        name: trimmedTitle,
        themeId,
        days: selectedDuration,
        stay: staySpot?.itemId ? { id: staySpot.itemId } : undefined,
        schedule,
      });
      setSavedCourseId(courseId);
      setSavedCourseTitle(trimmedTitle);
      setIsSaved(true);
      setShowSaveModal(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err) {
      console.error('[CourseRecommendationsPage] handleSaveCourse failed', err);
    }
  };

  const handleUnsaveCourse = async () => {
    if (!savedCourseId) return;
    try {
      await travelService.unsaveCourse(savedCourseId);
      setIsSaved(false);
      setSavedCourseTitle('');
      setSavedCourseId(null);
      alert('여행 코스 저장이 취소되었습니다.');
    } catch (err) {
      console.error('[CourseRecommendationsPage] handleUnsaveCourse failed', err);
    }
  };

  const getCategoryDetailsPath = (category: 'restaurant' | 'stay' | 'activity' | 'cafe') => {
    if (category === 'restaurant') return '/restaurant-detail';
    if (category === 'stay') return '/stay-detail';
    return '/activity-detail';
  };

  const navigateToDetail = (spot: CourseSpot) => {
    navigate(getCategoryDetailsPath(spot.category), {
      state: {
        itemId:   spot.itemId,
        name:     spot.name,
        image:    spot.image,
        rating:   spot.rating,
        domain:   spot.category === 'cafe' ? 'activity' : spot.category,
      },
    });
  };

  const categoryLabels = {
    restaurant: '식당',
    stay: '숙소',
    activity: '액티비티',
    cafe: '카페'
  };

  return (
    <div className="bg-[#f8fbff] text-on-background min-h-screen relative antialiased pb-24">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-[#f0f5ff]/30 to-[#f8fbff]"></div>
      </div>

      {/* Nav */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm h-16 md:h-16">
        <div className="flex justify-between items-center px-8 h-full max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo" 
              className="object-contain h-10 w-10 md:h-10 md:w-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-neutral-900 uppercase">떠먹트립</h1>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <User 
              className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[650px] mx-auto px-6 pt-24 md:pt-20">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between mb-6 md:mb-4">
          <button
            onClick={() => isViewingSaved ? navigate('/saved-courses') : navigate('/theme-selection')}
            className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold text-xs md:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isViewingSaved ? '저장된 코스로 돌아가기' : '테마 선택으로 가기'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (isSaved) {
                  handleUnsaveCourse();
                } else {
                  setCustomCourseName(`${selectedRegion} ${themeName} 코스`);
                  setShowSaveModal(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
              <span>{isSaved ? '여행 코스 저장됨' : '이 코스 저장하기'}</span>
            </button>
          </div>
        </div>

        {/* Day Select Tabs Bar */}
        {selectedDuration >= 1 && (
          <div className="flex items-center justify-center gap-1.5 mb-8 md:mb-6 bg-white border border-neutral-100 p-1 rounded-xl w-fit mx-auto shadow-sm">
            {Array.from({ length: selectedDuration }, (_, idx) => idx + 1).map((dayNum) => (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className={`px-4 py-2 rounded-lg font-black text-xs md:text-xs tracking-tight transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  activeDay === dayNum
                    ? 'bg-black text-white shadow-md'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                }`}
              >
                <span>{dayNum}일차 코스</span>
                {activeDay === dayNum && (
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Itinerary Timeline */}
        {loadingItinerary ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
            <p className="text-sm font-bold text-neutral-400">맞춤 코스를 생성하고 있어요...</p>
          </div>
        ) : itineraryError ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm font-bold text-neutral-500">코스를 불러오지 못했습니다.</p>
            <p className="text-xs text-neutral-400">지역과 테마를 다시 선택해 주세요.</p>
            <button
              onClick={() => navigate('/theme-selection')}
              className="mt-2 px-6 py-2 bg-black text-white rounded-full text-xs font-bold"
            >
              테마 다시 선택
            </button>
          </div>
        ) : (
        <div className="space-y-8 md:space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-neutral-200 before:via-neutral-300 before:to-neutral-100">
          {itinerary
            .filter((spot) => spot.day === activeDay)
            .map((spot, i) => (
              <motion.div 
                key={`${spot.itemId ?? spot.name}-${spot.day}-${spot.category}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative pl-12 group"
              >
              {/* Timeline Pin Indicator */}
              <div className="absolute left-2.5 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white bg-black transition-all group-hover:scale-110 group-hover:bg-primary shadow-lg flex items-center justify-center">
                <span className="text-[8px] font-black text-white">{i + 1}</span>
              </div>

              {/* Spot Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-soft-brutal hover:translate-y-[-2px] transition-all duration-300">
                <div className="h-32 md:h-32 overflow-hidden relative">
                  <img 
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={spot.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
                      {categoryLabels[spot.category]}
                    </span>
                  </div>
                </div>

                <div className="p-4 text-left">
                  <h3 className="text-base md:text-md font-black text-neutral-900 tracking-tight leading-snug mb-1 flex items-center justify-between">
                    <span>{spot.name}</span>
                    <span className="text-xs font-black text-amber-500">⭐️ {spot.rating}</span>
                  </h3>

                  <p className="text-[11px] md:text-xs text-neutral-550 leading-relaxed font-semibold mb-2">
                    {spot.desc}
                  </p>

                  {/* Buttons */}
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex gap-2">
                    <button
                      onClick={() => navigateToDetail(spot)}
                      className="flex-1 py-2 px-3 bg-black text-white rounded-full font-bold text-[11px] hover:bg-neutral-800 transition-colors active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Smile className="w-3 h-3" />
                      <span>상세 정보</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Back and Confirm Button Box */}
        <div className="mt-12 text-center space-y-3">
          <button
            onClick={() => navigate(isViewingSaved ? '/saved-courses' : '/main')}
            className="w-full bg-black text-white py-4 rounded-full font-black tracking-tight text-base shadow-lg shadow-black/10 hover:bg-neutral-800 active:scale-95 transition-all text-center select-none cursor-pointer"
          >
            {isViewingSaved ? '코스 목록으로 돌아가기 ✨' : '확인 및 홈으로 이동 ✨'}
          </button>
          {!isViewingSaved && (
            <button
              onClick={() => navigate('/theme-selection')}
              className="text-xs font-bold text-neutral-500 hover:text-black transition-colors underline decoration-2 cursor-pointer"
            >
              다른 테마 코스 찾아보기
            </button>
          )}
        </div>
      </main>

      {/* Naming Modal Dialog */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              id="modal-backdrop"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-neutral-150 text-left z-10 overflow-hidden"
              id="save-modal-box"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">💾 코스 저장하기</h3>
              </div>

              {/* Body */}
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="course-name-input" className="block text-xs font-black text-neutral-600 mb-2 uppercase tracking-wide">
                    코스 이름
                  </label>
                  <input
                    type="text"
                    id="course-name-input"
                    value={customCourseName}
                    onChange={(e) => {
                      if (e.target.value.length <= 30) {
                        setCustomCourseName(e.target.value);
                      }
                    }}
                    placeholder="예: 제주 3일 액티비티 가족여행"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm font-bold text-neutral-800 placeholder-neutral-350 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    maxLength={30}
                    autoFocus
                  />
                  <div className="text-right mt-1.5">
                    <span className="text-[10px] font-black text-neutral-400">
                      {customCourseName.length}/30자
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2.5 font-bold">
                <button
                  type="button"
                  id="cancel-save-button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full font-black text-xs transition-colors active:scale-95 text-center cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  id="confirm-save-button"
                  onClick={handleSaveCourse}
                  className="flex-1 py-3 px-4 bg-black hover:bg-neutral-800 text-white rounded-full font-black text-xs transition-colors active:scale-95 text-center cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Saved Toast Indicator */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-800 text-white rounded-2xl py-4 px-6 shadow-2xl flex items-center gap-3 max-w-sm w-full mx-4"
          >
            <div className="bg-red-500 rounded-full p-2 text-white">
              <Heart className="w-4 h-4 fill-current text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-neutral-400">마이페이지 보관함 저장 완료!</p>
              <p className="text-sm font-bold mt-0.5">이코스가 보관함에 안전하게 담겼습니다. 💖</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
