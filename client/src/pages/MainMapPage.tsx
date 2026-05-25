import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Compass, Calendar, Bookmark, X, Loader2 } from 'lucide-react';
import { travelService, Province, DistrictOption } from '../services/travelService';

export default function MainMapPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption | null>(null);

  const [regions, setRegions] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // 시/도 목록 로드
  useEffect(() => {
    travelService.getRegions()
      .then(setRegions)
      .catch((err) => console.error('[MainMapPage] 지역 목록 로드 실패', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegionClick = async (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setLoadingDistricts(true);
    try {
      const list = await travelService.getDistricts(province.id);
      setDistricts(list);
    } catch (err) {
      console.error('[MainMapPage] 시/군/구 로드 실패', err);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictConfirm = () => {
    if (!selectedProvince || !selectedDistrict) return;
    localStorage.setItem('selectedRegion', selectedProvince.displayName);
    localStorage.setItem('selectedDistrict', selectedDistrict.name);
    localStorage.setItem('selectedDistrictId', String(selectedDistrict.id));
    navigate('/recommendation-style');
  };

  return (
    <div className="bg-[#f8fbff] text-on-background min-h-screen font-sans overflow-x-hidden antialiased">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md font-sans tracking-tight sticky top-0 border-b border-neutral-100 shadow-sm z-50">
        <div className="flex justify-between items-center px-8 h-20 max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/login')}>
            <img alt="Tteomeok Trip Logo" 
              className="object-contain h-14 w-14" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-black tracking-tighter text-neutral-900 uppercase">떠먹트립</h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-neutral-900">
              <Search 
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => setIsSearchOpen(true)}
              />
              <User 
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => navigate('/mypage')}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative w-full flex flex-col items-center justify-start py-12 px-6 overflow-y-auto">
        {/* Header Text */}
        <div className="text-center z-10 mb-8 shrink-0">
          <h2 className="text-4xl font-black text-primary mb-3">어디로 떠나시나요?</h2>
          <p className="text-secondary/70 max-w-[400px] mx-auto font-medium">방문하고 싶은 지역을 지도에서 직접 선택하여 찾아보세요.</p>
        </div>

        {/* Map Container */}
        <div className="relative w-full max-w-[700px] aspect-[1181/1332] shrink-0">
          {/* Background Map Image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-soft-brutal bg-white">
            <img alt="Illustrated Map of South Korea" 
              className="w-full h-full object-contain p-8" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz0HvzbAnAYWZR7Wzjn6fw76--HzeRjVWJDcbfhrUkRpDOBBDqqBV_KtHQZmpvRBmUftqL3-a8VH-4clUfFXq-DNfBEoBJ48JJ_6xNDHyjZOxqISS564ZvvdxNaQYn0JYSsthOqjCxZK47nGtmjW6kWyUqX7UZ_x2cqx8-h1lGlabqmTTfKyzx25P6ICuHlWOGlDius__PXhrMZHKmj53uqSdLsiX4xZTkv0OfBFDfu6KGfIx6tqt_Eixe-_ywi-c2UOUG-qnsfLL7" referrerPolicy="no-referrer" />
          </div>

          {/* Hotspot Overlay Layer */}
          <div className="absolute inset-0 z-20">
            {regions.map((region) => (
              <button
                key={region.id || region.displayName}
                onClick={() => handleRegionClick(region)}
                style={{ top: region.top, left: region.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-white border border-neutral-200 py-1.5 px-4 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-black hover:text-white transition-all shadow-md group active:scale-90"
              >
                <span className={`w-2 h-2 rounded-full ${region.color} ${region.pulse ? 'animate-pulse' : ''}`}></span>
                {region.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* Extra spacing for bottom scroll */}
        <div className="h-32 w-full md:hidden"></div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-24 px-4 bg-white/90 backdrop-blur-lg border-t border-neutral-100 md:hidden">
        <div className="flex flex-col items-center justify-center text-primary py-2 px-6 active:scale-90 transition-all duration-150 cursor-pointer">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Explore</span>
        </div>
        <div className="flex flex-col items-center justify-center text-neutral-400 py-2 px-6 hover:bg-neutral-50 transition-all active:scale-90 duration-150 cursor-pointer">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Plan</span>
        </div>
        <div className="flex flex-col items-center justify-center text-neutral-400 py-2 px-6 hover:bg-neutral-50 transition-all active:scale-90 duration-150 cursor-pointer">
          <Bookmark className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Saved</span>
        </div>
        <button onClick={() => navigate('/mypage')} className="flex flex-col items-center justify-center text-neutral-400 py-2 px-6 hover:bg-neutral-50 transition-all active:scale-90 duration-150 cursor-pointer">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </button>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/40"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center p-4 border-b border-neutral-100">
                <Search className="text-neutral-400 mr-3 w-6 h-6" />
                <input 
                  autoFocus
                  className="flex-1 border-none focus:ring-0 text-lg font-sans placeholder-neutral-300 text-neutral-900" 
                  placeholder="식당, 숙소, 여행지를 검색해보세요" 
                  type="text"
                />
                <button 
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors" 
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="w-6 h-6 text-neutral-500" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">추천 검색어</p>
                <div className="flex flex-wrap gap-2">
                  {['강릉 맛집', '제주도 펜션', '경주 역사 투어'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-neutral-100 rounded-full text-sm font-medium hover:bg-neutral-200 cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* District Modal */}
      <AnimatePresence>
        {selectedProvince && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedProvince(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-primary">{selectedProvince.displayName}</h3>
                <button
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors"
                  onClick={() => setSelectedProvince(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-secondary/70 mb-4 font-medium">상세 지역(시/군/구)을 선택해 주세요.</p>
                {loadingDistricts ? (
                  <div className="flex justify-center items-center py-10 w-full">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {districts.map((district) => (
                      <button
                        key={district.id}
                        onClick={() => setSelectedDistrict(district)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          selectedDistrict?.id === district.id
                            ? 'bg-primary text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                        }`}
                      >
                        {district.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 bg-surface-container-low flex gap-3 justify-end">
                <button
                  className="px-6 py-2 rounded-full font-bold text-secondary border border-neutral-200 hover:bg-white transition-colors"
                  onClick={() => setSelectedProvince(null)}
                >
                  취소
                </button>
                <button
                  disabled={!selectedDistrict}
                  className={`px-6 py-2 rounded-full font-bold transition-all shadow-lg ${
                    selectedDistrict
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                  onClick={handleDistrictConfirm}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
