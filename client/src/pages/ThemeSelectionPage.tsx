import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, Check, Sparkles, AlertCircle, Minus, Plus, Loader2 } from 'lucide-react';
import { travelService, ThemeResponse } from '../services/travelService';
import { useAuth } from '../context/AuthContext';

// 테마 ID별 로컬 시각 메타데이터 (서버에 없는 UI 전용 데이터)
const THEME_VISUAL: Record<number, {
  emoji: string;
  badge?: string;
  color: string;
  borderColor: string;
  glowColor: string;
}> = {
  1:  { emoji: '🧗', badge: '인기',   color: 'from-orange-50 to-amber-50',    borderColor: 'border-orange-200',   glowColor: 'shadow-orange-500/10' },
  2:  { emoji: '📸', badge: '추천',   color: 'from-pink-50 to-rose-50',       borderColor: 'border-pink-200',     glowColor: 'shadow-pink-500/10' },
  3:  { emoji: '🍕', badge: '맛집',   color: 'from-red-50 to-orange-50',      borderColor: 'border-red-200',      glowColor: 'shadow-red-500/10' },
  4:  { emoji: '🌿', badge: '치유',   color: 'from-emerald-50 to-teal-50',    borderColor: 'border-emerald-200',  glowColor: 'shadow-emerald-500/10' },
  5:  { emoji: '🪙', badge: '가성비', color: 'from-neutral-100 to-stone-50',  borderColor: 'border-neutral-300',  glowColor: 'shadow-stone-500/10' },
  6:  { emoji: '👵', badge: '효도',   color: 'from-cyan-50 to-blue-50',       borderColor: 'border-cyan-200',     glowColor: 'shadow-cyan-500/10' },
  7:  { emoji: '💎', badge: 'FLEX',   color: 'from-purple-50 to-indigo-50',   borderColor: 'border-purple-200',   glowColor: 'shadow-purple-500/10' },
  8:  { emoji: '🧬', badge: '개인화', color: 'from-blue-50 to-indigo-50',     borderColor: 'border-blue-200',     glowColor: 'shadow-blue-500/10' },
  9:  { emoji: '🌸',                  color: 'from-pink-50 to-zinc-50',        borderColor: 'border-pink-200',     glowColor: 'shadow-pink-500/5' },
  10: { emoji: '🔥',                  color: 'from-orange-50 to-red-50',       borderColor: 'border-orange-200',   glowColor: 'shadow-orange-500/5' },
  11: { emoji: '👶', badge: '키즈',   color: 'from-yellow-50 to-amber-50',    borderColor: 'border-yellow-300',   glowColor: 'shadow-yellow-500/10' },
  12: { emoji: '🐶', badge: '댕댕이', color: 'from-amber-50 to-stone-50',     borderColor: 'border-amber-200',    glowColor: 'shadow-amber-500/10' },
  13: { emoji: '⚡', badge: 'HIP',    color: 'from-violet-50 to-purple-50',   borderColor: 'border-violet-200',   glowColor: 'shadow-violet-500/10' },
};

const DEFAULT_VISUAL = {
  emoji: '✨',
  badge: undefined as string | undefined,
  color: 'from-neutral-50 to-slate-50',
  borderColor: 'border-neutral-200',
  glowColor: 'shadow-neutral-500/10',
};

