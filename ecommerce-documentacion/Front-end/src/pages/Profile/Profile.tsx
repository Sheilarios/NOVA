import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiStar,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiEdit,
  FiCheck,
  FiX,
  FiList,
  FiLoader,
  FiImage,
  FiCreditCard,
  FiBell,
  FiShield,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit as FiEditIcon,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../hooks/useAdmin";
import userService from "../../../services/userService";
import { orderService } from "../../../services/orderService";

interface ProfileData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  avatar?: string;
  esPremium: boolean;
  fechaCreacion: string;
  role?: string;
  permisos?: string[];
}

interface EditProfileData {
  nombre: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  completedOrders: number;
  pendingOrders: number;
  favoriteItems: number;
  memberSince: string;
  loyaltyPoints?: number;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

interface RecentOrder {
  id: string;
  order_number: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, updateProfile, refreshUserData } = useAuth();
  const { isAdmin, role} = useAdmin();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({
    nombre: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    fechaNacimiento: "",
  });
  const [loading, setLoading] = useState({
    profile: true,
    stats: true,
    orders: true,
    wishlist: true,
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "addresses" | "settings"
  >("overview");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    promotions: true,
    orderUpdates: true,
    stockAlerts: false,
  });
  const isAdminUser = isAdmin && authUser;
  useEffect(() => {
  console.log("👤 authUser:", authUser);
  console.log("💾 localStorage:", JSON.parse(localStorage.getItem('nova_user') || '{}'));
    const loadUserData = async () => {
      if (!authUser) {
        navigate("/");
        return;
      }

      try {
        setLoading((prev) => ({
          ...prev,
          profile: true,
          stats: true,
          orders: true,
          wishlist: true,
        }));
        const savedUser = localStorage.getItem("nova_user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (isAdmin) {
            const adminData: ProfileData = {
              nombre: parsedUser.name || "",
              email: parsedUser.email || "",
              telefono: parsedUser.phone || "",
              direccion: parsedUser.address || "",
              fechaNacimiento: parsedUser.fechaNacimiento || "",
              avatar: parsedUser.avatar,
              esPremium: parsedUser.esPremium || false,
              fechaCreacion:
                parsedUser.fechaCreacion || new Date().toISOString(),
              role: parsedUser.role,
              permisos: parsedUser.permisos,
            };

            setUserData(adminData);
            setEditData({
              nombre: adminData.nombre,
              telefono: adminData.telefono,
              direccion: adminData.direccion,
              fechaNacimiento: adminData.fechaNacimiento,
            });

            setFormData({
              name: adminData.nombre,
              email: adminData.email,
              phone: adminData.telefono,
              address: adminData.direccion,
              fechaNacimiento: adminData.fechaNacimiento,
            });
          } else {
            try {
              if (authUser.id) {
                const profileResult = await userService.getProfile(authUser.id);
                if (profileResult.success && profileResult.data) {
                  const userProfile = profileResult.data;
                  const userDataFromApi: ProfileData = {
                    nombre: userProfile.name || "",
                    email: userProfile.email || "",
                    telefono: userProfile.phone || "",
                    direccion: userProfile.address || "",
                    fechaNacimiento: userProfile.birthDate || "",
                    avatar: userProfile.avatar,
                    esPremium: userProfile.esPremium || false,
                    fechaCreacion:
                      userProfile.fechaCreacion || new Date().toISOString(),
                  };

                  setUserData(userDataFromApi);
                  setEditData({
                    nombre: userDataFromApi.nombre,
                    telefono: userDataFromApi.telefono,
                    direccion: userDataFromApi.direccion,
                    fechaNacimiento: userDataFromApi.fechaNacimiento,
                  });

                  const statsResult = await userService.getUserStats(
                    authUser.id,
                  );
                  if (statsResult.success && statsResult.data) {
                    setUserStats(statsResult.data);
                  }

                  const ordersResult = await orderService.getOrders(
                    authUser.id,
                    {
                      limit: 3,
                    },
                  );
                  if (ordersResult.success && ordersResult.data) {
                    const formattedOrders = ordersResult.data
                      .slice(0, 3)
                      .map((order: any) => ({
                        id: order.id,
                        order_number:
                          order.order_number || `ORD-${order.id.slice(-6)}`,
                        date: order.created_at || order.date || "",
                        total: order.total_amount || order.total || 0,
                        status: order.status || "pending",
                        items: order.items?.length || 0,
                      }));
                    setRecentOrders(formattedOrders);
                  }

                  const wishlistResult = await userService.getWishlist(
                    authUser.id,
                  );
                  if (wishlistResult.success && wishlistResult.data) {
                    setWishlistItems(wishlistResult.data);
                  }
                }
              }
            } catch (apiError) {
              console.error("Error cargando datos de API:", apiError);
              const userDataFromStorage: ProfileData = {
                nombre: parsedUser.name || "",
                email: parsedUser.email || "",
                telefono: parsedUser.phone || "",
                direccion: parsedUser.address || "",
                fechaNacimiento: parsedUser.fechaNacimiento || "",
                esPremium: parsedUser.esPremium || false,
                fechaCreacion:
                  parsedUser.fechaCreacion || new Date().toISOString(),
              };

              setUserData(userDataFromStorage);
              setEditData({
                nombre: userDataFromStorage.nombre,
                telefono: userDataFromStorage.telefono,
                direccion: userDataFromStorage.direccion,
                fechaNacimiento: userDataFromStorage.fechaNacimiento,
              });
            }
          }
        } else {
          if (authUser) {
            const basicUserData: ProfileData = {
              nombre: authUser.name || "",
              email: authUser.email || "",
              telefono: authUser.phone || "",
              direccion: authUser.address || "",
              fechaNacimiento: authUser.fechaNacimiento || "",
              esPremium: authUser.esPremium || false,
              fechaCreacion: authUser.fechaCreacion || new Date().toISOString(),
              role: authUser.role,
              permisos: authUser.permisos,
            };

            setUserData(basicUserData);
            setEditData({
              nombre: basicUserData.nombre,
              telefono: basicUserData.telefono,
              direccion: basicUserData.direccion,
              fechaNacimiento: basicUserData.fechaNacimiento,
            });

            setFormData({
              name: basicUserData.nombre,
              email: basicUserData.email,
              phone: basicUserData.telefono,
              address: basicUserData.direccion,
              fechaNacimiento: basicUserData.fechaNacimiento,
            });
          }
        }
      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
        if (authUser) {
          const fallbackData: ProfileData = {
            nombre: authUser.name || "Usuario",
            email: authUser.email || "",
            telefono: authUser.phone || "",
            direccion: authUser.address || "",
            fechaNacimiento: authUser.fechaNacimiento || "",
            esPremium: authUser.esPremium || false,
            fechaCreacion: authUser.fechaCreacion || new Date().toISOString(),
            role: authUser.role,
            permisos: authUser.permisos,
          };

          setUserData(fallbackData);
          setEditData({
            nombre: fallbackData.nombre,
            telefono: fallbackData.telefono,
            direccion: fallbackData.direccion,
            fechaNacimiento: fallbackData.fechaNacimiento,
          });
        }
      } finally {
        setLoading((prev) => ({
          ...prev,
          profile: false,
          stats: false,
          orders: false,
          wishlist: false,
        }));
      }
    };

    loadUserData();
  }, [authUser, navigate, isAdmin]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser) return;

    const success = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      fechaNacimiento: formData.fechaNacimiento,
    });

    if (success) {
      setIsEditing(false);
      await refreshUserData();
      alert("Perfil actualizado exitosamente");
      if (userData) {
        setUserData({
          ...userData,
          nombre: formData.name,
          telefono: formData.phone,
          direccion: formData.address,
          fechaNacimiento: formData.fechaNacimiento,
        });
      }
    } else {
      alert("Error al actualizar el perfil");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveEdit = async () => {
    if (!authUser?.id || isAdmin) {
      const success = await updateProfile({
        name: editData.nombre,
        phone: editData.telefono,
        address: editData.direccion,
        fechaNacimiento: editData.fechaNacimiento,
      });

      if (success) {
        setUserData((prev) => (prev ? { ...prev, ...editData } : null));
        setIsEditing(false);
        await refreshUserData();
        alert("Datos actualizados correctamente");
      } else {
        alert("Error al actualizar los datos");
      }
      return;
    }

    try {
      const result = await userService.updateProfile(authUser.id, editData);

      if (result.success && result.data) {
        setUserData((prev) => (prev ? { ...prev, ...editData } : null));
        setIsEditing(false);
        await refreshUserData();
        alert("Datos actualizados correctamente");
      } else {
        alert(result.message || "Error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error guardando cambios:", error);
      alert("Error al guardar los cambios");
    }
  };

  const handleCancelEdit = () => {
    if (userData) {
      setEditData({
        nombre: userData.nombre,
        telefono: userData.telefono,
        direccion: userData.direccion,
        fechaNacimiento: userData.fechaNacimiento,
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !authUser?.id) return;

    setUploadingAvatar(true);
    try {
      const result = await userService.uploadAvatar(authUser.id, file);
      if (result.success && result.data) {
        setUserData((prev) =>
          prev ? { ...prev, avatar: result.data?.avatar_url } : null,
        );
        alert("Avatar actualizado correctamente");
      } else {
        alert(result.message || "Error al subir avatar");
      }
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleNotificationToggle = async (
    key: keyof typeof notificationPreferences,
  ) => {
    if (!authUser?.id) return;

    const newPreferences = {
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    };

    try {
      const result = await userService.updateNotificationPreferences(
        authUser.id,
        newPreferences,
      );
      if (result.success) {
        setNotificationPreferences(newPreferences);
      }
    } catch (error) {
      console.error("Error actualizando preferencias:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "processing":
        return <FiPackage className="text-blue-500" />;
      case "shipped":
        return <FiTruck className="text-purple-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-yellow-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `S/. ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";

      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  if (loading.profile && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[200px] lg:mt-[160px]">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[200px] lg:mt-[160px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No se encontraron datos del usuario
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 mt-[120px] lg:mt-[160px]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-black text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser size={40} className="text-white/70" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{userData.nombre}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm opacity-80">
                        {userData.email}
                      </span>
                      {isAdmin && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <FiShield size={12} />{" "}
                          {role === "superadmin"
                            ? "Super Administrador"
                            : role === "manager"
                              ? "Gerente de Tienda"
                              : role === "support"
                                ? "Soporte Técnico"
                                : role === "editor"
                                  ? "Editor de Contenido"
                                  : "Administrador"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiEditIcon /> {isEditing ? "Cancelar" : "Editar Perfil"}
                </button>
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiUser /> Nombre completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiMail /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled={!!isAdminUser}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiPhone /> Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiCalendar /> Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fechaNacimiento: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FiMapPin /> Dirección
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black h-32"
                    placeholder="Ingresa tu dirección completa"
                  />
                </div>

                {isAdmin && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FiShield /> Panel de Administración
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-blue-600">Rol asignado</p>
                        <p className="font-semibold text-blue-800">
                          {role === "superadmin"
                            ? "Super Administrador"
                            : role === "manager"
                              ? "Gerente de Tienda"
                              : role === "support"
                                ? "Soporte Técnico"
                                : role === "editor"
                                  ? "Editor de Contenido"
                                  : "Administrador"}
                        </p>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() => navigate("/admin")}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <FiShield /> Ir al Panel Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/admin/users")}
                          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Gestionar Usuarios
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[200px] lg:mt-[120px] pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-8">
          <div className="flex items-center gap-5">
            <div className="relative -mt-08 md:-mt-1">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <FiUser className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800"
              >
                {uploadingAvatar ? (
                  <FiLoader className="animate-spin" size={14} />
                ) : (
                  <FiImage size={14} />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                {userData.nombre}
              </h1>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full ${
                    userData.esPremium
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {userData.esPremium ? "PREMIUM" : "ESTÁNDAR"}
                </span>
                {isAdmin && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FiShield size={12} />{" "}
                    {role === "superadmin"
                      ? "Super Administrador"
                      : role === "manager"
                        ? "Gerente de Tienda"
                        : role === "support"
                          ? "Soporte Técnico"
                          : role === "editor"
                            ? "Editor de Contenido"
                            : "Administrador"}
                  </span>
                )}
                {userStats?.tier && (
                  <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                    {userStats.tier.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium rounded-lg"
              >
                <FiEditIcon /> Editar Perfil Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-200 hover:bg-red-50 transition-colors text-sm font-medium rounded-lg"
            >
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Resumen", icon: <FiUser /> },
            { id: "orders", label: "Pedidos", icon: <FiShoppingBag /> },
            { id: "wishlist", label: "Wishlist", icon: <FiHeart /> },
            { id: "addresses", label: "Direcciones", icon: <FiHome /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } rounded-lg`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className={`lg:col-span-${activeTab === "overview" ? "2" : "3"} space-y-6`}
          >
            {activeTab === "overview" && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FiUser /> Información Personal
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg"
                      >
                        <FiEdit size={14} /> Editar
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
                        >
                          <FiCheck size={14} /> Guardar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg"
                        >
                          <FiX size={14} /> Cancelar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 font-medium">
                          Nombre
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.nombre}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                nombre: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="text-lg">{userData.nombre}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 font-medium">
                          Email
                        </label>
                        <p className="text-gray-700">{userData.email}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 font-medium">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.telefono}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                telefono: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-black"
                            placeholder="+51 XXX XXX XXX"
                          />
                        ) : (
                          <p className="text-gray-700">
                            {userData.telefono || "No especificado"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 font-medium">
                          Fecha de nacimiento
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData.fechaNacimiento}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                fechaNacimiento: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="text-gray-700">
                            {formatDate(userData.fechaNacimiento)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 font-medium">
                        Dirección
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.direccion}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              direccion: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-black"
                          rows={2}
                          placeholder="Calle, número, ciudad, código postal"
                        />
                      ) : (
                        <p className="text-gray-700">
                          {userData.direccion || "No especificada"}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <label className="text-sm text-gray-500 font-medium">
                        Miembro desde
                      </label>
                      <p className="text-gray-700">
                        {formatDate(userData.fechaCreacion)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FiShoppingBag /> Pedidos Recientes
                    </h2>
                    <button
                      onClick={() => navigate("/orders")}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todos
                    </button>
                  </div>

                  {loading.orders ? (
                    <div className="text-center py-8">
                      <FiLoader className="animate-spin mx-auto mb-2" />
                      <p className="text-gray-500">Cargando pedidos...</p>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="font-medium">
                                  Orden #{order.order_number}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {formatCurrency(order.total)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.items} productos
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                            <button
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver detalles →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">
                        Aún no has realizado ningún pedido
                      </p>
                      <button
                        onClick={() => navigate("/collection")}
                        className="px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                      >
                        Comenzar a comprar
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Todos mis pedidos
                </h2>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Para ver el historial completo de pedidos
                  </p>
                  <button
                    onClick={() => navigate("/orders")}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Ver historial de pedidos
                  </button>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiHeart className="text-red-500" /> Mi Wishlist
                </h2>

                {loading.wishlist ? (
                  <div className="text-center py-8">
                    <FiLoader className="animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Cargando wishlist...</p>
                  </div>
                ) : wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/product/${item.product_id}`)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/300x300?text=Producto";
                            }}
                          />
                        </div>
                        <h3 className="font-medium text-sm mb-1">
                          {item.product_name}
                        </h3>
                        <p className="text-gray-600 font-bold">
                          S/. {item.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Agregado: {formatDate(item.added_at)}
                        </p>
                        <button
                          className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FiTrash2 size={12} /> Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHeart className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Aún no tienes productos en wishlist
                    </p>
                    <button
                      onClick={() => navigate("/collection")}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Explorar productos
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Configuración</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FiBell /> Notificaciones
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: "email",
                        label: "Notificaciones por email",
                        desc: "Recibir actualizaciones importantes",
                      },
                      {
                        key: "promotions",
                        label: "Promociones y ofertas",
                        desc: "Descuentos exclusivos y novedades",
                      },
                      {
                        key: "orderUpdates",
                        label: "Actualizaciones de pedidos",
                        desc: "Estado de envío y entrega",
                      },
                      {
                        key: "stockAlerts",
                        label: "Alertas de stock",
                        desc: "Cuando un producto vuelva a estar disponible",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            handleNotificationToggle(item.key as any)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            notificationPreferences[
                              item.key as keyof typeof notificationPreferences
                            ]
                              ? "bg-black"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              notificationPreferences[
                                item.key as keyof typeof notificationPreferences
                              ]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FiShield /> Seguridad
                  </h3>
                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">Cambiar contraseña</p>
                      <p className="text-sm text-gray-500">
                        Actualiza tu contraseña periódicamente
                      </p>
                    </div>
                    <FiCreditCard />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Newsletter</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">Suscripción a newsletter</p>
                      <p className="text-sm text-gray-500">
                        Recibe nuestras últimas noticias y ofertas
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">
                      Suscribirse
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Mi Actividad</h3>

                {loading.stats ? (
                  <div className="text-center py-4">
                    <FiLoader className="animate-spin mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Cargando estadísticas...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      onClick={() => navigate("/orders")}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FiShoppingBag className="text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Pedidos</div>
                          <div className="text-sm text-gray-500">
                            Total realizados
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {userStats?.totalOrders || 0}
                      </div>
                    </div>

                    <div
                      onClick={() => navigate("/wishlist")}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiHeart className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Wishlist</div>
                          <div className="text-sm text-gray-500">
                            Productos guardados
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {userStats?.favoriteItems || 0}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <FiStar className="text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium">Gasto total</div>
                          <div className="text-sm text-gray-500">
                            En todas tus compras
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {formatCurrency(userStats?.totalSpent || 0)}
                      </div>
                    </div>

                    {userStats?.loyaltyPoints && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FiStar className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Puntos de lealtad</div>
                            <div className="text-sm text-gray-500">
                              Acumulados
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {userStats.loyaltyPoints}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-black text-white rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/collection")}
                    className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Continuar comprando
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Ver carrito</span>
                    <FiShoppingBag />
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Historial de pedidos</span>
                    <FiList />
                  </button>
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Ver mi Wishlist</span>
                    <FiHeart />
                  </button>
                </div>
              </div>

              {!userData.esPremium && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Desbloquea beneficios Premium
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Envío gratis, descuentos exclusivos y atención prioritaria
                  </p>
                  <button
                    onClick={() => {}}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
                  >
                    Upgrade a Premium
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
