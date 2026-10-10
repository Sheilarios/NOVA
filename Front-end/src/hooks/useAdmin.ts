import { useAuth } from "../context/AuthContext";

export const useAdmin = () => {
  const { user, isAdmin, getUserRole, getAdminPermissions } = useAuth();

  // Detectar si es admin por email o role
  const checkIfAdmin = () => {
    if (!user) return false;
    
    const adminEmails = [
      "admin@nova.com",
      "manager@nova.com", 
      "soporte@nova.com",
      "contenido@nova.com"
    ];
    
    return adminEmails.includes(user.email) || 
           user.role === "admin" || 
           user.role === "superadmin" ||
           user.role === "manager" ||
           user.role === "support" ||
           user.role === "editor";
  };

  const userIsAdmin = isAdmin || checkIfAdmin();
  
  const hasPermission = (permission: string): boolean => {
    if (!userIsAdmin) return false;
    
    const permissions = getAdminPermissions();
    const adminUser = user as any;
    
    return permissions.includes("all") || 
           permissions.includes(permission) ||
           adminUser?.permisos?.includes("all") ||
           adminUser?.permisos?.includes(permission);
  };

  return {
    isAdmin: userIsAdmin,
    hasPermission,
    adminUser: userIsAdmin ? user : null,
    role: getUserRole(),
    permissions: getAdminPermissions()
  };
};