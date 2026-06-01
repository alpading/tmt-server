import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (id: string, pw?: string) => Promise<User>;
  register: (data: Omit<User, 'savedCoursesCount' | 'savedPlacesCount'> & { password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
  updateTendency: (answers: Record<number, number>, prefKeyMap?: Record<number, string>) => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load current user on initial session mount
  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch (err: any) {
        console.error('Failed to load session:', err);
        if (active) {
          setError(err.message || '세션을 불러오는 데 실패했습니다.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (id: string, pw?: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const authenticatedUser = await authService.login(id, pw);
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (err: any) {
      const errMsg = err.message || '로그인 중 오류가 발생했습니다.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    data: Omit<User, 'savedCoursesCount' | 'savedPlacesCount'> & { password?: string }
  ): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const registeredUser = await authService.register(data);
      setUser(registeredUser);
      return registeredUser;
    } catch (err: any) {
      const errMsg = err.message || '회원가입 중 오류가 발생했습니다.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User | null> => {
    if (!user) return null;
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errMsg = err.message || '프로필 정보 수정에 실패했습니다.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateTendency = async (answers: Record<number, number>, prefKeyMap?: Record<number, string>): Promise<User | null> => {
    if (!user) return null;
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateTravelTendency(user.id, answers, prefKeyMap);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errMsg = err.message || '여행 성향 정보를 저장하지 못했습니다.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updateTendency,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
