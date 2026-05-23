import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalLoading(true);

    try {
      // Connects to simulated authService.login()
      // Real API: POST to /api/auth/login or similar endpoint
      await login(userId, password);
      navigate('/main');
    } catch (err: any) {
      setLocalError(err.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-surface-container-low">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[1100px] w-full grid md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-2xl min-h-[750px] border border-neutral-100"
      >
        {/* Left Section: Image */}
        <div className="hidden md:block relative overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0uhKA12i1VBBewkDVpOhpTrZtcKmSw5e3bM3l-ebHzmXQKe7wqrWZvIK22ZkFe91flcj8nRpdKoPyZK9nhKcn7jq60xcnfBToT49YAB933Yc6tklwpbC6msoGnsVjq4n3DSf5NGY-xW3Q9HUlvIuroLeo3ZmCt4pR7yWdI82AKX2uRp1M3XH9mwENPkjgvgAMPNAFXVo5gcB-A-gkgB-lHe_cLGpfuWBnx5mI8-WTfaCPs8BFv5Ea1YXrQYp" 
            alt="Travel Destination" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-16 left-12 right-12 text-white">
            <div className="border-l-4 border-white/80 pl-6 py-2">
              <p className="text-sm font-bold text-white/90 mb-2 uppercase tracking-widest italic">Inspiration</p>
              <p className="text-2xl font-semibold leading-tight">"여행은 목적지에 닿는 것이 아니라, 새로운 눈을 갖는 것이다."</p>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 relative bg-white">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start mb-6">
                <img 
                  alt="떠먹트립 로고" 
                  className="h-40 md:h-48 w-auto object-contain mb-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h1 className="text-3xl font-extrabold text-black mb-3 tracking-tight">다시 만나서 반가워요!</h1>
              <p className="text-on-surface-variant font-medium">당신만의 특별한 여행이 기다리고 있습니다.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {localError && (
                <div id="login-error-alert" className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                  {localError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-black uppercase ml-1 tracking-wider">아이디</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-neutral-100 focus:ring-4 focus:ring-black/5 focus:border-black rounded-full py-4 pl-14 pr-6 transition-all outline-none font-medium placeholder:text-neutral-400" 
                    placeholder="example"
                    required
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-black uppercase ml-1 tracking-wider">비밀번호</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-neutral-100 focus:ring-4 focus:ring-black/5 focus:border-black rounded-full py-4 pl-14 pr-6 transition-all outline-none font-medium placeholder:text-neutral-400" 
                    placeholder="••••••••"
                    required
                    disabled={localLoading}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={localLoading}
                className="w-full bg-black text-white font-bold py-5 hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-6 rounded-full shadow-lg shadow-black/10 disabled:opacity-50"
              >
                {localLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>로그인</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-on-surface-variant text-sm font-medium mt-10">
              아직 회원이 아니신가요? 
              <button 
                onClick={() => navigate('/signup')}
                className="text-black font-extrabold border-b-2 border-black pb-0.5 ml-1 hover:text-neutral-600 transition-colors"
                disabled={localLoading}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
