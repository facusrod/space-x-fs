import {
  useState,
  useEffect,
  createContext,
  SetStateAction,
  Dispatch,
  ReactElement,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "utils/axios";

interface AuthProviderValue {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthProviderValue>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
