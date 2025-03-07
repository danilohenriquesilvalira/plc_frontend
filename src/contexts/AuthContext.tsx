import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { LoginRequest, LoginResponse, login } from '../services/auth';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  token: string | null;
  loginUser: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = async (data: LoginRequest) => {
    console.log("loginUser chamado com:", data);
    try {
      const response = await login(data);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      console.log("loginUser executado com sucesso:", response);
    } catch (err) {
      console.error("Erro no loginUser:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};