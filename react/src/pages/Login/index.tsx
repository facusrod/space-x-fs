import "./index.scss";
import { useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import { login } from "api/admin";

export const Login = () => {
  // 2
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const token = await login();
      setToken(`Bearer ${token}`);
    } catch (error) {
      console.error("Unable to login", error);
    }
  };

  return (
    <div className="login-page">
      <img
        src="https://www.deptagency.com/wp-content/themes/dept/public/logo-light-new.svg"
        alt="DEPT®"
        title="DEPT®"
      />
      <button onClick={handleLogin} className="glow-on-hover">
        LOG IN
      </button>
    </div>
  );
};
