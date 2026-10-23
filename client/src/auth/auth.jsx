import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "@/lib/api";

const AuthContext = React.createContext(null);

/** Menyimpan user login (dari GET /api/auth/me) untuk seluruh aplikasi. */
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const data = await api.get("/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (input) => {
    const data = await api.post("/auth/register", input);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  const value = { user, loading, refresh, login, register, logout, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}

/** Rute dashboard menurut peran. */
export const homeForRole = (role) =>
  role === "mentor" ? "/mentor/dashboard" : "/mahasiswa/dashboard";

/**
 * Pengganti proxy.ts. Dipakai sebagai layout route:
 *   <Route element={<ProtectedRoute role="mentor" />}> ... </Route>
 * Tanpa `role` → cukup login (checkout, konfirmasi).
 */
export function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) {
    const callback = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?callbackUrl=${callback}`} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }
  return <Outlet />;
}
