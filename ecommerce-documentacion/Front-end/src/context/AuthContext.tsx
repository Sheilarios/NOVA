import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../../services/authService";
import userService from "../../services/userService";
import type { User as UserType } from "../types/user";
import type { Order } from "../types/order";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  fechaNacimiento?: string;
  esPremium?: boolean;
  fechaCreacion: string;
  pedidos?: Order[];
  favoritos?: string[];
  guest?: boolean;
  avatar?: string;
  role?: "admin" | "superadmin" | "manager" | "support" | "editor" | "user";
  permisos?: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
  guest?: boolean;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  fechaNacimiento?: string;
}

// Interfaz para la respuesta del login social
interface SocialLoginResult {
  success: boolean;
  message?: string;
  user?: any;
}

interface AuthContextType {
  user: User | null;
  login: (
    credentials: LoginCredentials | { guest: boolean },
  ) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterCredentials) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  socialLogin: (provider: string, token: string) => Promise<SocialLoginResult>;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  refreshUserData: () => Promise<void>;
  isAdmin: boolean;
  getUserRole: () => string | null;
  getAdminPermissions: () => string[];
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: boolean;
}

const ADMIN_USERS = [
  {
    id: "admin-001",
    email: "admin@nova.com",
    password: "NovaAdmin2025!",
    name: "Administrador Principal",
    role: "superadmin",
    permisos: ["all"],
    esPremium: true,
    telefono: "+51 999 999 999",
    direccion: "Oficina Principal Nova",
    fechaNacimiento: "1990-01-01",
    avatar: "https://via.placeholder.com/150/007bff/ffffff?text=ADMIN",
    fechaCreacion: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "manager-001",
    email: "manager@nova.com",
    password: "NovaManager2025!",
    name: "Gerente de Tienda",
    role: "manager",
    permisos: ["products", "orders", "users_view", "analytics"],
    esPremium: true,
    telefono: "+51 988 888 888",
    direccion: "Sucursal Principal",
    fechaNacimiento: "1992-05-15",
    avatar: "https://via.placeholder.com/150/28a745/ffffff?text=MANAGER",
    fechaCreacion: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "support-001",
    email: "soporte@nova.com",
    password: "NovaSoporte2025!",
    name: "Soporte Técnico",
    role: "support",
    permisos: ["users_view", "orders_view", "tickets"],
    esPremium: false,
    telefono: "+51 977 777 777",
    direccion: "Centro de Soporte",
    fechaNacimiento: "1995-08-20",
    avatar: "https://via.placeholder.com/150/6f42c1/ffffff?text=SUPPORT",
    fechaCreacion: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "content-001",
    email: "contenido@nova.com",
    password: "NovaContenido2025!",
    name: "Editor de Contenido",
    role: "editor",
    permisos: ["products", "categories", "content"],
    esPremium: true,
    telefono: "+51 966 666 666",
    direccion: "Departamento de Marketing",
    fechaNacimiento: "1993-03-10",
    avatar: "https://via.placeholder.com/150/f39c12/ffffff?text=EDITOR",
    fechaCreacion: "2024-01-01T00:00:00.000Z",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const findAdminByEmail = (email: string) => {
    return ADMIN_USERS.find((admin) => admin.email === email);
  };
  
  const convertToUser = (apiUser: UserType): User => {
    return {
      id: apiUser.id,
      name: apiUser.nombre || "",
      email: apiUser.email,
      phone: apiUser.phone,
      address: apiUser.address,
      fechaNacimiento: apiUser.birthDate,
      esPremium: apiUser.esPremium,
      fechaCreacion: apiUser.fechaCreacion,
      pedidos: apiUser.pedidos,
      favoritos: apiUser.favoritos,
      guest: apiUser.guest,
      avatar: apiUser.avatar,
      role: apiUser.role,
      permisos: apiUser.permisos,
    };
  };
  
  const handleSuccessfulLogin = (authToken: string, userData: UserType) => {
  // userData viene del backend con { id, name, email, created_at }
  const userObj: User = {
    id: userData.id,
    name: userData.nombre || userData.nombre || "",  // Intenta name primero
    email: userData.email,
    phone: userData.phone || userData.phone || "",
    address: userData.address || userData.address || "",
    fechaNacimiento: userData.birthDate || userData.birthDate || "",
    esPremium: userData.esPremium || false,
    fechaCreacion: userData.fechaCreacion || new Date().toISOString(),
    pedidos: userData.pedidos || [],
    favoritos: userData.favoritos || [],
    guest: userData.guest || false,
    avatar: userData.avatar,
    role: userData.role,
    permisos: userData.permisos,
  };
  
  setToken(authToken);
  setUser(userObj);
  localStorage.setItem("nova_token", authToken);
  localStorage.setItem("nova_user", JSON.stringify(userObj));

    const adminUser = findAdminByEmail(userObj.email);
    const userIsAdmin = (userObj.role === "admin" || userObj.role === "superadmin" || userObj.role === "manager" || adminUser !== undefined) as boolean;

    if (userIsAdmin) {
      setIsAdmin(true);
      setIsSuperAdmin((userData.role === "superadmin" as any) || adminUser?.role === "superadmin");
      localStorage.setItem("nova_admin", "true");
      localStorage.setItem("nova_admin_role", adminUser?.role || userData.role || "admin");
    }

    return true;
  };

  const handleAdminLogin = (adminUserData: (typeof ADMIN_USERS)[0]) => {
    const { password, ...userWithoutPassword } = adminUserData;

    const userObj: User = {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      phone: userWithoutPassword.telefono,
      address: userWithoutPassword.direccion,
      fechaNacimiento: userWithoutPassword.fechaNacimiento,
      esPremium: userWithoutPassword.esPremium,
      fechaCreacion: userWithoutPassword.fechaCreacion,
      avatar: userWithoutPassword.avatar,
      role: userWithoutPassword.role as "superadmin" | "manager" | "support" | "editor" | "admin" | "user",
      permisos: userWithoutPassword.permisos,
    };

    setUser(userObj);

    const adminToken = `${adminUserData.role}_token_${Date.now()}`;
    setToken(adminToken);

    const isSuperAdmin = adminUserData.role === "superadmin";
    setIsAdmin(true);
    setIsSuperAdmin(isSuperAdmin);

    localStorage.setItem("nova_token", adminToken);
    localStorage.setItem("nova_user", JSON.stringify(userObj));
    localStorage.setItem("nova_session_active", "true");
    localStorage.setItem("nova_admin", "true");
    localStorage.setItem("nova_admin_role", adminUserData.role);

    console.log(`${adminUserData.name} autenticado exitosamente`);
    return true;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("nova_token");
        const savedUser = localStorage.getItem("nova_user");
        const sessionActive =
          localStorage.getItem("nova_session_active") === "true";
        const isAdminSaved = localStorage.getItem("nova_admin") === "true";
        const adminRole = localStorage.getItem("nova_admin_role");

        if (savedToken && savedUser && sessionActive) {
          const validation = await authService.validateToken();

          if (validation.valid && validation.user) {
            setToken(savedToken);
            const userObj = convertToUser(validation.user);
            setUser(userObj);

            const adminUser = findAdminByEmail(userObj.email);
            const userIsAdmin = isAdminSaved || adminUser !== undefined;
            const userIsSuperAdmin =
              adminRole === "superadmin" || adminUser?.role === "superadmin";

            setIsAdmin(userIsAdmin);
            setIsSuperAdmin(userIsSuperAdmin);

            if (userIsAdmin) {
              localStorage.setItem("nova_admin", "true");
              localStorage.setItem(
                "nova_admin_role",
                adminUser?.role || adminRole || "admin",
              );
            }
          } else {
            clearAuthData();
          }
        } else if (savedUser && sessionActive) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          const adminUser = findAdminByEmail(userData.email);
          const userIsAdmin = isAdminSaved || adminUser !== undefined;
          const userIsSuperAdmin =
            adminRole === "superadmin" || adminUser?.role === "superadmin";

          setIsAdmin(userIsAdmin);
          setIsSuperAdmin(userIsSuperAdmin);
        } else if (localStorage.getItem("nova_auth_skipped") === "true") {
          const guestUser = authService.guestLogin();
          const convertedGuestUser = convertToUser(guestUser);
          setUser(convertedGuestUser);
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error("Error al inicializar autenticación:", error);
        try {
          const savedUser = localStorage.getItem("nova_user");
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);

            const adminUser = findAdminByEmail(userData.email);
            const userIsAdmin = adminUser !== undefined;
            const userIsSuperAdmin = adminUser?.role === "superadmin";

            setIsAdmin(userIsAdmin);
            setIsSuperAdmin(userIsSuperAdmin);
          }
        } catch (e) {
          console.error("Error en fallback:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    localStorage.removeItem("nova_token");
    localStorage.removeItem("nova_user");
    localStorage.removeItem("nova_session_active");
    localStorage.removeItem("nova_session");
    localStorage.removeItem("nova_auth_skipped");
    localStorage.removeItem("nova_admin");
    localStorage.removeItem("nova_admin_role");
  };

  const login = async (
    credentials: LoginCredentials | { guest: boolean },
  ): Promise<boolean> => {
    try {
      setLoading(true);

      if ("guest" in credentials && credentials.guest) {
        const guestUser = authService.guestLogin();
        const convertedGuestUser = convertToUser(guestUser);
        setUser(convertedGuestUser);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        localStorage.setItem("nova_auth_skipped", "true");
        return true;
      }

      const loginCredentials = credentials as LoginCredentials;

      const adminUser = findAdminByEmail(loginCredentials.email);
      if (adminUser && adminUser.password === loginCredentials.password) {
        return handleAdminLogin(adminUser);
      }

      const result = await authService.login({
        email: loginCredentials.email,
        password: loginCredentials.password,
      });

      if (result.success && result.token && result.user) {
        return handleSuccessfulLogin(result.token, result.user);
      } else {
        console.error("Error en login:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==============================================
  // NUEVA FUNCIÓN PARA LOGIN SOCIAL (AGREGADA)
  // ==============================================
  const socialLogin = async (provider: string, token: string): Promise<SocialLoginResult> => {
    try {
      setLoading(true);
      
      // Llamar al servicio de autenticación social
      const result = await authService.socialLogin({
        provider: provider as 'google' | 'facebook',
        token: token,
        email: '', // Estos se obtendrán del token en el backend
        name: ''
      });
      
      if (result.success && result.token && result.user) {
        handleSuccessfulLogin(result.token, result.user);
        return { 
          success: true, 
          user: result.user 
        };
      } else {
        return { 
          success: false, 
          message: result.message || `Error en login con ${provider}` 
        };
      }
    } catch (error: any) {
      console.error(`Error en login social con ${provider}:`, error);
      return { 
        success: false, 
        message: error.message || `Error al conectar con ${provider}` 
      };
    } finally {
      setLoading(false);
    }
  };

 const register = async (userData: RegisterCredentials): Promise<boolean> => {
  try {
    setLoading(true);
    console.log("AuthContext register - userData:", userData); // ← AGREGAR

    const adminUser = findAdminByEmail(userData.email);
    if (adminUser) {
      console.error("Este email está reservado para administración");
      return false;
    }

    const result = await authService.register({
      nombre: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      telefono: userData.phone || "",
      direccion: userData.address || "",
      fechaNacimiento: userData.fechaNacimiento || "",
    });

    console.log("AuthContext register - result:", result); // ← AGREGAR

    if (result.success && result.token && result.user) {
      return handleSuccessfulLogin(result.token, result.user);
    } else {
      console.error("Error en registro:", result.message);
      return false;
    }
  } catch (error) {
    console.error("Error en registro:", error);
    return false;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    authService.logout();
    clearAuthData();
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const adminUser = findAdminByEmail(user.email);
    if (userData.role === "admin" && !adminUser) {
      console.error("No tienes permisos para cambiar el rol a administrador");
      return false;
    }

    if (adminUser && userData.email && userData.email !== adminUser.email) {
      console.error("No se puede modificar el email del administrador");
      return false;
    }

    try {
      setLoading(true);

      const updateData: any = {};
      if (userData.name !== undefined) updateData.nombre = userData.name;
      if (userData.phone !== undefined) updateData.telefono = userData.phone;
      if (userData.address !== undefined)
        updateData.direccion = userData.address;
      if (userData.fechaNacimiento !== undefined)
        updateData.fechaNacimiento = userData.fechaNacimiento;
      if (userData.avatar !== undefined) updateData.avatar = userData.avatar;

      if (!adminUser) {
        const result = await userService.updateProfile(user.id, updateData);

        if (result.success && result.data) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);

          if (userData.role !== undefined) {
            const newAdminStatus = userData.role === "admin";
            setIsAdmin(newAdminStatus);
            setIsSuperAdmin(userData.role === "superadmin");

            if (newAdminStatus) {
              localStorage.setItem("nova_admin", "true");
              localStorage.setItem("nova_admin_role", userData.role);
            } else {
              localStorage.removeItem("nova_admin");
              localStorage.removeItem("nova_admin_role");
            }
          }

          localStorage.setItem("nova_user", JSON.stringify(updatedUser));
          return true;
        } else {
          console.error("Error al actualizar perfil:", result.message);
          return false;
        }
      } else {
        const updatedUser = {
          ...user,
          name: userData.name || user.name,
          phone: userData.phone !== undefined ? userData.phone : user.phone,
          address:
            userData.address !== undefined ? userData.address : user.address,
          fechaNacimiento:
            userData.fechaNacimiento !== undefined
              ? userData.fechaNacimiento
              : user.fechaNacimiento,
          avatar: userData.avatar !== undefined ? userData.avatar : user.avatar,
        };

        setUser(updatedUser);
        localStorage.setItem("nova_user", JSON.stringify(updatedUser));
        return true;
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!user?.id) return;

    const adminUser = findAdminByEmail(user.email);
    if (adminUser) {
      return;
    }

    try {
      const profileResult = await userService.getProfile(user.id);
      if (profileResult.success && profileResult.data) {
        const updatedUser = convertToUser(profileResult.data);
        setUser(updatedUser);

        const userIsAdmin =
          updatedUser.role === "admin" || updatedUser.role === "superadmin";
        setIsAdmin(userIsAdmin);
        setIsSuperAdmin(updatedUser.role === "superadmin");

        if (userIsAdmin) {
          localStorage.setItem("nova_admin", "true");
          localStorage.setItem("nova_admin_role", updatedUser.role || "admin");
        } else {
          localStorage.removeItem("nova_admin");
          localStorage.removeItem("nova_admin_role");
        }

        localStorage.setItem("nova_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error al refrescar datos:", error);
    }
  };

  const getUserRole = (): string | null => {
    if (!user?.email) return null;
    const adminUser = findAdminByEmail(user.email);
    return adminUser ? adminUser.role : user.role || null;
  };

  const getAdminPermissions = (): string[] => {
    if (!user?.email) return [];
    const adminUser = findAdminByEmail(user.email);
    return adminUser ? adminUser.permisos : user.permisos || [];
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.email) return false;
    const adminUser = findAdminByEmail(user.email);
    const permissions = adminUser ? adminUser.permisos : user.permisos || [];

    return permissions.includes("all") || permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    updateProfile,
    socialLogin, // <-- AÑADIDO AQUÍ
    isAuthenticated: !!user,
    loading,
    token,
    refreshUserData,
    isAdmin,
    getUserRole,
    getAdminPermissions,
    hasPermission,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};