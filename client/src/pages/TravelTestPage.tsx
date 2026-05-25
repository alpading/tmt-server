import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService, PreferenceSection } from '../services/authService';

export default function TravelTestPage() {
  const navigate = useNavigate();
  const { updateTendency } = useAuth();
  const [sections, setSections] = useState<PreferenceSection[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    authService.getPreferenceQuestions()
      .then(setSections)
      .catch(() => {})
      .finally(() => setLoadingQuestions(false));
  }, []);

  const totalQuestions = sections.reduce((s, sec) => s + sec.questions.length, 0);

  // prefKey 맵 빌드 (질문 id → prefKey)
  const prefKeyMap: Record<number, string> = {};
  sections.forEach(sec => sec.questions.forEach(q => { prefKeyMap[q.id] = q.prefKey; }));

  const handleOptionClick = (questionId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleComplete = async () => {
    if (answeredCount < totalQuestions) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await updateTendency(answers, prefKeyMap);
      navigate('/main');
    } catch (err: any) {
      setSubmitError(err.message || '성향 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased h-screen overflow-hidden font-sans relative">
      <div className="fixed inset-0 z-0">
        <img alt="Beautiful tropical beach" 
          className="w-full h-full object-cover" 
          src="https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com/basic/background.png" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto h-screen flex flex-col px-4">
        <header className="flex-none w-full z-50 py-4 md:py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => navigate('/signup')}
                className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-black hover:bg-neutral-100 transition-all active:scale-95 shadow-sm border border-neutral-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 max-w-sm px-4">
                <div className="flex justify-center items-end mb-2">
                  <span className="text-[12px] text-black font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">문항 {answeredCount}/{totalQuestions}</span>
                </div>
                <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  <div 
                    className="h-full bg-black transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
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

        <main className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          <div className="w-full max-w-[650px] mx-auto bg-white rounded-2xl p-6 md:p-10 shadow-2xl border border-neutral-100">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black text-primary mb-3 tracking-tight">여행 성향 테스트</h1>
              <p className="text-lg text-secondary font-medium px-4">18개의 질문을 통해 나에게 딱 맞는 완벽한 여행을 찾아보세요</p>
            </div>

            {loadingQuestions ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <div className="space-y-16">
                {sections.map((section, secIdx) => (
                  <div key={secIdx} className="pt-8 border-t border-neutral-100 first:border-t-0 first:pt-0">
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
                            {q.options.map((opt, optIdx) => {
                              const isSelected = answers[q.id] === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleOptionClick(q.id, optIdx)}
                                  className={`w-full text-left px-6 py-4 rounded-full border-2 transition-all duration-200 flex justify-between items-center group
                                    ${isSelected
                                      ? 'border-black bg-black text-white shadow-lg'
                                      : 'border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-300'}`}
                                >
                                  <span className={`text-base font-medium ${isSelected ? 'font-bold' : ''}`}>{opt}</span>
                                  <CheckCircle2 className={`w-5 h-5 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-20 space-y-4">
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                  {submitError}
                </div>
              )}
              <button
                onClick={handleComplete}
                disabled={answeredCount < totalQuestions || submitting}
                className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 duration-150 font-bold shadow-xl
                  ${answeredCount === totalQuestions && !submitting
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed opacity-50'}`}
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                ) : (
                  <>
                    <span className="text-xl">테스트 완료</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
              {answeredCount < 18 && !submitting && (
                <p className="text-center text-xs text-neutral-400 mt-4 font-bold tracking-widest uppercase">
                  남은 질문을 모두 완료해 주세요 ({answeredCount}/{totalQuestions})
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>{`
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
