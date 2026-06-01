import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X, Info, ChevronRight, ArrowRight, FerrisWheel, Settings2 } from 'lucide-react';

export default function ActivityPreferencePage() {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [selectedType, setSelectedType] = useState('상관없어요');
  const [tempType, setTempType] = useState('상관없어요');
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);

  const typeOptions = [
    '상관없어요', '문화/전시형', '풍경/감상형', '힐링/휴식형', '레저/액티비티형'
  ];

  const filterOptions = [
    '주차 공간', '아이와 함께', '쇼핑', '휠체어 접근 가능',
    '무료', '카페', '반려동물 동반'
  ];

  const TYPE_PREF_MAP: Record<string, number> = {
    '문화/전시형': 15,
    '풍경/감상형': 16,
    '힐링/휴식형': 17,
    '레저/액티비티형': 18,
  };
  const FILTER_KEY_MAP: Record<string, string> = {
    '주차 공간': 'availableParking',
    '아이와 함께': 'isKidFriendly',
    '쇼핑': 'isShopping',
    '휠체어 접근 가능': 'isWheelchairAccessible',
    '무료': 'isFree',
    '카페': 'isCafe',
    '반려동물 동반': 'allowsPets',
  };

  const handleOpenTypeModal = () => {
    setTempType(selectedType);
    setIsTypeModalOpen(true);
  };

  const handleOpenFilterModal = () => {
    setTempFilters([...selectedFilters]);
    setIsFilterModalOpen(true);
  };

  const applyTypeSelection = () => {
    setSelectedType(tempType);
    setIsTypeModalOpen(false);
  };

  const applyFilterSelection = () => {
    setSelectedFilters([...tempFilters]);
    setIsFilterModalOpen(false);
  };

  const toggleFilterOption = (option: string) => {
    if (tempFilters.includes(option)) {
      setTempFilters([]);
    } else {
      setTempFilters([option]);
    }
  };

  const handleRecommend = () => {
    const prefAttrIds = TYPE_PREF_MAP[selectedType] ? String(TYPE_PREF_MAP[selectedType]) : '';
    const basicFilters = selectedFilters.map(f => FILTER_KEY_MAP[f]).filter(Boolean).join(',');
    navigate('/activity-recommendations', { state: { prefAttrIds, basicFilters } });
  };

  return (
    <div className="bg-white text-neutral-900 font-sans min-h-screen flex flex-col items-center antialiased">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-neutral-100 h-20 flex justify-center items-center shadow-sm">
        <nav className="w-full max-w-[1100px] px-8 flex justify-between items-center h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="떠먹트립 로고" 
              className="w-10 h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="text-xl font-black tracking-tighter text-neutral-900">떠먹트립</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-neutral-50 rounded-full px-5 py-2.5 border border-transparent transition-all focus-within:bg-white focus-within:border-primary">
              <Search className="text-neutral-500 mr-2 w-5 h-5" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium placeholder:text-neutral-400" 
                placeholder="식당 검색..." 
                type="text" 
              />
            </div>
            <button 
              onClick={() => navigate('/mypage')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <User className="w-6 h-6 fill-current text-black" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1100px] pt-40 pb-20 px-8 flex flex-col flex-grow items-center">
        {/* Navigation Back Link */}
        <div className="w-full mb-10">
          <button 
            onClick={() => navigate('/category-selection')}
            className="flex items-center text-neutral-500 hover:text-black transition-colors gap-1.5 text-base font-semibold group"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>이전으로 돌아가기</span>
          </button>
        </div>

        {/* Header Section */}
        <section className="w-full mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-primary tracking-tight leading-tight">
            어떤 액티비티를 가고 싶으신가요?
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium tracking-tight">
            본인의 취향에 맞게 필터를 추가해 보세요.
          </p>
        </section>

        {/* Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20 max-w-4xl mx-auto">
          {/* Type Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-xl shadow-black/5 p-10 flex flex-col items-center text-center border border-neutral-100 transition-all"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-8 shrink-0">
              <FerrisWheel className="w-7 h-7 text-neutral-800" />
            </div>
            <h3 className="text-2xl font-black mb-8">액티비티 종류</h3>
            <div className="mb-10 text-center">
              <div className={`px-6 py-3 rounded-full font-bold text-sm min-w-[140px] border transition-all flex justify-center ${
                selectedType === '상관없어요' 
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-100' 
                  : 'bg-white text-black border-black shadow-sm'
              }`}>
                {selectedType}
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={handleOpenTypeModal}
                className="bg-black text-white py-4 px-12 rounded-full font-bold text-base hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10 group"
              >
                선택하기
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Mandatory Features Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-xl shadow-black/5 p-10 flex flex-col items-center text-center border border-neutral-100 transition-all"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-8 shrink-0">
              <Settings2 className="w-7 h-7 text-neutral-800" />
            </div>
            <h3 className="text-2xl font-black mb-8 text-primary">반드시 필요한 건?</h3>
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-2 min-h-[44px]">
                {selectedFilters.length === 0 ? (
                  <span className="inline-flex items-center px-6 py-3 bg-neutral-50 text-neutral-400 border border-neutral-100 rounded-full font-bold text-sm min-w-[140px] justify-center">
                    딱히 없어요
                  </span>
                ) : (
                  selectedFilters.map(filter => (
                    <span key={filter} className="inline-flex items-center px-6 py-3 bg-white text-black border border-black rounded-full font-bold text-sm shadow-sm">
                      {filter}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={handleOpenFilterModal}
                className="bg-black text-white py-4 px-12 rounded-full font-bold text-base hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10 group"
              >
                선택하기
              </button>
            </div>
          </motion.div>
        </div>

        {/* CTA & Progress */}
        <div className="w-full max-w-xl flex flex-col items-center gap-10 mt-auto">
          <button 
            onClick={handleRecommend}
            className="group w-full bg-black text-white py-6 rounded-full flex items-center justify-center gap-3 hover:bg-neutral-900 active:scale-[0.98] transition-all shadow-2xl shadow-black/30"
          >
            <span className="font-black text-xl">추천받기</span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
          </button>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-black text-neutral-300 tracking-widest uppercase">1/1</div>
              <div className="w-32 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-black rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Type Modal */}
      <AnimatePresence>
        {isTypeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTypeModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-primary">액티비티 종류</h2>
                <button onClick={() => setIsTypeModalOpen(false)} className="text-neutral-400 hover:text-primary transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {typeOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => setTempType(option)}
                    className={`py-3.5 rounded-2xl border transition-all font-bold text-sm ${
                      tempType === option 
                        ? 'bg-black text-white border-black' 
                        : 'border-neutral-200 bg-white text-neutral-500 hover:border-black'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mb-8 text-neutral-400">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">한 가지만 선택 가능</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsTypeModalOpen(false)}
                  className="flex-1 py-4 rounded-full bg-neutral-100 text-neutral-500 font-bold hover:bg-neutral-200 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={applyTypeSelection}
                  className="flex-1 py-4 rounded-full bg-primary text-white font-bold hover:bg-neutral-800 transition-colors"
                >
                  선택
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-primary">필터 옵션 선택</h2>
                  <p className="text-sm text-neutral-400 font-medium">원하는 옵션을 1개 선택해 보세요.</p>
                </div>
                <button onClick={() => setIsFilterModalOpen(false)} className="text-neutral-400 hover:text-primary transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {filterOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => toggleFilterOption(option)}
                    className={`py-3.5 px-2 rounded-2xl border transition-all font-bold text-sm ${
                      tempFilters.includes(option)
                        ? 'bg-black text-white border-black' 
                        : 'border-neutral-200 bg-white text-neutral-500 hover:border-black'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mb-8 text-neutral-400">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">1개만 선택 가능</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-4 rounded-full bg-neutral-100 text-neutral-500 font-bold hover:bg-neutral-200 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={applyFilterSelection}
                  className="flex-1 py-4 rounded-full bg-primary text-white font-bold hover:bg-neutral-800 transition-colors"
                >
                  선택
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
