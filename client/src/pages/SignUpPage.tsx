import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [tendency, setTendency] = useState<'egen' | 'teto'>('egen');

  // Input states
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [mbti, setMbti] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Error state messages
  const [nameError, setNameError] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [mbtiError, setMbtiError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Input Change Handlers with Validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val === '') {
      setNameError('');
    } else {
      const regExp = /^[가-힣]{1,7}$/;
      if (!regExp.test(val)) {
        setNameError('올바른 이름을 입력해주세요.');
      } else {
        setNameError('');
      }
    }
  };

  const idCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUserIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserId(val);

    // 기존 타이머 취소
    if (idCheckTimer.current) clearTimeout(idCheckTimer.current);

    if (val === '') {
      setUserIdError('');
      return;
    }

    const regExp = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,20}$/;
    if (!regExp.test(val)) {
      setUserIdError('아이디는 20자 이내 영문, 숫자, 특수문자만 입력 가능합니다.');
      return;
    }

    // 600ms 후에만 API 호출 (debounce)
    idCheckTimer.current = setTimeout(async () => {
      try {
        const exists = await authService.checkIdExists(val);
        setUserIdError(exists ? '해당 아이디는 이미 사용 중입니다.' : '');
      } catch {
        setUserIdError('');
      }
    }, 600);
  }, []);

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

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setBirthDate(val);
    if (val === '') {
      setBirthDateError('');
    } else if (val.length === 8) {
      if (!validateBirthDateString(val)) {
        setBirthDateError('정확한 생년월일을 입력하세요.');
      } else {
        setBirthDateError('');
      }
    } else {
      setBirthDateError('');
    }
  };

  const handleBirthDateBlur = () => {
    if (birthDate === '') return;
    if (!validateBirthDateString(birthDate)) {
      setBirthDateError('정확한 생년월일을 입력하세요.');
    } else {
      setBirthDateError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val === '') {
      setPasswordError('');
    } else {
      const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!regExp.test(val)) {
        setPasswordError('비밀번호는 8자 이상 영문+숫자+특수문자 조합이어야합니다.');
      } else {
        setPasswordError('');
      }
    }

    if (passwordConfirm !== '') {
      if (passwordConfirm !== val) {
        setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordConfirmError('');
      }
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasswordConfirm(val);
    if (val === '') {
      setPasswordConfirmError('');
    } else {
      if (val !== password) {
        setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordConfirmError('');
      }
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const isNameValid = /^[가-힣]{1,7}$/.test(name);
    let isUserIdValid = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,20}$/.test(userId);
    
    setSubmitting(true);
    let idExists = false;
    try {
      idExists = await authService.checkIdExists(userId);
    } catch {
      idExists = false;
    }

    if (idExists) {
      isUserIdValid = false;
      setUserIdError('해당 아이디는 이미 사용 중입니다.');
    }

    const isBirthDateValid = validateBirthDateString(birthDate);
    const VALID_MBTIS = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
                         'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
    const isMbtiValid = VALID_MBTIS.includes(mbti.toUpperCase());
    const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
    const isPasswordConfirmValid = passwordConfirm !== '' && password === passwordConfirm;

    if (!isNameValid) {
      setNameError('올바른 이름을 입력해주세요.');
    }
    if (!isUserIdValid && !idExists) {
      setUserIdError('아이디는 20자 이내 영문, 숫자, 특수문자만 입력 가능합니다.');
    }
    if (!isBirthDateValid) {
      setBirthDateError('정확한 생년월일을 입력하세요.');
    }
    if (!isMbtiValid) {
      setMbtiError('MBTI를 선택해주세요.');
    } else {
      setMbtiError('');
    }
    if (!isPasswordValid) {
      setPasswordError('비밀번호는 8자 이상 영문+숫자+특수문자 조합이어야합니다.');
    }
    if (!isPasswordConfirmValid) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    }

    if (isNameValid && isUserIdValid && isBirthDateValid && isMbtiValid && isPasswordValid && isPasswordConfirmValid) {
      try {
        await register({
          id: userId,
          name,
          gender: gender === 'male' ? '남성' : '여성',
          birthDate,
          mbti,
          tendency: tendency === 'egen' ? '에겐' : '테토',
          password
        });
        navigate('/travel-test');
      } catch (err: any) {
        setGeneralError(err.message || '회원가입에 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center overflow-x-hidden relative">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img alt="Breathtaking aerial view of an emerald green tropical beach" 
          className="w-full h-full object-cover" 
          src="https://tmt-gyeongju.s3.ap-northeast-2.amazonaws.com/basic/background.png" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Main Content Canvas */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[500px] px-6 py-12"
      >
        {/* Registration Card */}
        <div className="bg-white rounded-xl p-10 md:p-12 shadow-soft-brutal flex flex-col items-center">
          {/* Branding Section */}
          <div className="mb-10 text-center">
            <img alt="떠먹트립 로고" 
              className="w-auto mb-4 mx-auto h-40 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmBmFtxOuMxcNCgk0n24EUv046PekwC7l9lSJoUVfD7NUljHqpH4rheCbbUx3RzHcXqnSv3GBSuRcD42txCTiK-zAt19iloNphaUKXS2MDFi-XfcmDeDgfP-PXF5nYWy5gC6jtkTCP6U6_EjsbASwNbHKD7d17rBQLdruR8XvZ27qSDB5nTJfZ5gLmstCmcJWnQaCfGdAKiUNJGGTZ8Z9ABQdjP5hSlxT9QHor2m83JAf0suX8hjXMnm6dJZJaH4Nd_UC2qL5r9Q36" referrerPolicy="no-referrer" />
            <p className="text-secondary text-sm font-medium">당신만을 위한 고품격 여행 큐레이션</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleNext} className="w-full space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary ml-1 uppercase">이름</label>
              <input 
                className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium transition-all ${
                  nameError 
                    ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                    : 'border-transparent focus:border-primary text-on-surface'
                }`} 
                placeholder="홍길동" 
                type="text" 
                value={name}
                onChange={handleNameChange}
                required
              />
              {nameError && (
                <p className="text-xs font-bold text-red-500 ml-3 mt-1 animate-pulse">{nameError}</p>
              )}
            </div>

            {/* ID Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary ml-1 uppercase">아이디</label>
              <input 
                className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium transition-all ${
                  userIdError 
                    ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                    : 'border-transparent focus:border-primary text-on-surface'
                }`} 
                placeholder="example" 
                type="text" 
                value={userId}
                onChange={handleUserIdChange}
                required
              />
              {userIdError ? (
                <p className="text-xs font-bold text-red-500 ml-3 mt-1">{userIdError}</p>
              ) : userId && !userIdError ? (
                <p className="text-xs font-bold text-green-600 ml-3 mt-1">사용 가능한 아이디입니다. (중복 검사 완료) ✨</p>
              ) : null}
            </div>

            {/* Row for Gender and BirthDate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary ml-1 uppercase">성별</label>
                <div className="flex p-1 bg-surface-container-low rounded-full">
                  <button 
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 ${gender === 'male' ? 'bg-primary text-on-primary' : 'text-on-surface'}`} 
                    type="button" 
                    onClick={() => setGender('male')}
                  >
                    남성
                  </button>
                  <button 
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 ${gender === 'female' ? 'bg-primary text-on-primary' : 'text-on-surface'}`} 
                    type="button" 
                    onClick={() => setGender('female')}
                  >
                    여성
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary ml-1 uppercase">생년월일</label>
                <input 
                  className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium text-sm transition-all ${
                    birthDateError 
                      ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                      : 'border-transparent focus:border-primary text-on-surface'
                  }`} 
                  placeholder="예: 19900101" 
                  type="text" 
                  maxLength={8} 
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  onBlur={handleBirthDateBlur}
                  required
                />
              </div>
            </div>
            {birthDateError && (
              <p className="text-xs font-bold text-red-500 ml-3 mt-0.5">{birthDateError}</p>
            )}

            {/* Row for MBTI and Tendency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary ml-1 uppercase">MBTI</label>
                <select
                  className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium text-sm transition-all appearance-none ${
                    mbtiError ? 'border-red-500 text-red-900 bg-red-50/50' : 'border-transparent focus:border-primary'
                  }`}
                  value={mbti}
                  onChange={(e) => { setMbti(e.target.value); setMbtiError(''); }}
                >
                  <option disabled value="">선택</option>
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
                <label className="text-xs font-bold text-secondary ml-1 uppercase">성향</label>
                <div className="flex p-1 bg-surface-container-low rounded-full">
                  <button 
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 ${tendency === 'egen' ? 'bg-primary text-on-primary' : 'text-on-surface'}`} 
                    type="button" 
                    onClick={() => setTendency('egen')}
                  >
                    에겐
                  </button>
                  <button 
                    className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 ${tendency === 'teto' ? 'bg-primary text-on-primary' : 'text-on-surface'}`} 
                    type="button" 
                    onClick={() => setTendency('teto')}
                  >
                    테토
                  </button>
                </div>
              </div>
            </div>
            {mbtiError && (
              <p className="text-xs font-bold text-red-500 ml-3 mt-0.5">{mbtiError}</p>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary ml-1 uppercase">비밀번호</label>
              <input 
                className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium transition-all ${
                  passwordError 
                    ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                    : 'border-transparent focus:border-primary text-on-surface'
                }`} 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && (
                <p className="text-xs font-bold text-red-500 ml-3 mt-1">{passwordError}</p>
              )}
            </div>

             {/* Password Confirmation Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary ml-1 uppercase">비밀번호 확인</label>
              <input 
                className={`w-full px-6 py-4 bg-surface-container-low border focus:ring-0 rounded-full font-medium transition-all ${
                  passwordConfirmError 
                    ? 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/50' 
                    : 'border-transparent focus:border-primary text-on-surface'
                }`} 
                placeholder="••••••••" 
                type="password" 
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                required
              />
              {passwordConfirmError && (
                <p className="text-xs font-bold text-red-500 ml-3 mt-1">{passwordConfirmError}</p>
              )}
            </div>

            {generalError && (
              <div id="signup-error-alert" className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                {generalError}
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full mt-4 bg-primary text-on-primary py-5 px-8 rounded-full font-bold text-lg flex items-center justify-center group active:scale-95 transition-all duration-150 disabled:opacity-50" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-6 h-6 animate-spin text-on-primary" />
              ) : (
                <>
                  <span className="mr-2">다음으로</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform w-6 h-6" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-secondary">
              이미 계정이 있으신가요? 
              <button 
                onClick={() => navigate('/login')}
                className="text-primary font-bold ml-1 border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5 whitespace-nowrap"
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
