import { useState, useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { FiSettings, FiUsers, FiPackage, FiBarChart2, FiShield, FiShoppingBag } from "react-icons/fi";

const AdminPanel = () => {
  const { isAdmin, adminUser, role } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {

    setStats({
      totalUsers: 1254,
      totalOrders: 589,
      totalProducts: 342,
      totalRevenue: 28950.75
    });
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <FiShield className="text-red-500 mx-auto text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">No tienes permisos de administrador</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Si eres administrador, asegúrate de haber iniciado sesión con:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• admin@nova.com</li>
              <li>• manager@nova.com</li>
              <li>• soporte@nova.com</li>
              <li>• contenido@nova.com</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">
                Bienvenido, <span className="font-semibold">{adminUser?.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <FiShield size={18} />
              <span className="font-bold">{role === "superadmin" ? "Super Administrador" : role}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FiUsers, label: "Usuarios Totales", value: stats.totalUsers, color: "blue" },
            { icon: FiShoppingBag, label: "Pedidos Totales", value: stats.totalOrders, color: "green" },
            { icon: FiPackage, label: "Productos", value: stats.totalProducts, color: "purple" },
            { icon: FiBarChart2, label: "Ingresos Totales", value: `S/. ${stats.totalRevenue.toFixed(2)}`, color: "yellow" },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {adminUser && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Tu Información de Administrador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{adminUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-semibold">
                  {role === "superadmin" ? "Super Administrador" : 
                   role === "manager" ? "Gerente de Tienda" :
                   role === "support" ? "Soporte Técnico" :
                   role === "editor" ? "Editor de Contenido" : 
                   "Administrador"}
                </p>
              </div>
              {adminUser.phone && (
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-semibold">{adminUser.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-semibold">
                  {new Date(adminUser.fechaCreacion).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Gestión de Usuarios", icon: FiUsers, items: ["Ver todos los usuarios", "Crear nuevo usuario", "Asignar permisos"] },
            { title: "Gestión de Productos", icon: FiPackage, items: ["Agregar producto", "Editar inventario", "Gestionar categorías"] },
            { title: "Configuración", icon: FiSettings, items: ["Configuración general", "Configuración de envíos", "Configuración de pagos"] },
          ].map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <section.icon /> {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors w-full text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Ver reportes completos
            </button>
            <button className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors">
              Exportar datos
            </button>
            <button className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Limpiar caché
            </button>
            <button className="px-6 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Generar backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;