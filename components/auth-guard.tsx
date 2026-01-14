"use client";

import type React from "react";

import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Idle timeout: 2 hours in milliseconds
  const IDLE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

  const checkAuth = useCallback(async () => {
    try {
      // Check authentication via server API (uses HTTP-only cookies)
      // Use cache: 'no-store' for real-time check, but allow fast response
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        // Try to refresh token if access token expired
        if (response.status === 401) {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (refreshResponse.ok) {
            // Retry auth check after refresh
            const retryResponse = await fetch("/api/auth/me", {
              credentials: "include",
            });

            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setUser(data.user);
              setIsAuthenticated(true);

              // Check role-based access
              if (requiredRoles && !requiredRoles.includes(data.user.role)) {
                router.push("/dashboard");
                return;
              }

              setIsLoading(false);
              return;
            }
          }
        }

        // Not authenticated, redirect to login
        router.push("/");
        return;
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);

        // Check role-based access
        if (requiredRoles && !requiredRoles.includes(data.user.role)) {
          router.push("/dashboard");
          return;
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [router, requiredRoles]);

  // Logout function for idle timeout
  const handleIdleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/");
    }
  }, [router]);

  // Idle timeout effect
  useEffect(() => {
    if (!isAuthenticated) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      // Clear existing timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      // Set new timer
      idleTimer = setTimeout(() => {
        console.log("Session expired due to inactivity");
        handleIdleLogout();
      }, IDLE_TIMEOUT);
    };

    // Activity events to track
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetIdleTimer);
    });

    // Start initial timer
    resetIdleTimer();

    // Cleanup
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [isAuthenticated, handleIdleLogout, IDLE_TIMEOUT]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Provide user context to children - prevents duplicate API calls
  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        isAdmin: user?.role === "admin",
        isAuthenticated,
        refetch: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Export a hook to get the current user - uses context instead of new API call
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // If used outside AuthGuard, fallback to API call
  const [fallbackUser, setFallbackUser] = useState<User | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(!context);

  useEffect(() => {
    if (context) return; // Already have context

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setFallbackUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setFallbackLoading(false);
      }
    }

    fetchUser();
  }, [context]);

  if (context) {
    return context;
  }

  return {
    user: fallbackUser,
    loading: fallbackLoading,
    isAdmin: fallbackUser?.role === "admin",
    isAuthenticated: !!fallbackUser,
    refetch: async () => {},
  };
}
