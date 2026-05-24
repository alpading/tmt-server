import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Star, Map as MapIcon, Bookmark, Compass, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface ActivityResult {
  id: number;
  name: string;
  imageUrl: string | null;
  score: number;
}

export default function ActivityRecommendationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as { prefAttrIds?: string; basicFilters?: string };

  const [results, setResults] = React.useState<ActivityResult[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const districtId = localStorage.getItem('selectedDistrictId') || '189';
        const params = new URLSearchParams();
        if (state.basicFilters) params.set('basicFilters', state.basicFilters);
        if (state.prefAttrIds) params.set('prefAttrIds', state.prefAttrIds);
        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await apiClient.get<{ results: ActivityResult[] }>(
          `/activities/search/district/${districtId}${query}`
        );
        setResults(res.data?.results ?? []);
      } catch (err) {
        console.error('[ActivityRecommendationsPage] fetch error', err);
        setError('액티비티 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white text-neutral-900 font-sans min-h-screen antialiased">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 h-20 flex justify-center items-center">
        <nav className="w-full max-w-[1100px] px-8 flex justify-between items-center h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="떠먹트립 로고" className="w-10 h-10 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="text-xl font-black tracking-tighter text-neutral-900">떠먹트립</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors">
              <Search className="w-5 h-5 text-neutral-500" />
            </button>
            <button onClick={() => navigate('/mypage')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors">
              <User className="w-6 h-6 fill-current text-black" />
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-[1100px] mx-auto px-8 mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-4">나에게 딱 맞는 액티비티 TOP 3</h1>
          <div className="w-24 h-2 bg-black"></div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-500">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="font-bold">{error}</p>
          </div>
        )}
        {!loading && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <p className="font-bold">조건에 맞는 액티비티가 없습니다. 필터를 바꿔보세요.</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="overflow-x-auto px-8 custom-scrollbar scroll-smooth">
            <div className="flex gap-8 pb-8 min-w-max">
              {results.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-[350px] md:w-[400px] flex-shrink-0 bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] group"
                >
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    {activity.imageUrl ? (
                      <img alt={activity.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={activity.imageUrl} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 text-5xl">🏃</div>
                    )}
                    <div className="absolute top-4 left-4 bg-black text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                      NO. {index + 1}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-4 py-1.5 bg-neutral-50 text-neutral-600 border border-neutral-100 rounded-full font-bold text-xs">액티비티</span>
                      <div className="flex items-center gap-1 text-black font-black">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{activity.score.toFixed(1)}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-black mb-6 line-clamp-1">{activity.name}</h2>
                    <button
                      onClick={() => navigate('/activity-detail', {
                        state: { itemId: activity.id, name: activity.name, image: activity.imageUrl }
                      })}
                      className="w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-lg shadow-black/5"
                    >
                      상세보기
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 max-w-[400px] mx-auto px-8 text-center space-y-4">
          <button onClick={() => navigate('/main')} className="w-full bg-black text-white py-5 rounded-full font-black tracking-tight text-lg shadow-xl shadow-black/10 hover:bg-neutral-800 active:scale-95 transition-all">
            확인 및 홈으로 이동 ✨
          </button>
          <button onClick={() => navigate('/category-selection')} className="text-sm font-bold text-neutral-500 hover:text-black transition-colors underline decoration-2 cursor-pointer">
            다른 카테고리 찾아보기
          </button>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-white border-t border-neutral-100">
        <button className="flex flex-col items-center justify-center text-neutral-400 gap-1"><MapIcon className="w-6 h-6" /><span className="text-[10px] font-bold uppercase tracking-widest">Trips</span></button>
        <button className="flex items-center justify-center bg-black text-white rounded-full px-6 py-2 shadow-lg shadow-black/20"><Compass className="w-5 h-5 mr-1" /><span className="text-xs font-black uppercase tracking-widest">Explore</span></button>
        <button className="flex flex-col items-center justify-center text-neutral-400 gap-1"><Bookmark className="w-6 h-6" /><span className="text-[10px] font-bold uppercase tracking-widest">Saved</span></button>
      </nav>

      <style>{`.custom-scrollbar::-webkit-scrollbar{height:8px}.custom-scrollbar::-webkit-scrollbar-track{background:#f5f5f5;border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#000;border-radius:10px}.custom-scrollbar{scrollbar-width:thin;scrollbar-color:#000 #f5f5f5}`}</style>
    </div>
  );
}
