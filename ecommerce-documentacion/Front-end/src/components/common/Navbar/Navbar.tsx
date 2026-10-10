import {
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiGlobe,
  FiX,
  FiLoader,
  FiArrowLeft,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useLocale } from "../../../context/LocaleContext";
import { useAuth } from "../../../context/AuthContext";
import { products } from "../../../data/products";
import { translations } from "../../../data/translations";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, updateLocale } = useLocale();
  const {
    user,
    login: authLogin,
    register: authRegister,
    logout,
    isAuthenticated,
  } = useAuth();
  const isLibroPage = location.pathname === "/libro-de-reclamaciones";
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const categories = t?.categories ?? {};
  const womenCategories = (categories as any).women ?? {};
  const menCategories = (categories as any).men ?? {};
  const eventsCategories = (categories as any).events ?? {};
  const collectionCategories = (categories as any).collection ?? {};
  const search = t?.search ?? {};
  const searchStyles = (search as any).styles ?? [
    "STREETWEAR",
    "FORMAL",
    "URBANA",
    "MINIMAL",
  ];
  const locationT = t?.location ?? {};
  const login = (t as any).login ?? {};
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [navLoading] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">(
    "login",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [tempCountry, setTempCountry] = useState("pe");
  const [tempLanguage, setTempLanguage] = useState("es");
  const [tempCurrency, setTempCurrency] = useState("pen");
  const { cartItems } = useCart();
  const { wishlistItems = [] } = useWishlist() as unknown as {
    wishlistItems: any[];
  };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (locale) {
      setTempCountry(locale.country || "pe");
      setTempLanguage(locale.language || "es");
      if (locale.currency?.includes("PEN")) {
        setTempCurrency("pen");
      } else if (locale.currency?.includes("EUR")) {
        setTempCurrency("eur");
      } else if (locale.currency?.includes("USD")) {
        setTempCurrency("usd");
      } else {
        setTempCurrency("pen");
      }
    }
  }, [locale]);

  const getFilteredAndSortedProducts = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();

    return products
      .filter((product) => {
        const cleanName = product.name
          .replace("HOMBRE_", "")
          .replace("MUJER_", "")
          .replace(/_/g, " ")
          .toLowerCase();

        return cleanName.includes(query);
      })
      .sort((a, b) => {
        const cleanNameA = a.name
          .replace("HOMBRE_", "")
          .replace("MUJER_", "")
          .replace(/_/g, " ")
          .toLowerCase();

        const cleanNameB = b.name
          .replace("HOMBRE_", "")
          .replace("MUJER_", "")
          .replace(/_/g, " ")
          .toLowerCase();

        const aStartsWithQuery = cleanNameA.startsWith(query);
        const bStartsWithQuery = cleanNameB.startsWith(query);
        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (!aStartsWithQuery && bStartsWithQuery) return 1;
        return cleanNameA.localeCompare(cleanNameB);
      });
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const menuData: Record<string, any> = {
    SALES: {
      path: "/sales",
      label: t?.menu?.sales || "SALES",
    },
    WOMEN: {
      path: "/women",
      label: t?.menu?.women || "WOMEN",
      categories: [
        {
          name: womenCategories.tops || "Polos y Tops",
          id: "MUJER_POLOS_Y_TOPS",
        },
        { name: womenCategories.pants || "Pantalones", id: "MUJER_PANTALONES" },
        { name: womenCategories.dresses || "Vestidos", id: "MUJER_VESTIDOS" },
        {
          name: womenCategories.blazers || "Blazers y chalecos",
          id: "MUJER_BLAZERS",
        },
      ],
      images: [
        {
          url: "https://hmperu.vtexassets.com/arquivos/ids/5665022/Chaleco-largo---Beige-claro-Estampado-de-cebra---H-M-PE.jpg?v=638854067345830000",
          label: (womenCategories.tops || "Polos y Tops").toUpperCase(),
          categoryId: "MUJER_POLOS_Y_TOPS",
        },
        {
          url: "https://image.hm.com/assets/hm/ce/05/ce059d2a9c2fbbac82abeca7d0ae8be774295b68.jpg",
          label: (womenCategories.pants || "Pantalones").toUpperCase(),
          categoryId: "MUJER_PANTALONES",
        },
        {
          url: "https://etceterabridal.co.nz/wp-content/uploads/2022/10/faye-1.jpg",
          label: (womenCategories.dresses || "Vestidos").toUpperCase(),
          categoryId: "MUJER_VESTIDOS",
        },
      ],
    },
    MEN: {
      path: "/men",
      label: t?.menu?.men || "MEN",
      categories: [
        { name: menCategories.pants || "pantalones", id: "HOMBRE_PANTALONES" },
        {
          name: menCategories.shirts || "polos y camisas",
          id: "HOMBRE_POLOS_CAMISAS",
        },
        { name: menCategories.suits || "suits", id: "HOMBRE_SUIT" },
        { name: menCategories.jackets || "casacas", id: "HOMBRE_CASACAS" },
      ],
      images: [
        {
          url: "https://images.pexels.com/photos/34769611/pexels-photo-34769611/free-photo-of-dynamic-fashion-portrait-in-black-and-white.jpeg",
          label: (menCategories.pants || "pantalones").toUpperCase(),
          categoryId: "HOMBRE_PANTALONES",
        },
        {
          url: "https://maisondepeter.com/cdn/shop/collections/Firefly_Men_model_wearblack_oversized_T_shirt_white_back_gound_62873.jpg?v=1744478914&width=1500",
          label: (menCategories.shirts || "polos y camisas").toUpperCase(),
          categoryId: "HOMBRE_POLOS_CAMISAS",
        },
        {
          url: "https://i.pinimg.com/736x/57/f6/88/57f6882f4304ce42462db74a637bee11.jpg",
          label: (menCategories.suits || "suits").toUpperCase(),
          categoryId: "HOMBRE_SUIT",
        },
      ],
    },
    EVENTS: {
      path: "/events",
      label: t?.menu?.events || "EVENTS",
      categories: [
        {
          name: eventsCategories.weddingGuest || "INVITADA DE BODA",
          id: "INVITADA DE BODA",
        },
        { name: eventsCategories.brides || "NOVIAS", id: "NOVIAS" },
        { name: eventsCategories.party || "FIESTA", id: "FIESTA" },
        {
          name: eventsCategories.baptisms || "BAUTIZOS Y COMUNIONES",
          id: "BAUTIZOS Y COMUNIONES",
        },
        {
          name: eventsCategories.graduations || "GRADUACIONES",
          id: "GRADUACIONES",
        },
      ],
      images: [
        {
          url: "https://dkcompany.imgix.net/3915_50559293-7f46-4828-9c94-b46adef822cf?auto=format&pad=0&ixlib=react-9.10.0",
          label: (
            eventsCategories.weddingGuest || "INVITADA DE BODA"
          ).toUpperCase(),
          categoryId: "INVITADA DE BODA",
        },
        {
          url: "https://images.pexels.com/photos/20464968/pexels-photo-20464968/free-photo-of-wedding-couple-kissing-under-a-veil.jpeg",
          label: (eventsCategories.brides || "NOVIAS").toUpperCase(),
          categoryId: "NOVIAS",
        },
        {
          url: "https://images.pexels.com/photos/31573537/pexels-photo-31573537.jpeg",
          label: (eventsCategories.party || "FIESTA").toUpperCase(),
          categoryId: "FIESTA",
        },
      ],
    },
    COLLECTION: {
      path: "/collection",
      label: t?.menu?.collection || "COLLECTION",
      categories: [
        {
          name: collectionCategories.summer || "SUMMER COLLECTION",
          id: "SUMMER COLLECTION",
        },
        { name: collectionCategories.newIn || "NEW IN", id: "NEW IN" },
        {
          name: collectionCategories.bestSellers || "BEST SELLERS",
          id: "BEST SELLERS",
        },
        {
          name: collectionCategories.dresses || "VESTIDOS Y MONOS",
          id: "VESTIDOS Y MONOS",
        },
        {
          name: collectionCategories.totalLook || "TOTAL LOOK",
          id: "TOTAL LOOK",
        },
        { name: collectionCategories.casual || "CASUAL", id: "CASUAL" },
        { name: collectionCategories.formal || "FORMAL", id: "FORMAL" },
        {
          name: collectionCategories.streetwear || "STREETWEAR",
          id: "STREETWEAR",
        },
        { name: collectionCategories.oversize || "OVERSIZE", id: "OVERSIZE" },
        { name: collectionCategories.urban || "URBANA", id: "URBANA" },
        { name: collectionCategories.minimal || "MINIMAL", id: "MINIMAL" },
      ],
      images: [
        {
          url: "https://images.squarespace-cdn.com/content/v1/5b1badd0b98a78e3e5d1f9d8/bdeec1fb-3eb7-4985-855e-5d8a4dd42995/onur-senay-I5vlrx9OCbc-unsplash.jpg",
          label: (
            collectionCategories.summer || "SUMMER COLLECTION"
          ).toUpperCase(),
          categoryId: "SUMMER COLLECTION",
        },
        {
          url: "https://images.pexels.com/photos/29196742/pexels-photo-29196742/free-photo-of-stylish-man-in-blue-suit-with-urban-backdrop.jpeg",
          label: (collectionCategories.totalLook || "TOTAL LOOK").toUpperCase(),
          categoryId: "TOTAL LOOK",
        },
        {
          url: "https://images.pexels.com/photos/4611795/pexels-photo-4611795.jpeg",
          label: (collectionCategories.newIn || "NEW IN").toUpperCase(),
          categoryId: "NEW IN",
        },
      ],
    },
    ABOUT: {
      path: "/about",
      label: t?.menu?.about || "ABOUT",
    },
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (authMode === "login") {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const success = await authLogin({
          email,
          password,
        });

        if (success) {
          setIsLoginOpen(false);
          if (email === "admin@nova.com") {
            console.log("Administrador Principal autenticado");
          } else if (email === "manager@nova.com") {
            console.log("Gerente de Tienda autenticado");
          } else if (email === "soporte@nova.com") {
            console.log("Soporte Técnico autenticado");
          } else if (email === "contenido@nova.com") {
            console.log("Editor de Contenido autenticado");
          }
        } else {
          alert("Credenciales incorrectas");
        }
      } else if (authMode === "register") {
        const success = await authRegister({
          name: formData.get("fullName") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          confirmPassword: formData.get("confirmPassword") as string,
        });

        if (success) {
          setIsLoginOpen(false);
          alert("Registro exitoso. ¡Bienvenido!");
        } else {
          alert("Error en el registro. Intenta con otro email.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      const success = await authLogin({
        email: `${provider.toLowerCase()}@nova.com`,
        password: "social_password",
        guest: false,
      });

      if (success) {
        setIsLoginOpen(false);
      } else {
        alert("Error en login social");
      }
    } catch (error) {
      console.error("Error en login social:", error);
      alert("Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const closeLogin = () => {
    if (!isLoading) {
      setIsLoginOpen(false);
      setAuthMode("login");
    }
  };

  const handleAdminLogin = async (
    email: string,
    password: string,
    roleName: string,
  ) => {
    setIsLoading(true);
    try {
      const success = await authLogin({
        email,
        password,
      });

      if (success) {
        setIsLoginOpen(false);
        console.log(`${roleName} autenticado exitosamente`);
      } else {
        alert(`Error en acceso de ${roleName}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {navLoading && (
        <div className="fixed inset-0 z-[300] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center font-serif">
          <FiLoader className="animate-spin text-black mb-4" size={40} />
          <p className="text-[10px] tracking-[0.4em] font-bold uppercase">
            Nova
          </p>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 
        ${
          isLibroPage
            ? "bg-white shadow-sm py-4 text-black"
            : isScrolled || activeMenu
              ? "bg-white shadow-sm py-4 text-black"
              : "bg-transparent py-8 text-black"
        }
        ${isLocationOpen || isSearchOpen || isLoginOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <div className="container mx-auto px-6 md:px-10 pointer-events-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-5xl font-serif tracking-tighter">
              NOVA
            </Link>

            <nav className="hidden md:flex space-x-10 items-center h-full">
              {Object.keys(menuData).map((key) => {
                const isActive = location.pathname === menuData[key].path;
                return (
                  <div
                    key={key}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setActiveMenu(key)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <Link
                      to={menuData[key].path}
                      onClick={() => setActiveMenu(null)}
                      className={`text-[13px] uppercase tracking-[0.3em] transition-all relative py-8
                        ${isActive ? "font-black" : "font-light hover:text-black"}`}
                    >
                      {menuData[key].label}
                      {isActive && (
                        <span className="absolute bottom-6 left-0 w-full h-[1.5px] bg-black animate-in fade-in slide-in-from-left-2 duration-500" />
                      )}
                    </Link>

                    {activeMenu === key && menuData[key].categories && (
                      <div
                        className="fixed top-[88px] left-0 w-full bg-white border-b border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-300 z-[160]"
                        onMouseEnter={() => setActiveMenu(key)}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                        <div className="container mx-auto px-10 py-12 flex gap-20">
                          <div className="flex flex-col space-y-5 min-w-[200px]">
                            {menuData[key].categories.map((cat: any) => (
                              <Link
                                key={cat.id}
                                to={menuData[key].path}
                                state={{ category: cat.id }}
                                onClick={() => setActiveMenu(null)}
                                className="text-[12px] font-light tracking-[0.1em] cursor-pointer hover:translate-x-2 transition-transform text-black uppercase"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                          {menuData[key].images && (
                            <div className="flex-1 grid grid-cols-3 gap-8 text-center">
                              {menuData[key].images.map(
                                (img: any, idx: number) => (
                                  <Link
                                    key={idx}
                                    to={menuData[key].path}
                                    state={{ category: img.categoryId }}
                                    onClick={() => setActiveMenu(null)}
                                    className="group/item cursor-pointer"
                                  >
                                    <div className="overflow-hidden aspect-[3/4] bg-gray-50 mb-4">
                                      <img
                                        src={img.url}
                                        alt={img.label}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                                      />
                                    </div>
                                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-black">
                                      {img.label}
                                    </p>
                                  </Link>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center space-x-5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:opacity-50 transition-opacity"
              >
                <FiSearch size={22} />
              </button>

              <button
                onClick={() => setIsLocationOpen(true)}
                className="p-2 hover:opacity-50 transition-opacity"
              >
                <FiGlobe size={22} />
              </button>

              {isAuthenticated ? (
                <div className="relative group">
                  <Link
                    to="/profile"
                    className="p-2 hover:opacity-50 transition-opacity flex items-center gap-2"
                  >
                    <FiUser size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">
                      {user?.name?.split(" ")[0] || "Usuario"}
                    </span>
                  </Link>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-4">
                      <p className="text-xs font-bold mb-2">
                        {user?.name || "Usuario"}
                      </p>
                      <p className="text-[10px] text-gray-500 mb-4">
                        {user?.email || ""}
                      </p>
                    </div>
                    <div className="border-t border-gray-100">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-xs hover:bg-gray-50"
                        onClick={() => setActiveMenu(null)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-xs hover:bg-gray-50"
                        onClick={() => setActiveMenu(null)}
                      >
                        Mis Pedidos
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-3 text-xs hover:bg-gray-50"
                        onClick={() => setActiveMenu(null)}
                      >
                        Wishlist ({wishlistCount})
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-gray-50 text-red-500 flex items-center gap-2"
                      >
                        <FiLogOut size={14} /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 hover:opacity-50 transition-opacity flex items-center gap-2"
                >
                  <FiUser size={22} />
                </button>
              )}

              <Link
                to="/wishlist"
                className="p-2 relative hover:opacity-50 transition-opacity"
              >
                <FiHeart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-2 relative hover:opacity-50 transition-opacity"
              >
                <FiShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
          ></div>
          <div className="relative bg-white w-full max-w-[450px] h-full shadow-2xl flex flex-col p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em]">
                {search.title || "Búsqueda"}
              </h3>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-black hover:scale-110 transition-transform"
              >
                <FiX size={30} />
              </button>
            </div>

            <div className="relative mb-12">
              <input
                autoFocus
                type="text"
                placeholder={search.placeholder || "ESCRIBE EL NOMBRE..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-b border-black py-4 text-[13px] uppercase tracking-widest outline-none placeholder:text-gray-300"
              />
              <FiSearch
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex-1 space-y-12">
              {searchQuery.length > 0 ? (
                <div className="space-y-8">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 6).map((product) => {
                      const displayName = product.name
                        .replace("HOMBRE_", "")
                        .replace("MUJER_", "")
                        .replace(/_/g, " ");

                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-6 group animate-in fade-in slide-in-from-bottom-2"
                        >
                          <div className="w-16 aspect-[3/4] overflow-hidden bg-gray-50">
                            <img
                              src={product.image}
                              alt={displayName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">
                              {displayName}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-serif italic">
                              ${product.price}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 italic">
                        {(search as any).noResults ||
                          "No se encontraron piezas"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in duration-700 space-y-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                      {(search as any).exploreByStyle || "Explorar por estilo"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {searchStyles.map((style: string) => (
                        <button
                          key={style}
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate("/collection", {
                              state: { category: style },
                            });
                          }}
                          className="border border-gray-100 py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isLocationOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setIsLocationOpen(false)}
            onMouseMove={(e) => e.stopPropagation()}
          ></div>

          <div className="relative bg-white w-full max-w-[420px] p-10 shadow-2xl z-[211] animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsLocationOpen(false)}
              className="absolute top-6 right-6 text-black hover:rotate-90 transition-transform duration-300"
            >
              <FiX size={24} />
            </button>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-8">
              {t?.location?.title || "Localizador"}
            </h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                  {(locationT as any).country || "País"}
                </label>
                <div className="relative">
                  <select
                    value={tempCountry}
                    onChange={(e) => setTempCountry(e.target.value)}
                    className="w-full appearance-none bg-white border border-black p-4 text-[11px] uppercase tracking-tighter focus:outline-none cursor-pointer pr-10"
                  >
                    <option value="es">España</option>
                    <option value="mx">México</option>
                    <option value="us">United States</option>
                    <option value="pe">PERÚ</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                  {(locationT as any).language || "Idioma"}
                </label>
                <div className="relative">
                  <select
                    value={tempLanguage}
                    onChange={(e) => setTempLanguage(e.target.value)}
                    className="w-full appearance-none bg-white border border-black p-4 text-[11px] uppercase tracking-tighter focus:outline-none cursor-pointer pr-10"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                  {(locationT as any).currency || "Moneda"}
                </label>
                <div className="relative">
                  <select
                    value={tempCurrency}
                    onChange={(e) => setTempCurrency(e.target.value)}
                    className="w-full appearance-none bg-white border border-black p-4 text-[11px] uppercase tracking-tighter focus:outline-none cursor-pointer pr-10"
                  >
                    <option value="eur">EUR (€)</option>
                    <option value="usd">USD ($)</option>
                    <option value="mxn">MXN ($)</option>
                    <option value="pen">PEN (S/)</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  updateLocale({
                    country: tempCountry,
                    language: tempLanguage,
                    currency:
                      tempCurrency === "pen"
                        ? "PEN (S/)"
                        : tempCurrency === "eur"
                          ? "EUR (€)"
                          : tempCurrency === "usd"
                            ? "USD ($)"
                            : tempCurrency === "mxn"
                              ? "MXN ($)"
                              : "PEN (S/)",
                  });
                  setIsLocationOpen(false);
                }}
                className="w-full bg-black text-white py-4 mt-4 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors"
              >
                {(locationT as any).confirmButton || "Confirmar selección"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 z-[220] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={closeLogin}></div>
          <div className="relative bg-white w-full max-w-[450px] h-full shadow-2xl flex flex-col p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
            {isLoading && (
              <div className="absolute inset-0 z-[210] bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <FiLoader className="animate-spin text-black mb-4" size={40} />
                <p className="text-[10px] tracking-[0.4em] font-bold uppercase">
                  {login.processing || "Procesando..."}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              {authMode !== "login" ? (
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-black hover:scale-110 transition-transform"
                >
                  <FiArrowLeft size={30} />
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={closeLogin}
                className="text-black hover:scale-110 transition-transform"
              >
                <FiX size={30} />
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-7xl font-serif tracking-tighter text-black">
                NOVA
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 font-bold mt-6 uppercase">
                {authMode === "login"
                  ? login.signIn || "Iniciar Sesión"
                  : authMode === "register"
                    ? login.register || "Registro"
                    : login.recoverAccount || "Recuperar Cuenta"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {authMode === "register" && (
                <div className="space-y-1 animate-in fade-in">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {login.fullName || "Nombre completo"}
                  </label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder={login.writeHere || "Escriba aquí"}
                    className="w-full bg-[#F5F5F5] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                  {login.email || "Correo electrónico"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder={login.writeHere || "Escriba aquí"}
                  className="w-full bg-[#F5F5F5] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black"
                  disabled={isLoading}
                />
              </div>

              {authMode !== "forgot" && (
                <div
                  className={`${authMode === "register" ? "grid grid-cols-2 gap-4" : "space-y-1"}`}
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                      {login.password || "Contraseña"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="password"
                      type="password"
                      placeholder={login.writeHere || "Escriba aquí"}
                      className="w-full bg-[#F5F5F5] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black"
                      disabled={isLoading}
                    />
                  </div>

                  {authMode === "register" && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black">
                        {login.confirm || "Confirmar"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="confirmPassword"
                        type="password"
                        placeholder={login.writeHere || "Escriba aquí"}
                        className="w-full bg-[#F5F5F5] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black"
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>
              )}

              {authMode === "login" && (
                <div className="space-y-2">
                  <button
                    onClick={() => setAuthMode("forgot")}
                    type="button"
                    className="text-[10px] text-blue-600 hover:underline block"
                    disabled={isLoading}
                  >
                    {login.forgotPassword || "Forgot your password?"}
                  </button>
                  <p className="text-[10px] text-gray-500 italic">
                    {login.ageWarning ||
                      "Debes tener 18 años o más para registrarte."}{" "}
                    <span className="underline cursor-pointer">
                      {login.legalTerms || "Aplican legales."}
                    </span>
                  </p>
                </div>
              )}

              {authMode === "register" && (
                <div className="flex items-start gap-3 py-2 animate-in fade-in">
                  <div className="relative flex items-center">
                    <input
                      required
                      type="checkbox"
                      id="terms"
                      className="peer appearance-none w-4 h-4 border border-black checked:bg-black cursor-pointer transition-all"
                      disabled={isLoading}
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none w-4 h-4 flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-[9px] text-gray-500 leading-tight uppercase tracking-tight"
                  >
                    {login.readAndAgree || "He leído y acepto los"}{" "}
                    <span className="text-black font-bold underline cursor-pointer">
                      {login.termsAndConditions || "Términos y Condiciones"}
                    </span>{" "}
                    {login.ofNOVA || "de NOVA."}
                  </label>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-4">
                {authMode === "login" ? (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="flex-1 bg-black text-white py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black border border-black transition-all disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {login.registerButton || "Regístrate"}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 border border-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <FiLoader className="animate-spin" size={16} />
                      ) : (
                        login.signInButton || "Ingresar"
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 font-bold text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FiLoader className="animate-spin" size={16} />
                    ) : authMode === "register" ? (
                      login.createAccount || "Crear Cuenta"
                    ) : (
                      login.sendLink || "Enviar Enlace"
                    )}
                  </button>
                )}
              </div>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute w-full border-t border-gray-100"></div>
                <span className="relative bg-white px-4 text-[10px] font-bold text-gray-300">
                  OR
                </span>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="w-full bg-[#1877F2] text-white py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin" size={14} />
                  ) : (
                    <>
                      <FaFacebookF size={16} />{" "}
                      {login.continueWithFacebook || "Continue with Facebook"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full border border-gray-200 py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin" size={14} />
                  ) : (
                    <>
                      <FcGoogle size={18} />{" "}
                      {login.continueWithGoogle || "Continue with Google"}
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="mb-3">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center mb-2">
                    Acceso Administración
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleAdminLogin(
                        "admin@nova.com",
                        "NovaAdmin2025!",
                        "Administrador Principal",
                      )
                    }
                    disabled={isLoading}
                    className="w-full text-[9px] text-gray-400 hover:text-black uppercase tracking-widest border border-gray-200 py-3 hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="animate-spin" size={12} />
                        Cargando...
                      </>
                    ) : (
                      "Super Admin (Demo)"
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAdminLogin(
                        "manager@nova.com",
                        "NovaManager2025!",
                        "Gerente de Tienda",
                      )
                    }
                    disabled={isLoading}
                    className="text-[8px] text-gray-500 hover:text-green-600 border border-gray-100 py-2 hover:border-green-200 transition-all disabled:opacity-30"
                  >
                    Gerente
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAdminLogin(
                        "soporte@nova.com",
                        "NovaSoporte2025!",
                        "Soporte Técnico",
                      )
                    }
                    disabled={isLoading}
                    className="text-[8px] text-gray-500 hover:text-purple-600 border border-gray-100 py-2 hover:border-purple-200 transition-all disabled:opacity-30"
                  >
                    Soporte
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAdminLogin(
                        "contenido@nova.com",
                        "NovaContenido2025!",
                        "Editor de Contenido",
                      )
                    }
                    disabled={isLoading}
                    className="text-[8px] text-gray-500 hover:text-yellow-600 border border-gray-100 py-2 hover:border-yellow-200 transition-all disabled:opacity-30"
                  >
                    Editor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
