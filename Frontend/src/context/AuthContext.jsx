import { createContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../features/auth/services/authApi";
import { getProfile } from "../features/User/services/userApi";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Clears the authentication state by removing the token from localStorage and resetting the token and user state.
  function clearAuthState() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }

  // Refreshes the user profile by fetching it from the server and updating the user state. It returns the updated profile.
  async function refreshUser() {
    const profile = await getProfile();
    setUser(profile);
    return profile;
  }

  
  async function login(email, password) {
    const data = await loginRequest(email, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    await refreshUser();
    return data;
  }

  async function register(userData) {
    return registerRequest(userData);
  }

  function logout() {
    clearAuthState();
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      if (!token) {
        if (isMounted) setIsBootstrapping(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        clearAuthState();
      } finally {
        if (isMounted) setIsBootstrapping(false);
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);


  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      isManager: user?.role === "manager",
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}