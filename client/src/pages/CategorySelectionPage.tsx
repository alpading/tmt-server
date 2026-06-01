import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, Sparkles } from 'lucide-react';

export default function CategorySelectionPage() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('제주도');
  const [selectedDistrict, setSelectedDistrict] = useState('서귀포시');

  useEffect(() => {
    const region = localStorage.getItem('selectedRegion') || '제주도';
    const district = localStorage.getItem('selectedDistrict') || '서귀포시';
    setSelectedRegion(region);
    setSelectedDistrict(district);
  }, []);

  const categories = [
    {
      title: '식당',
      description: '내 취향에 딱 맞는 식당 추천',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
      action: () => navigate('/restaurant-preference')
    },
    {
      title: '액티비티',
      description: '내 취향에 딱 맞는 액티비티 추천',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
      action: () => navigate('/activity-preference')
    },
    {
      title: '숙소',
      description: '내 취향에 딱 맞는 숙소 추천',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
      action: () => navigate('/stay-preference')
    }
  ];

  return (
    <div className="bg-background font-sans text-on-background min-h-screen relative antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-surface"></div>
      </div>

      {/* Top Navigation */}
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

      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-20">
        {/* Back Button */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/recommendation-style')}
            className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="border-b-2 border-transparent hover:border-black transition-all">추천 방법 변경하기</span>
          </button>
        </div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-left"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-black/5 rounded-full text-xs font-black text-neutral-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>선택 지역: {selectedRegion} {selectedDistrict}</span>
          </div>
          <h2 className="text-4xl font-black text-on-background tracking-tight">
            카테고리를 선택해보세요
          </h2>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer flex flex-col gap-6 bg-white border border-neutral-100 p-4 rounded-[3rem] shadow-soft-brutal hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={cat.title} 
                  src={cat.image} referrerPolicy="no-referrer" />
              </div>
              <div className="px-6 pb-6 text-center flex flex-col gap-3">
                <h3 className="text-2xl font-black text-primary">{cat.title}</h3>
                <p className="text-sm text-neutral-500 font-medium">{cat.description}</p>
                <div className="mt-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      cat.action();
                    }}
                    className="w-full py-5 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                  >
                    추천 받기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
