import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Search, Lock, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    gender: '남성',
    birthday: '',
    mbti: '',
    tendency: '에겐'
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Synchronize with logged-in user profile data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        gender: user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : user.gender || '남성',
        birthday: user.birthDate || '',
        mbti: user.mbti || '',
        tendency: user.tendency === 'egen' ? '에겐' : user.tendency === 'teto' ? '테토' : user.tendency || '에겐'
      });
    }
  }, [user]);

  const validateBirthDateString = (val: string) => {
    if (val.length !== 8) return false;
    const year = parseInt(val.substring(0, 4), 10);
    const month = parseInt(val.substring(4, 6), 10);
    const day = parseInt(val.substring(6, 8), 10);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (year < 1917 || year > currentYear) {
      return false;
    } else if (year === currentYear) {
      if (month > currentMonth || (month === currentMonth && day > currentDay)) {
        return false;
      }
    }

    if (month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      daysInMonth[1] = 29;
    }

    if (day < 1 || day > daysInMonth[month - 1]) {
      return false;
    }

    return true;
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, name: val }));
    if (val === '') {
      setNameError('');
    } else {
      const regExp = /^[가-힣]{1,7}$/;
      if (!regExp.test(val)) {
        setNameError('형식에 맞는 올바른 이름으로 수정해주세요.');
      } else {
        setNameError('');
      }
    }
  };

  const handleBirthdayChange = (val: string) => {
    const formatted = val.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, birthday: formatted }));
    if (formatted === '') {
      setBirthdayError('');
    } else if (formatted.length === 8) {
      if (!validateBirthDateString(formatted)) {
        setBirthdayError('정확한 생년월일을 입력하세요.');
      } else {
        setBirthdayError('');
      }
    } else {
      setBirthdayError('');
    }
  };

  const handleBirthdayBlur = () => {
    if (formData.birthday === '') return;
    if (!validateBirthDateString(formData.birthday)) {
      setBirthdayError('정확한 생년월일을 입력하세요.');
    } else {
      setBirthdayError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setGeneralError('');
    setSaveSuccess(false);

    const isNameValid = /^[가-힣]{1,7}$/.test(formData.name);
    if (!isNameValid) {
      setNameError('형식에 맞는 올바른 이름으로 수정해주세요.');
      return;
    }

    setSaving(true);
    try {
      const backendTendency = formData.tendency === '테토' ? 'teto' : 'egen';

      await updateProfile({
        name: formData.name,
        mbti: formData.mbti,
        tendency: backendTendency,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/mypage');
      }, 1500);
    } catch (err: any) {
      setGeneralError(err.message || '프로필 변경 도중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen overflow-x-hidden relative font-sans antialiased">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 h-20">
        <div className="flex justify-between items-center px-8 h-full max-w-[1100px] mx-auto w-full">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/main')}>
            <img alt="Tteomeok Trip Logo" 
              className="w-10 h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <span className="text-lg font-bold tracking-tight text-neutral-900">떠먹트립</span>
          </div>
          <div className="flex items-center gap-5 text-neutral-900">
            <Search className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity" />
            <User 
              className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity fill-current" 
              onClick={() => navigate('/mypage')}
            />
          </div>
        </div>
      </header>

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img alt="Background Beach" 
          className="w-full h-full object-cover opacity-30" 
          src="https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com/basic/background.png" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-white/40"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-10 md:p-12 shadow-soft-brutal w-full max-w-[500px]"
        >
          {/* Header Section */}
          <div className="relative flex items-center justify-center mb-10">
            <button 
              onClick={() => navigate('/mypage')}
              className="absolute left-0 p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-neutral-900" />
            </button>
            <h1 className="text-2xl font-black text-on-surface">프로필 수정</h1>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-neutral-100 flex items-center justify-center">
                <User className="w-16 h-16 text-neutral-400 fill-current" />
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">이름</label>
              <input 
                className={`w-full px-6 py-4 bg-neutral-50 border focus:ring-0 rounded-full font-bold transition-all ${
                  nameError 
                    ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                    : 'border-transparent focus:border-black text-on-surface'
                }`} 
                type="text" 
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
              {nameError && (
                <p className="text-xs font-bold text-red-500 ml-3 mt-1 animate-pulse">{nameError}</p>
              )}
            </div>

            {/* ID (Read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                아이디 <Lock className="w-3 h-3" />
              </label>
              <input
                className="w-full px-6 py-4 bg-neutral-100 text-neutral-400 border-transparent focus:ring-0 rounded-full font-bold cursor-not-allowed"
                readOnly
                type="text"
                value={user?.loginId || ''}
              />
            </div>

            {/* Row for Gender and Birthday — 변경 불가 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  성별 <Lock className="w-3 h-3" />
                </label>
                <div className="flex p-1 bg-neutral-100 rounded-full">
                  <div className={`flex-1 py-3 px-4 rounded-full text-sm font-bold text-center ${
                    formData.gender === '남성' ? 'bg-neutral-300 text-neutral-600' : 'text-neutral-400'
                  }`}>남성</div>
                  <div className={`flex-1 py-3 px-4 rounded-full text-sm font-bold text-center ${
                    formData.gender === '여성' ? 'bg-neutral-300 text-neutral-600' : 'text-neutral-400'
                  }`}>여성</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  생년월일 <Lock className="w-3 h-3" />
                </label>
                <input
                  className="w-full px-6 py-4 bg-neutral-100 text-neutral-400 border-transparent focus:ring-0 rounded-full font-bold cursor-not-allowed"
                  readOnly
                  type="text"
                  value={formData.birthday}
                />
              </div>
            </div>

            {/* Row for MBTI and Tendency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">MBTI</label>
                <select 
                  value={formData.mbti}
                  onChange={(e) => setFormData({...formData, mbti: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border-transparent focus:border-black focus:ring-0 rounded-full font-bold transition-all appearance-none"
                >
                  <option value="ISTJ">ISTJ</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="INFJ">INFJ</option>
                  <option value="INTJ">INTJ</option>
                  <option value="ISTP">ISTP</option>
                  <option value="ISFP">ISFP</option>
                  <option value="INFP">INFP</option>
                  <option value="INTP">INTP</option>
                  <option value="ESTP">ESTP</option>
                  <option value="ESFP">ESFP</option>
                  <option value="ENFP">ENFP</option>
                  <option value="ENTP">ENTP</option>
                  <option value="ESTJ">ESTJ</option>
                  <option value="ESFJ">ESFJ</option>
                  <option value="ENFJ">ENFJ</option>
                  <option value="ENTJ">ENTJ</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">성향</label>
                <div className="flex p-1 bg-neutral-50 rounded-full">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, tendency: '에겐'})}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-bold transition-all ${
                      formData.tendency === '에겐' ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'
                    }`}
                  >에겐</button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, tendency: '테토'})}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-bold transition-all ${
                      formData.tendency === '테토' ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'
                    }`}
                  >테토</button>
                </div>
              </div>
            </div>

            {/* Password (Read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                비밀번호 <Lock className="w-3 h-3" />
              </label>
              <input 
                className="w-full px-6 py-4 bg-neutral-100 text-neutral-400 border-transparent focus:ring-0 rounded-full font-bold cursor-not-allowed" 
                readOnly 
                type="password" 
                value="••••••••" 
              />
            </div>

            {generalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                {generalError}
              </div>
            )}

            {saveSuccess && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-xs font-bold text-green-700 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-700" />
                <span>프로필 정보가 성공적으로 업데이트되었습니다!</span>
              </div>
            )}

            {/* Save Button */}
            <button 
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-black text-white py-5 px-8 rounded-full font-black text-xl flex items-center justify-center group active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <span>저장하기</span>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white border-t border-neutral-100 rounded-t-3xl shadow-2xl">
        <button onClick={() => navigate('/main')} className="flex flex-col items-center justify-center text-neutral-400 px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-bold uppercase mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-neutral-400 px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[11px] font-bold uppercase mt-1">Discover</span>
        </button>
        <button className="flex flex-col items-center justify-center text-neutral-400 px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="text-[11px] font-bold uppercase mt-1">Saved</span>
        </button>
        <button onClick={() => navigate('/mypage')} className="flex flex-col items-center justify-center text-black bg-neutral-100 rounded-full px-6 py-2 transition-all active:scale-90">
          <User className="w-6 h-6 fill-current" />
          <span className="text-[11px] font-bold uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
