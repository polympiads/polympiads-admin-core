import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authUsersMeRetrieve, drfApiV1LoginCreate, type AuthGroupDetail, type AuthPermissionDetail, type AuthUserDetail } from "../client";

interface AuthContextType {
    user:    AuthUserDetail | null;
    loading: boolean;
    hasPerm: (permission: string) => boolean;
    login: (username: string, password: string) => Promise<LoginError | undefined>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface LoginError {
    username?: string[];
    password?: string[];

    non_field_errors?: string[];
};

export function hasPermission (user: AuthUserDetail | null, permission: string) {
    if (user === null) {
        return false;
    }
    if (user.is_superuser) {
        return true;
    }

    function isInPermissions (permissions: AuthPermissionDetail[]) {
        return permissions.find((perm) => perm.permission == permission) !== undefined;
    }
    function isInGroups (groups: AuthGroupDetail[]) {
        return groups.find((group) => isInPermissions(group.permissions)) !== undefined;
    }

    return isInGroups(user.groups) || isInPermissions(user.permissions);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser: () => Promise<LoginError | undefined> = async () => {
    const { data, error } = await authUsersMeRetrieve({});
    if (error || !data) { 
        logout();
        return { non_field_errors: [ "Network error: Couldn't fetch user information." ] };
    }
    if (!hasPermission(data, "polympiads_auth.access_dashboard")) {
        logout();
        return { non_field_errors: [ "Missing permissions to access CCS." ] };
    }

    setUser(data);
    return undefined;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    fetchCurrentUser().finally(() => setLoading(false));
  }, []);

  const hasPerm = (permission: string) => {
    return hasPermission(user, permission);
  };
  
  const login = async (username: string, password: string) => {
    setLoading(true);
    
    const {data, error} = await drfApiV1LoginCreate({
        body: { username: username, password: password } as any
    })

    if (error) {
        setLoading(false);
        return error;
    }

    localStorage.setItem('token', data!.token);

    return await fetchCurrentUser()
        .finally(() => setLoading(false));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasPerm, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}