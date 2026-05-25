import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, PreferenceSection } from '../services/authService';

export default function EditTravelTendencyPage() {
  const navigate = useNavigate();
  const { updateTendency: updateTravelTendency } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorWord, setErrorWord] = useState('');
  const [loadingPref, setLoadingPref] = useState(true);
  const [sections, setSections] = useState<PreferenceSection[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    // 질문 목록 + 기존 성향 병렬 fetch
    Promise.all([
      authService.getPreferenceQuestions(),
      authService.getPreference(),
    ]).then(([fetchedSections, idxAnswers]) => {
      setSections(fetchedSections);
      // optionIdx → 옵션 텍스트로 변환
      if (idxAnswers && Object.keys(idxAnswers).length > 0) {
        const textAnswers: Record<number, string> = {};
        for (const section of fetchedSections) {
          for (const q of section.questions) {
            const idx = idxAnswers[q.id];
            if (idx !== undefined && q.options[idx] !== undefined) {
              textAnswers[q.id] = q.options[idx];
            }
          }
        }
        setAnswers(textAnswers);
      }
    }).catch(() => {}).finally(() => setLoadingPref(false));
  }, []);

  // prefKey 맵 빌드
  const prefKeyMap: Record<number, string> = {};
  sections.forEach(sec => sec.questions.forEach(q => { prefKeyMap[q.id] = q.prefKey; }));

  const handleOptionClick = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorWord('');
    setSuccess(false);
    try {
      // 텍스트 답변 → optionIdx(0/1/2) 변환
      const numericAnswers: Record<number, number> = {};
      for (const section of sections) {
        for (const q of section.questions) {
          const idx = q.options.indexOf(answers[q.id]);
          if (idx !== -1) numericAnswers[q.id] = idx;
        }
      }
      await updateTravelTendency(numericAnswers, prefKeyMap);
      setSuccess(true);
      setTimeout(() => navigate('/mypage'), 1500);
    } catch (err: any) {
      setErrorWord(err.message || '성향 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased h-screen overflow-hidden font-sans relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0">
        <img alt="Beautiful tropical beach" 
          className="w-full h-full object-cover" 
          src="https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com/basic/background.png" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]"></div>
      </div>

      {/* Layout Container */}
      <div className="relative z-10 max-w-4xl mx-auto h-screen flex flex-col px-4">
        {/* Header */}
        <header className="flex-none w-full z-50 py-4 md:py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => navigate('/mypage')}
                className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-black hover:bg-neutral-100 transition-all active:scale-95 shadow-sm border border-neutral-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 max-w-sm px-4">
                <div className="flex justify-center items-end mb-2">
                  <span className="text-[12px] text-black font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">총 {sections.reduce((s, sec) => s + sec.questions.length, 0)}문항</span>
                </div>
                <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  <div className="h-full bg-black transition-all duration-500 rounded-full w-full"></div>
                </div>
              </div>
              <div className="w-10 h-10 invisible"></div>
            </div>
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img alt="떠먹트립 로고" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </header>

        {/* Main Content Card */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-10 custom-scrollbar">
          <div className="w-full max-w-[650px] mx-auto bg-white rounded-2xl p-6 md:p-10 shadow-2xl border border-neutral-100">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black text-primary mb-3 tracking-tight">여행 성향 테스트</h1>
              <p className="text-lg text-secondary font-medium px-4">18개의 질문을 통해 나에게 딱 맞는 완벽한 여행을 찾아보세요</p>
            </div>

            {loadingPref && (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
              </div>
            )}

            {/* Questions Sections */}
            {!loadingPref && <div className="space-y-16">
              {sections.map((section, secIdx) => (
                <div key={section.sectionTitle} className={`pt-8 ${secIdx !== 0 ? 'border-t border-neutral-100' : ''}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-black rounded-full"></div>
                    <h3 className="text-2xl font-black text-primary">{section.sectionTitle}</h3>
                  </div>
                  <div className="space-y-12">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-5">
                        <h2 className="text-xl font-bold flex gap-3 text-primary items-start">
                          <span>{sections.slice(0, secIdx).reduce((s, s2) => s + s2.questions.length, 0) + qIdx + 1}.</span>
                          <span>{q.text}</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options.map((option) => {
                            const isSelected = answers[q.id] === option;
                            return (
                              <button
                                key={option}
                                onClick={() => handleOptionClick(q.id, option)}
                                className={`w-full text-left px-6 py-4 rounded-full border-2 transition-all duration-200 flex justify-between items-center group ${
                                  isSelected
                                    ? 'border-black bg-black text-white shadow-lg'
                                    : 'border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-300'
                                }`}
                              >
                                <span className={`text-base font-medium ${isSelected ? 'font-bold' : ''}`}>{option}</span>
                                <CheckCircle2 className={`w-5 h-5 transition-opacity ${
                                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                }`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>}

            {/* CTA Button */}
            {!loadingPref && <div className="mt-20 space-y-4">
              {errorWord && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                  {errorWord}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-xs font-bold text-green-700 flex items-center justify-center gap-2">
                  <span>성공적으로 저장되었습니다! 마이페이지로 이동합니다.</span>
                </div>
              )}

              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-5 bg-black text-white rounded-full flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all active:scale-95 duration-150 font-bold shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    <span className="text-xl">저장하기</span>
                    <TrendingUp className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>}
          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
