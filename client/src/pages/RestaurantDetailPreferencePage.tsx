import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Utensils, Armchair, ChevronRight, ArrowRight, X, Info } from 'lucide-react';

export default function RestaurantDetailPreferencePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = (location.state || {}) as { categoryId?: number; basicFilters?: string };

  const FOOD_PREF_MAP: Record<string, number> = {
    '기름지고 느끼한 음식': 1,
    '건강하고 담백한 음식': 2,
    '달고 짠 자극적인 음식': 3,
    '스트레스 풀리는 매운 음식': 4,
  };
  const SPACE_PREF_MAP: Record<string, number> = {
    '소음이 없고 조용한 식당': 7,
    '위생 및 청결상태가 깔끔한 식당': 8,
    '인테리어 및 분위기가 좋은 식당': 5,
    '직원의 응대가 친절한 식당': 6,
  };

  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  
  const [selectedFoodChoice, setSelectedFoodChoice] = useState('상관없어요');
  const [tempFoodChoice, setTempFoodChoice] = useState('상관없어요');
  
  const [selectedSpaceChoice, setSelectedSpaceChoice] = useState('상관없어요');
  const [tempSpaceChoice, setTempSpaceChoice] = useState('상관없어요');

  const foodOptions = [
    '상관없어요', 
    '기름지고 느끼한 음식', 
    '건강하고 담백한 음식', 
    '달고 짠 자극적인 음식', 
    '스트레스 풀리는 매운 음식'
  ];

  const spaceOptions = [
    '상관없어요', 
    '소음이 없고 조용한 식당', 
    '위생 및 청결상태가 깔끔한 식당', 
    '인테리어 및 분위기가 좋은 식당', 
    '직원의 응대가 친절한 식당'
  ];

  const handleOpenFoodModal = () => {
    setTempFoodChoice(selectedFoodChoice);
    setIsFoodModalOpen(true);
  };

  const handleOpenSpaceModal = () => {
    setTempSpaceChoice(selectedSpaceChoice);
    setIsSpaceModalOpen(true);
  };

  const applyFoodSelection = () => {
    setSelectedFoodChoice(tempFoodChoice);
    setIsFoodModalOpen(false);
  };

  const applySpaceSelection = () => {
    setSelectedSpaceChoice(tempSpaceChoice);
    setIsSpaceModalOpen(false);
  };

  const handleRecommend = () => {
    const prefIds: number[] = [];
    if (FOOD_PREF_MAP[selectedFoodChoice]) prefIds.push(FOOD_PREF_MAP[selectedFoodChoice]);
    if (SPACE_PREF_MAP[selectedSpaceChoice]) prefIds.push(SPACE_PREF_MAP[selectedSpaceChoice]);
    navigate('/restaurant-recommendations', {
      state: {
        categoryId: prevState.categoryId,
        basicFilters: prevState.basicFilters,
        prefAttrIds: prefIds.join(','),
      },
    });
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
            onClick={() => navigate('/restaurant-preference')}
            className="flex items-center text-neutral-500 hover:text-black transition-colors gap-1.5 text-base font-semibold group"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>이전으로 돌아가기</span>
          </button>
        </div>

        {/* Title Section */}
        <section className="w-full mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-primary tracking-tight leading-tight">
            어떤 식당을 가고 싶으신가요?
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium tracking-tight">
            본인의 취향에 맞게 필터를 추가해 보세요.
          </p>
        </section>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20 max-w-4xl mx-auto">
          {/* Food Preference Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-xl shadow-black/5 p-10 flex flex-col items-center text-center border border-neutral-100 transition-all"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-8 shrink-0">
              <Utensils className="text-neutral-800 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-8">음식 취향</h3>
            <div className="mb-10 text-center">
              <div className={`px-6 py-3 rounded-full font-bold text-sm min-w-[140px] border transition-all flex justify-center ${
                selectedFoodChoice === '상관없어요' 
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-100' 
                  : 'bg-white text-black border-black shadow-sm'
              }`}>
                {selectedFoodChoice}
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={handleOpenFoodModal}
                className="bg-black text-white py-4 px-12 rounded-full font-bold text-base hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10 group"
              >
                선택하기
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Space Preference Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-xl shadow-black/5 p-10 flex flex-col items-center text-center border border-neutral-100 transition-all"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-8 shrink-0">
              <Armchair className="text-neutral-800 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-8">공간 및 서비스 취향</h3>
            <div className="mb-10 text-center">
              <div className={`px-6 py-3 rounded-full font-bold text-sm min-w-[140px] border transition-all flex justify-center ${
                selectedSpaceChoice === '상관없어요' 
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-100' 
                  : 'bg-white text-black border-black shadow-sm'
              }`}>
                {selectedSpaceChoice}
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={handleOpenSpaceModal}
                className="bg-black text-white py-4 px-12 rounded-full font-bold text-base hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10 group"
              >
                선택하기
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Final CTA and Pagination */}
        <div className="w-full max-w-xl flex flex-col items-center gap-10 mt-auto">
          <button 
            onClick={handleRecommend}
            className="w-full bg-black text-white py-6 rounded-full text-xl font-bold shadow-2xl shadow-black/30 hover:bg-neutral-900 transition-all active:scale-[0.98] flex justify-center items-center gap-3 group"
          >
            추천받기
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
          </button>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-black text-neutral-300 tracking-widest uppercase">2/2</div>
              <div className="w-32 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Food Preference Modal */}
      <AnimatePresence>
        {isFoodModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFoodModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-primary">음식 취향</h2>
                <button onClick={() => setIsFoodModalOpen(false)} className="text-neutral-400 hover:text-primary transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {foodOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => setTempFoodChoice(option)}
                    className={`px-6 py-4 rounded-full border text-left font-bold transition-all ${
                      tempFoodChoice === option 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-neutral-700 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
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
                  onClick={() => setIsFoodModalOpen(false)}
                  className="flex-1 py-4 rounded-full border border-neutral-200 font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={applyFoodSelection}
                  className="flex-1 py-4 rounded-full bg-black text-white font-bold hover:bg-neutral-800 transition-all shadow-lg"
                >
                  선택하기
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Space Preference Modal */}
        {isSpaceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSpaceModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-primary">공간 및 서비스 취향</h2>
                <button onClick={() => setIsSpaceModalOpen(false)} className="text-neutral-400 hover:text-primary transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {spaceOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => setTempSpaceChoice(option)}
                    className={`px-6 py-4 rounded-full border text-left font-bold transition-all ${
                      tempSpaceChoice === option 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-neutral-700 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
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
                  onClick={() => setIsSpaceModalOpen(false)}
                  className="flex-1 py-4 rounded-full border border-neutral-200 font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={applySpaceSelection}
                  className="flex-1 py-4 rounded-full bg-black text-white font-bold hover:bg-neutral-800 transition-all shadow-lg"
                >
                  선택하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
