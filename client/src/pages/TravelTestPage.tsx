import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Category {
  title: string;
  questions: Question[];
}

const TEST_DATA: Category[] = [
  {
    title: '식당 취향 질문',
    questions: [
      { id: 1, text: '기름지고 느끼한 음식을 즐기나요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 2, text: '건강하고 담백한 음식을 즐기나요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 3, text: '달고 짠 맛이 강한 자극적인 음식을 즐기나요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 4, text: '매운 음식을 적극적으로 찾아 즐기시나요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 5, text: '식당이 시끄러우면 다른 곳을 선택할 정도로 중요한가요?', options: ['매우 중요하다', '보통이다', '전혀 중요하지 않다'] },
      { id: 6, text: '식당의 청결 상태가 기준에 미치지 않으면 방문을 포기할 정도로 중요한가요?', options: ['매우 중요하다', '보통이다', '전혀 중요하지 않다'] },
      { id: 7, text: '식당의 인테리어(분위기)가 마음에 들면, 다른 조건이 조금 아쉬워도 방문할 의향이 있나요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 8, text: '직원의 응대가 불친절하면, 음식이 좋아도 다른 식당을 선택하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
    ]
  },
  {
    title: '숙소 취향 질문',
    questions: [
      { id: 9, text: '숙소 주변 풍경(뷰)이 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 10, text: '숙소의 인테리어(분위기)가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 11, text: '숙소 공간이 좁거나 답답하게 느껴지면, 다른 조건이 좋아도 선택을 피하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 12, text: '숙소의 방음이 좋지 않으면, 수면이나 휴식에 방해를 받을 정도로 중요한 요소인가요?', options: ['매우 중요하다', '보통이다', '전혀 중요하지 않다'] },
      { id: 13, text: '숙소의 청결 상태가 기준에 미치지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
      { id: 14, text: '직원의 응대가 좋지 않으면, 다른 조건이 좋아도 선택을 피하는 편인가요?', options: ['매우 그렇다', '보통이다', '전혀 아니다'] },
    ]
  },
  {
    title: '액티비티 취향 질문',
    questions: [
      { id: 15, text: '여행을 할 때 미술관, 전시, 공연 등 문화/전시형 여행지가 필수인가요?', options: ['필요하다', '보통이다', '필요 없다'] },
      { id: 16, text: '여행을 할 때 바다, 산, 숲, 야경 명소 등 풍경 감상형 여행지가 필수인가요?', options: ['필요하다', '보통이다', '필요 없다'] },
      { id: 17, text: '여행을 할 때 카페, 산책, 스파 등 힐링/휴식형 여행지가 필수인가요?', options: ['필요하다', '보통이다', '필요 없다'] },
      { id: 18, text: '여행을 할 때 등산, 서핑, 스키, 놀이기구 등 활동형 여행지가 필수인가요?', options: ['필요하다', '보통이다', '필요 없다'] },
    ]
  }
];

export default function TravelTestPage() {
  const navigate = useNavigate();
  const { updateTendency } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleOptionClick = (questionId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / 18) * 100;

  const handleComplete = async () => {
    if (answeredCount < 18) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await updateTendency(answers);
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
          src="https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com/basic/%EB%B0%B0%EA%B2%BD%EC%9D%B4%EB%AF%B8%EC%A7%80.png" referrerPolicy="no-referrer" />
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
                  <span className="text-[12px] text-black font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">문항 {answeredCount}-18</span>
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

            <div className="space-y-16">
              {TEST_DATA.map((category, catIdx) => (
                <div key={catIdx} className="pt-8 border-t border-neutral-100 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-black rounded-full"></div>
                    <h3 className="text-2xl font-black text-primary">{category.title}</h3>
                  </div>

                  <div className="space-y-12">
                    {category.questions.map((q) => (
                      <div key={q.id} className="space-y-5">
                        <h2 className="text-xl font-bold flex gap-3 text-primary items-start">
                          <span>{q.id}.</span>
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

            <div className="mt-20 space-y-4">
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                  {submitError}
                </div>
              )}
              <button
                onClick={handleComplete}
                disabled={answeredCount < 18 || submitting}
                className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 duration-150 font-bold shadow-xl
                  ${answeredCount === 18 && !submitting
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
                  남은 질문을 모두 완료해 주세요 ({answeredCount}/18)
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
