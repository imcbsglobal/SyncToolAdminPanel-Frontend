import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { authService } from "../services/authService";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  adminId?: number;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: (suppressLoading?: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Ref to ensure we only show the loading spinner on the first check
  const hasRunInitialCheck = useRef(false);

  useEffect(() => {
    // console.log("Auth state:", authState);
  }, [authState]);

  const checkAuth = async (suppressLoading = false): Promise<boolean> => {
    // Only set loading on the very first check
    if (!suppressLoading && !hasRunInitialCheck.current) {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const response = await authService.checkAuth();
      // console.log("Auth check response:", response);

      setAuthState({
        isAuthenticated: response.success,
        adminId: response.adminId,
        error: response.error || null,
        isLoading: false,
      });

      hasRunInitialCheck.current = true;
      return response.success;
    } catch (err: any) {
      console.error("Auth check error:", err);

      setAuthState({
        isAuthenticated: false,
        error: err.error || "Failed to verify authentication",
        isLoading: false,
      });

      hasRunInitialCheck.current = true;
      return false;
    }
  };

  useEffect(() => {
    // initial auth check, show spinner
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response);

      if (response.success) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          adminId: response.adminId,
        });
        return true;
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: response.error || "Invalid username or password",
        });
        return false;
      }
    } catch (err) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: "An unexpected error occurred",
      });
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authService.logout();

      if (response.success) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || "Logout failed",
        }));
        return false;
      }
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "An unexpected error occurred during logout",
      }));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