export default function ThemeSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('제주도');
  const [selectedDistrict, setSelectedDistrict] = useState('서귀포시');
  const [duration, setDuration] = useState<number>(1);

  const [themes, setThemes] = useState<ThemeResponse[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [themeError, setThemeError] = useState(false);

  // 실제 로그인 유저 MBTI (없으면 빈 문자열)
  const userMbti = (user?.mbti || '').toUpperCase();

  useEffect(() => {
    // localStorage에서 지역 정보 읽기
    setSelectedRegion(localStorage.getItem('selectedRegion') || '제주도');
    setSelectedDistrict(localStorage.getItem('selectedDistrict') || '서귀포시');

    // 테마 목록 API 호출
    travelService.getThemes()
      .then(setThemes)
      .catch(() => setThemeError(true))
      .finally(() => setLoadingThemes(false));
  }, []);

  const handleRecommendCourse = () => {
    if (selectedThemeId === null) return;
    const theme = themes.find(t => t.id === selectedThemeId);
    if (!theme) return;

    localStorage.setItem('selectedThemeId', String(theme.id));
    localStorage.setItem('selectedThemeName', theme.name);
    localStorage.setItem('selectedDuration', String(duration));
    localStorage.removeItem('viewingSavedCourseTitle');
    navigate('/course-recommendations');
  };

  return (
    <div className="bg-[#f8fbff] text-on-background min-h-screen relative antialiased">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-surface to-[#f8fbff]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm h-20">
        <div className="flex justify-between items-center px-8 h-full max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo"
              className="object-contain h-12 w-12"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-black tracking-tighter text-neutral-900 uppercase">떠먹트립</h1>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <Search className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
            <User
              className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-36">
        <div className="mb-8">
          <button
            onClick={() => navigate('/recommendation-style')}
            className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="border-b-2 border-transparent hover:border-black transition-all">추천 방법 변경하기</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-black/5 rounded-full text-xs font-black text-neutral-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>선택 지역: {selectedRegion} {selectedDistrict}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
            어떤 테마의 하루를 드려볼까요?
          </h2>
          <p className="text-neutral-500 font-medium text-sm md:text-base mt-2">
            지정하신 {selectedRegion} 최고의 핫스팟들을 모은 하루 통합 패키지를 한눈에 떠먹여 드릴게요.
          </p>
        </div>

        {/* 여행 기간 설정 */}
        <div className="mb-10 p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              📅 여행 기간 설정하기
            </h3>
            <p className="text-xs text-neutral-450 font-semibold mt-1">
              최소 1일에서 최대 3일까지 원하시는 일정을 편리하게 조절해 보세요.
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-6 bg-neutral-50 px-5 py-3 rounded-2xl border border-neutral-100 min-w-[200px]">
            <button
              type="button"
              onClick={() => setDuration(d => Math.max(1, d - 1))}
              disabled={duration <= 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                duration <= 1
                  ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 hover:bg-neutral-100 active:scale-90 cursor-pointer'
              }`}
            >
              <Minus className="w-4 h-4 stroke-[2.5px]" />
            </button>
            <div className="text-center min-w-[70px]">
              <span className="text-lg font-black text-neutral-900">{duration}일차 코스</span>
              <span className="text-[10px] font-black text-neutral-400 block -mt-1">
                {duration === 1 ? '당일치기' : duration === 2 ? '1박 2일' : '2박 3일'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDuration(d => Math.min(3, d + 1))}
              disabled={duration >= 3}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                duration >= 3
                  ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 hover:bg-neutral-100 active:scale-90 cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* 테마 그리드 */}
        {loadingThemes ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : themeError ? (
          <div className="text-center py-24 text-neutral-400 font-bold">
            테마 목록을 불러오지 못했습니다. 새로고침 해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {themes.map((theme) => {
              const visual = THEME_VISUAL[theme.id] ?? DEFAULT_VISUAL;
              const isSelected = selectedThemeId === theme.id;
              // MBTI 테마(id=8)는 실제 로그인 유저 MBTI를 이름에 반영
              const displayName = theme.id === 8
                ? userMbti
                  ? `${userMbti} 맞춤 여행`
                  : '내 MBTI 맞춤 여행'
                : theme.name;

              return (
                <motion.div
                  key={theme.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`group cursor-pointer p-5 md:p-6 rounded-2xl border transition-all duration-300 relative bg-white overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `border-black ring-1 ring-black shadow-md ${visual.glowColor}`
                      : `${visual.borderColor} border-neutral-100 hover:border-neutral-300 shadow-sm`
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-3xl filter drop-shadow-sm select-none group-hover:scale-110 transition-transform duration-300 block">
                        {visual.emoji}
                      </span>
                      {visual.badge && (
                        <span className="text-[9px] font-black px-2 py-0.5 bg-black/5 rounded-full text-neutral-500 uppercase tracking-wider">
                          {visual.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-neutral-900 tracking-tight leading-snug">
                      {displayName}
                    </h3>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-black text-white' : 'bg-neutral-50 group-hover:bg-neutral-100 text-neutral-300'
                    }`}>
                      <Check className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5px]' : ''}`} />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/80 backdrop-blur-lg border-t border-neutral-100 py-6 px-8 shadow-2xl">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-500">
              {selectedThemeId === null
                ? '원하는 테마 카드를 하나 선택해 주세요.'
                : '당신만을 위한 취향 맞춤 코스 생성이 준비되었습니다!'}
            </p>
          </div>
          <button
            onClick={handleRecommendCourse}
            disabled={selectedThemeId === null || loadingThemes}
            className={`w-full sm:w-auto px-10 py-5 rounded-full font-black tracking-tight text-lg transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
              selectedThemeId !== null && !loadingThemes
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>테마 맞춤 코스 매칭받기 ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}
