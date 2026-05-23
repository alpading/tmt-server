import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, Bookmark, Star, PlusCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { travelService } from '../services/travelService';
import { SavedPlace } from '../types';

export default function SavedPlacesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['전체', '식당', '숙소', '액티비티'];

  useEffect(() => {
    async function loadPlaces() {
      try {
        setLoading(true);
        // Real API Note: Replace with GET '/api/saved-places'
        const saved = await travelService.getSavedPlaces();
        setPlaces(saved);
      } catch (err) {
        console.error('[SavedPlacesPage] failed to fetch saved places', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlaces();
  }, []);

  const handleUnsavePlace = async (place: SavedPlace) => {
    if (!place.domain || !place.itemId) return;
    try {
      await travelService.unsavePlace(place.domain, place.itemId);
      setPlaces(prev => prev.filter(p => !(p.domain === place.domain && p.itemId === place.itemId)));
    } catch (err) {
      console.error('[SavedPlacesPage] failed to unsave place', err);
    }
  };

  const filteredPlaces = activeCategory === '전체' 
    ? places 
    : places.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#f8fbff] text-on-background min-h-screen relative antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-[#f8fbff]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 h-20 shadow-sm">
        <div className="max-w-[1100px] mx-auto h-full flex justify-between items-center px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo" 
              className="w-10 h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="font-black text-xl tracking-tighter text-neutral-900 uppercase">떠먹트립</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-900">
            <Search className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
            <User 
              className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform fill-current" 
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 max-w-[1100px] mx-auto px-6 min-h-screen">
        {/* Header Section */}
        <header className="mb-12 flex flex-col items-start">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/mypage')}
            className="inline-flex items-center justify-center p-2 mb-4 hover:bg-black/5 rounded-full transition-colors active:scale-90"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-primary mb-4 tracking-tight"
          >
            저장된 장소
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary font-medium border-l-4 border-black pl-6"
          >
            {user?.name || '홍길동'}님이 찜한 소중한 장소들입니다.
          </motion.p>
        </header>

        {/* Category Tabs */}
        <nav className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 shadow-sm ${
                activeCategory === cat 
                  ? 'bg-black text-white' 
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 w-full col-span-full">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place, i) => (
              <motion.article 
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-soft-brutal group transition-all hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <img alt={place.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={place.image} referrerPolicy="no-referrer" />
                  <button
                    onClick={() => handleUnsavePlace(place)}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md active:scale-90 transition-transform cursor-pointer"
                    title="보관함에서 삭제"
                  >
                    <Bookmark className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2 text-neutral-400 font-bold text-[10px] uppercase tracking-wider">
                    <span>{place.location} · {place.category}</span>
                    <span className="flex items-center gap-1 text-black">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      {place.rating}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mb-4 text-primary tracking-tight leading-snug">{place.name}</h3>
                  <button
                    onClick={() => {
                      const state = { itemId: place.itemId, name: place.name, image: place.image };
                      if (place.category === '식당') navigate('/restaurant-detail', { state });
                      else if (place.category === '숙소') navigate('/stay-detail', { state });
                      else if (place.category === '액티비티') navigate('/activity-detail', { state });
                      else alert('상세 페이지는 아직 준비중입니다.');
                    }}
                    className="w-full bg-black text-white py-2 rounded-full font-bold text-xs hover:bg-neutral-800 transition-colors active:scale-95 shadow-md shadow-black/5 cursor-pointer"
                  >
                    상세보기
                  </button>
                </div>
              </motion.article>
            ))}

            {/* Add New Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredPlaces.length * 0.1 }}
              onClick={() => navigate('/main')}
              className="border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center min-h-[280px] text-neutral-400 hover:bg-white/40 transition-all cursor-pointer group hover:border-black hover:text-black"
            >
              <PlusCircle className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-sm">새로운 장소 추가하기</p>
            </motion.div>
          </section>
        )}
      </main>

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
