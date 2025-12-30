import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode"; // Correct for v4

const AuthContext = createContext(null);

export function AuthProvider({ children }) { 
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;
  useEffect(() => {
    async function restoreAuth() {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        const decoded = jwtDecode(storedToken);
        // decoded = { id, role, iat, exp }

        setToken(storedToken);
        setRole(decoded.role);
        setUserId(decoded.id);
      } catch (err) {
        // token corrupted or expired
        await SecureStore.deleteItemAsync("authToken");
      } finally {
        setIsLoading(false);
      }
    }

    restoreAuth();
  }, []);

  async function login(tokenFromServer) {
    const decoded = jwtDecode(tokenFromServer);

    await SecureStore.setItemAsync("authToken", tokenFromServer);

    setToken(tokenFromServer);
    setRole(decoded.role);
    setUserId(decoded.id);
  }

  async function logout() {
    await SecureStore.deleteItemAsync("authToken");

    setToken(null);
    setRole(null);
    setUserId(null);
  }

  return (
//because the value prop is an object containing your state, 
// every time a state variable changes, the value object is technically a new object.
// When a Context Provider's value changes, React automatically notifies every single component that is using the useAuth() hook.
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
