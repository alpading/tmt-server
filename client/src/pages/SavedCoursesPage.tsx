import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, Heart, Clock, MapPin, Moon, Waves, TreePine, PlusCircle, Loader2 } from 'lucide-react';
import { travelService } from '../services/travelService';
import { useAuth } from '../context/AuthContext';

export default function SavedCoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        // Real API Note: Replace with GET '/api/saved-courses'
        const saved = await travelService.getSavedCourses();
        const mapped = saved.map(item => ({
          title: item.title,
          info: item.info || '2박 3일',
          image: item.image,
          iconType: item.title.includes('해안') ? 'clock' : item.title.includes('야경') ? 'moon' : 'tree'
        }));
        setCourses(mapped);
      } catch (err) {
        console.error('[SavedCoursesPage] failed to fetch saved courses', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const renderIcon = (type: string) => {
    switch(type) {
      case 'clock': return <Clock className="w-4 h-4" />;
      case 'pin': return <MapPin className="w-4 h-4" />;
      case 'moon': return <Moon className="w-4 h-4" />;
      case 'waves': return <Waves className="w-4 h-4" />;
      case 'tree':
      default:
        return <TreePine className="w-4 h-4" />;
    }
  };

  const handleRemoveCourse = async (courseId: number | undefined, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!courseId) return;
    try {
      await travelService.unsaveCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId || c.title !== title));
    } catch (err) {
      console.error('[SavedCoursesPage] failed to unsave course', err);
    }
  };

  return (
    <div className="bg-[#f8fbff] text-on-background min-h-screen relative antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img alt="Background decor" 
          className="w-full h-full object-cover opacity-10 blur-xl scale-110" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC09mlwa9BsXeh4ogZCCwPV3bTkzcge6lW6qhHibfDZWztPcekfu8gnFbOKcBYy6J0LL_HyPCdXP2Bi_b_bByqOYgTMCLCEcMODi0hJCWKPyQQcEdKXGHEgjOSxzwuMVMdbZFBOucYnp59wJvoJIj-0KNJAgQo0dxQzAwN13_P0VA3ELkyb2L1-1wRZVwBB_GfqLt59LrZxOvBrnqmDY4iWuu3z1LGYBmYbw3WM5KTL2RAyArcfIJoyhERF1UtsqYzB3MwjY7QvRAM" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-[#f8fbff]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 h-16 shadow-sm">
        <div className="max-w-[1024px] mx-auto h-full flex justify-between items-center px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo" 
              className="w-8 h-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="font-black text-lg tracking-tighter text-neutral-900 uppercase">떠먹트립</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <Search className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
            <User 
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform fill-current" 
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 max-w-[1024px] mx-auto px-6 min-h-screen">
        {/* Header Section */}
        <header className="mb-8 flex flex-col items-start">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/mypage')}
            className="inline-flex items-center justify-center p-1.5 mb-2 hover:bg-black/5 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-primary mb-2 tracking-tight"
          >
            저장된 여행 코스
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base text-secondary font-medium border-l-4 border-black pl-4"
          >
            {user?.name || '홍길동'}님이 찜한 소중한 여행 일정들입니다.
          </motion.p>
        </header>

        {/* Bento Grid / Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20 w-full col-span-full">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div 
                key={`${course.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-soft-brutal group transition-all hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={course.title} 
                    src={course.image} referrerPolicy="no-referrer" />
                  <button
                    onClick={(e) => handleRemoveCourse(course.id, course.title, e)}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md active:scale-90 transition-transform hover:scale-110"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2 text-neutral-400 font-bold text-[10px]">
                    {renderIcon(course.iconType)}
                    <span>{course.info ? course.info.split('•')[0].trim() : ''}</span>
                  </div>
                  <h3 className="text-lg font-black mb-4 text-primary tracking-tight leading-snug">{course.title}</h3>
                  <button 
                    onClick={() => {
                      // Cache the loaded theme/destination settings so they can display details if matching
                      if (course.title.includes('코스')) {
                        const regionAndTheme = course.title.replace(' 코스', '').split(' ');
                        if (regionAndTheme.length >= 2) {
                          localStorage.setItem('selectedRegion', regionAndTheme[0]);
                          localStorage.setItem('selectedThemeName', regionAndTheme.slice(1).join(' '));
                          // Find themeId if matches THEMES
                          if (course.title.includes('액티비티')) localStorage.setItem('selectedThemeId', '1');
                          else if (course.title.includes('인스타')) localStorage.setItem('selectedThemeId', '2');
                          else if (course.title.includes('식도락')) localStorage.setItem('selectedThemeId', '3');
                          else localStorage.setItem('selectedThemeId', '4');
                          localStorage.setItem('viewingSavedCourseTitle', course.title);
                          navigate('/course-recommendations');
                          return;
                        }
                      }
                      alert(`${course.title}의 상세 일정 분석을 준비 중입니다.`);
                    }}
                    className="w-full bg-black text-white py-2 rounded-full font-bold text-xs hover:bg-neutral-800 transition-colors active:scale-95 shadow-md shadow-black/5 cursor-pointer"
                  >
                    상세보기
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Add New Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: courses.length * 0.1 }}
              onClick={() => navigate('/main')}
              className="border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center min-h-[280px] text-neutral-400 hover:bg-white/40 transition-all cursor-pointer group hover:border-black hover:text-black"
            >
              <PlusCircle className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-sm">새로운 여행 코스 추가하기</p>
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
}
