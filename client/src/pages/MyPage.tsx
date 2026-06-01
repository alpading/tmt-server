import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Heart, Star, Home, Compass, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { travelService, mapSavedCourse } from '../services/travelService';
import { SavedCourse, SavedPlace } from '../types';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const [activePlaceCategory, setActivePlaceCategory] = useState('전체');

  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingCourseId, setViewingCourseId] = useState<number | null>(null);

  // Fetch saved courses and saved places on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // GET '/api/saved-courses' and '/api/saved-places' under real connections
        const courses = await travelService.getSavedCourses();
        const places = await travelService.getSavedPlaces();
        setSavedCourses(courses);
        setSavedPlaces(places);
      } catch (err) {
        console.error('[MyPage] Failed to fetch saved history data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleViewCourse = async (courseId: number | undefined, courseTitle: string) => {
    if (!courseId) { alert('코스 정보를 불러올 수 없습니다.'); return; }
    setViewingCourseId(courseId);
    try {
      const detail = await travelService.getSavedCourseDetail(courseId);
      const spots = mapSavedCourse(detail);
      const course = savedCourses.find(c => c.id === courseId);
      navigate('/course-recommendations', {
        state: {
          savedItinerary: spots,
          savedCourseName: courseTitle,
          savedCourseId: courseId,
          savedDuration: detail.duration,
          savedThemeName: detail.themeName || course?.themeName || '',
          from: '/mypage',
        },
      });
    } catch (err) {
      console.error('[MyPage] 코스 상세보기 실패', err);
      alert('코스 정보를 불러오지 못했습니다.');
    } finally {
      setViewingCourseId(null);
    }
  };

  const filteredPlaces = activePlaceCategory === '전체'
    ? savedPlaces
    : savedPlaces.filter(place => place.category === activePlaceCategory);

  return (
    <div className="bg-background font-sans text-on-background min-h-screen relative antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img alt="Background decor" 
          className="w-full h-full object-cover opacity-10 blur-xl scale-110" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwmhg7i_EwooZV5Pq9_XYv19X7w2-XGmzHKZpT5biiABgml478XukFmQQbfzGBWfmXJz9lJRT9xOFcc1xPPLEwsRg00GAyI5O-JbQDv-ypGHTKYd5pUHj15yKcz0LBgVFhVMTgPwKnmVLnR0YCJpzAq-QRN-wP906ZM1TlrLOgmH4KkVG328M32arF7sRzmahgYmXKuNBJ3i72n1CUVvD5-zIhgJUvRcxoPLxm7k5URwF0ByCgCzDaEuEuNxP92RdIJut-66YC2pc" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest/80 to-background"></div>
      </div>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm h-16 md:h-16">
        <div className="flex justify-between items-center px-8 h-full max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="떠먹트립 로고" 
              className="object-contain h-10 w-10 md:h-10 md:w-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-neutral-900 uppercase">떠먹트립</h1>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <Search className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform" />
            <User className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform fill-current" />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1024px] mx-auto px-6 py-6 pt-24 pb-20 md:py-8 md:pt-20">
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between bg-white border border-neutral-100 p-6 md:p-6 rounded-2xl shadow-soft-brutal mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-neutral-100">
                <img alt="User avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATNS8UQcgc6Kh4HkVVH-uV6a-4WvfVBLhPagMmQeut0b1hmuiZIIAId2JV0tX9-nGtxyaCose_hozfWA9fuwm9GPSUX2fzuhaD0xy_jtpZBMd48KwmCz8BhrfvtvyiX8IyxrCaJ3lYrsrKrF1ASBWEb83bsGV7XRRhYduKVKDDKMndcp4LJzH4IjC-XlKjNZr1SUq02AS1wK599Jgbcwn45iqntoIwcR8kpOVvBJ0gQCUbB5FtYm8bT8rfr8JpTqwbGQ2CaeM6FPI" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-on-surface mb-2">{user?.name || '홍길동'}</h1>
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <span className="block font-black text-lg md:text-xl">{savedCourses.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">저장된 코스</span>
                </div>
                <div className="text-center">
                  <span className="block font-black text-lg md:text-xl">{savedPlaces.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">저장된 장소</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col gap-2 w-full md:w-auto">
            <button 
              onClick={() => navigate('/edit-profile')}
              className="px-6 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-neutral-800 active:scale-95 transition-all w-full md:w-auto cursor-pointer"
            >
              프로필 수정
            </button>
            <button
              onClick={() => navigate('/edit-travel-tendency')}
              className="px-6 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-neutral-800 active:scale-95 transition-all w-full md:w-auto cursor-pointer"
            >
              여행 성향 수정
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-neutral-400 border-b border-neutral-300 pb-0.5 hover:text-neutral-600 transition-colors cursor-pointer self-center mt-1"
            >
              로그아웃
            </button>
          </div>
        </motion.section>

        {/* Saved Courses Section */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-on-surface">저장된 여행 코스</h2>
              <p className="text-secondary text-xs font-medium">당신만을 위해 큐레이션된 여행 일정</p>
            </div>
            <button 
              onClick={() => navigate('/saved-courses')}
              className="text-xs font-bold text-black border-b-2 border-black pb-0.5 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              전체 보기
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {savedCourses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleViewCourse(course.id, course.title)}
                className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-soft-brutal transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 overflow-hidden relative">
                    <img alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={course.image} referrerPolicy="no-referrer" />
                    <div className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </div>
                  <div className="p-4">
                    {course.themeName && (
                      <span className="inline-block px-2.5 py-0.5 mb-2 bg-black/5 text-neutral-500 text-[10px] font-bold rounded-full border border-neutral-200">
                        🗺 {course.themeName}
                      </span>
                    )}
                    <h3 className="font-bold text-base md:text-md leading-tight mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-xs text-secondary font-medium">{course.info ? course.info.split('•')[0].trim() : ''}</p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id, course.title); }}
                    disabled={viewingCourseId === course.id}
                    className="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-full hover:bg-neutral-800 active:scale-95 transition-all w-fit cursor-pointer disabled:opacity-60 flex items-center gap-1"
                  >
                    {viewingCourseId === course.id
                      ? <><Loader2 className="w-3 h-3 animate-spin" />불러오는 중...</>
                      : '상세보기'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Saved Places Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-on-surface">저장된 장소</h2>
              <p className="text-secondary text-xs font-medium">국내의 매력적인 장소들을 탐색해보세요</p>
            </div>
            <button 
              onClick={() => navigate('/saved-places')}
              className="text-xs font-bold text-black border-b-2 border-black pb-0.5 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              전체 보기
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {['전체', '식당', '숙소', '액티비티'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActivePlaceCategory(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activePlaceCategory === tab ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPlaces.map((place, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  const state = { itemId: place.itemId, name: place.name, image: place.image };
                  if (place.category === '식당') navigate('/restaurant-detail', { state });
                  else if (place.category === '숙소') navigate('/stay-detail', { state });
                  else if (place.category === '액티비티') navigate('/activity-detail', { state });
                }}
                className="flex flex-col sm:flex-row bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-soft-brutal group cursor-pointer"
              >
                <div className="sm:w-36 h-36 overflow-hidden shrink-0">
                  <img alt={place.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={place.image} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-base md:text-md group-hover:text-primary transition-colors">{place.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-bold bg-neutral-50 px-1.5 py-0.5 rounded">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                    <p className="text-secondary text-xs font-medium mb-2">{place.location}</p>
                  </div>
                  <button
                    onClick={() => {
                      const state = { itemId: place.itemId, name: place.name, image: place.image };
                      if (place.category === '식당') navigate('/restaurant-detail', { state });
                      else if (place.category === '숙소') navigate('/stay-detail', { state });
                      else if (place.category === '액티비티') navigate('/activity-detail', { state });
                      else alert('상세 페이지는 아직 준비중입니다.');
                    }}
                    className="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-full hover:bg-neutral-800 active:scale-95 transition-all w-fit self-end sm:self-start cursor-pointer"
                  >
                    상세보기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-t border-neutral-200 rounded-t-[32px] shadow-2xl flex justify-around items-center px-4 pb-8 pt-4">
        <button onClick={() => navigate('/main')} className="flex flex-col items-center justify-center text-neutral-400 px-4 py-2">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">홈</span>
        </button>
        <button className="flex flex-col items-center justify-center text-neutral-400 px-4 py-2">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">검색</span>
        </button>
        <button className="flex flex-col items-center justify-center text-neutral-400 px-4 py-2">
          <Bookmark className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">저장</span>
        </button>
        <div className="flex flex-col items-center justify-center bg-black text-white rounded-full w-14 h-14 -mt-10 shadow-xl border-4 border-white">
          <User className="w-6 h-6 fill-current" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">프로필</span>
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
