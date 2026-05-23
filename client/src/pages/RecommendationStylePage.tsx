import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, User, Search } from 'lucide-react';

export default function RecommendationStylePage() {
  const navigate = useNavigate();

  const handleSelectCourse = () => {
    navigate('/theme-selection');
  };

  const handleSelectCategory = () => {
    navigate('/category-selection');
  };

  return (
    <div className="bg-background font-sans text-on-surface antialiased min-h-screen relative overflow-x-hidden">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm h-20">
        <div className="flex justify-between items-center px-8 h-full max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo" 
              className="object-contain h-12 w-12" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-black tracking-tighter text-neutral-900 uppercase">떠먹트립</h1>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-neutral-900 cursor-pointer hover:scale-110 transition-transform" />
            <User 
              className="w-6 h-6 text-neutral-900 cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative min-h-screen flex flex-col items-center pt-20">
        <div className="relative z-10 w-full max-w-[1100px] px-6 py-20 flex flex-col items-center">
          <div className="w-full flex justify-start mb-4">
            <button 
              onClick={() => navigate('/main')}
              className="flex items-center gap-1 text-primary font-bold hover:underline transition-all text-sm md:text-base cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              지역 다시 선택하기
            </button>
          </div>

          {/* Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 max-w-2xl px-4"
          >
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-primary tracking-tight leading-tight">나에게 맞는 추천 방식을 선택해 보세요</h1>
            <p className="text-lg text-secondary font-medium">당신의 취향에 딱 맞는 특별한 여행 경로를 설계해 드립니다.</p>
          </motion.div>

          {/* Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:px-0 px-4">
            {/* Card 1: Full Course */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft-brutal hover:translate-y-[-8px] transition-all duration-300 border border-neutral-100"
            >
              <div className="h-64 md:h-72 overflow-hidden relative">
                <img alt="Airplane wing in sky" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjtifSqq7AQFrVblnf7lP007UgwiPJd3a38JyWHwqgQNLav6nxcvfmA9odv8fYjsaBUY3FmrQ0ydxaGogizy-gFcVecfqKK-y4hUYmy4edHGVlimkqFPHKjT070GzpcpqEKcukoenobvFHxqBGu_qU3-vlEY5yirAXf3O-C5Pg-CILO-WzIe6sBdoqjrdxIplIpR0pu5huAw1qvQ0-TbrmTxK2-YkKHvc9KJLrBn7DVNvbctNWiGdK0lyplK9MjIBYjJL7ilyVVgdz" />
              </div>
              <div className="p-8 md:p-10 flex flex-col items-start text-left">
                <h2 className="text-2xl font-black mb-4 tracking-tight">전체 코스 추천</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed mb-10 min-h-[80px]">여행 일정에 맞춘 완벽한 하루 코스를 제안해 드립니다. 동선과 시간을 고려한 최적의 일정입니다.</p>
                <button 
                  onClick={handleSelectCourse}
                  className="w-full bg-black text-white py-5 px-8 rounded-full font-bold flex items-center justify-center gap-2 group/btn active:scale-95 transition-all shadow-lg shadow-black/10"
                >
                  <span>선택하기</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 2: Detail Category */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft-brutal hover:translate-y-[-8px] transition-all duration-300 border border-neutral-100"
            >
              <div className="h-64 md:h-72 overflow-hidden relative">
                <img alt="Airplane flying over clouds" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdApZI-glyZsskP7X7nQc3RkUlsuEEnLnfMScjApy8CHRqkhu7NBRLOf_6BJIKs68ND4eeGItoJE2ZTFKbBhMTs1nwuT-95ZV9YWvN9zjxvsWl4YyHQXGV2trsHqVPsEa1zQms6_w4ksQS8FjwomWTEbenSVxy36dGJbF-0ZjaJZBtaK0Ouk82XXhcTTPNSX3yafxpyFm1pQbpPobHoP2JYzDV0tFSgkhI3SA0fcSP8x0uprah5JnK2ndfnDD4Txg8VcRWwcVc7jLH" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8 md:p-10 flex flex-col items-start text-left">
                <h2 className="text-2xl font-black mb-4 tracking-tight">상세 카테고리 추천</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed mb-10 min-h-[80px]">맛집, 카페, 명소 등 원하는 카테고리별로 심도 있는 장소들을 추천해 드립니다. 당신만의 특별한 취향을 찾아보세요.</p>
                <button 
                  onClick={handleSelectCategory}
                  className="w-full bg-black text-white py-5 px-8 rounded-full font-bold flex items-center justify-center gap-2 group/btn active:scale-95 transition-all shadow-lg shadow-black/10"
                >
                  <span>선택하기</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

