import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiMinus, FiPlus, FiHeart, FiShare2, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { products } from "../../data/products";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { translations } from "../../data/translations";
import { useLocale } from "../../context/LocaleContext";
interface NavigationHistory {
  path: string;
  state?: any;
}
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFavorite, isFavorite } = useWishlist();
  const { addToCart } = useCart();
  const { locale } = useLocale();
  const product = products.find((p) => p.id === id) || products[0];
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Olive Green");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const isWishlisted = isFavorite(product.id);
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hip: "",
  });
  const [calculatedResult, setCalculatedResult] = useState<string | null>(null);
  const navigationHistory = useRef<NavigationHistory[]>([]);
  const cleanCategoryName = (name: string) => {
    return name.replace("MUJER_", "").replace("HOMBRE_", "").replace(/_/g, " ");
  };
  const originContext = location.state?.originContext || location.state || {};
  const getOriginInfo = () => {
    if (originContext.page) {
      return {
        page: originContext.page,
        category: originContext.category,
        type: originContext.type || originContext.category,
        filters: originContext.filters,
        pageNumber: originContext.pageNumber,
        returnPath: originContext.returnPath,
      };
    }
    const rawCategory = product.category || "";
    const rawSubCategory = product.type || "";

    return {
      page:
        rawCategory.toLowerCase() === "men"
          ? "men"
          : rawCategory.toLowerCase() === "women"
            ? "women"
            : rawCategory.toLowerCase() === "events"
              ? "events"
              : rawCategory.toLowerCase() === "collection"
                ? "collection"
                : "home",
      category: rawCategory,
      type: rawSubCategory,
    };
  };

  const originInfo = getOriginInfo();
  const getMainCategoryRoute = () => {
    switch (originInfo.page) {
      case "men":
        return "/men";
      case "women":
        return "/women";
      case "events":
        return "/events";
      case "collection":
        return "/collection";
      case "sales":
        return "/sales";
      default:
        return "/";
    }
  };

  const getMainCategoryLabel = () => {
    switch (originInfo.page) {
      case "men":
        return t.menu.men || "Hombre";
      case "women":
        return t.menu.women || "Mujer";
      case "events":
        return t.menu.events || "Eventos";
      case "collection":
        return t.menu.collection || "Colección";
      case "sales":
        return t.menu.sales || "Rebajas";
      default:
        return language === "es" ? "Inicio" : "Home";
    }
  };

  const mainCategoryRoute = getMainCategoryRoute();
  const mainCategoryLabel = getMainCategoryLabel();
  const rawSubCategory = originInfo.type || product.type || "";
  const displaySubCategory = cleanCategoryName(rawSubCategory);
  const cleanProductName = cleanCategoryName(product.name);
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const breadcrumbContainer = document.querySelector("[data-breadcrumb]");
      if (breadcrumbContainer?.contains(target)) {
        console.log("Click en breadcrumb detectado!");
        console.log("Elemento clickeado:", target);
        console.log("Clases del elemento:", target.className);
        const computedStyle = window.getComputedStyle(target);
        console.log("¿Tiene pointer-events?", computedStyle.pointerEvents);
        console.log("¿Tiene cursor?", computedStyle.cursor);
        console.log(
          "¿Está visible?",
          computedStyle.visibility,
          computedStyle.opacity,
          computedStyle.display,
        );
      }
    };
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (
      navigationHistory.current.length === 0 ||
      navigationHistory.current[navigationHistory.current.length - 1].path !==
        currentPath
    ) {
      if (navigationHistory.current.length >= 5) {
        navigationHistory.current.shift();
      }

      navigationHistory.current.push({
        path: currentPath,
        state: location.state,
      });
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [product]);

  const colors = [
    { name: "Olive Green", hex: "#556B2F" },
    { name: "Forest Green", hex: "#2F4F4F" },
    { name: "Night Blue", hex: "#191970" },
  ];

  const sizes = ["XXS", "XS", "S", "M", "L"];
  const handleCalculate = () => {
    const { chest, waist, hip } = measurements;

    if (!chest || !waist || !hip) {
      toast.error("Por favor ingresa todas las medidas", {
        style: {
          borderRadius: "0px",
          background: "#000",
          color: "#fff",
          fontSize: "10px",
        },
      });
      return;
    }

    const c = parseFloat(chest);
    const w = parseFloat(waist);
    const h = parseFloat(hip);

    const getZoneSize = (type: "c" | "w" | "h") => {
      if (type === "c") {
        if (c < 82) return 0;
        if (c < 86) return 1;
        if (c < 90) return 2;
        if (c < 96) return 3;
        return 4;
      }
      if (type === "w") {
        if (w < 62) return 0;
        if (w < 66) return 1;
        if (w < 70) return 2;
        if (w < 76) return 3;
        return 4;
      }
      if (h < 88) return 0;
      if (h < 92) return 1;
      if (h < 96) return 2;
      if (h < 102) return 3;
      return 4;
    };

    const sizeIndex = Math.max(
      getZoneSize("c"),
      getZoneSize("w"),
      getZoneSize("h"),
    );
    const recommendedSize = sizes[sizeIndex];

    setCalculatedResult(recommendedSize);
    setSelectedSize(recommendedSize);

    toast.success(`Talla ${recommendedSize} recomendada y seleccionada`, {
      duration: 2500,
      style: {
        borderRadius: "0px",
        background: "#000",
        color: "#fff",
        fontSize: "10px",
        letterSpacing: "0.1em",
      },
    });

    setTimeout(() => {
      setIsSizeGuideOpen(false);
      resetMeasurements();
    }, 1800);
  };

  const resetMeasurements = () => {
    setMeasurements({ chest: "", waist: "", hip: "" });
    setCalculatedResult(null);
  };

  const handleNavigateBack = () => {
    console.log("Origin Info:", originInfo);

    if (originInfo.returnPath) {
      console.log("Usando returnPath:", originInfo.returnPath);
      navigate(originInfo.returnPath, {
        state: {
          category: originInfo.category,
          filters: originInfo.filters,
          pageNumber: originInfo.pageNumber,
        },
      });
      return;
    }

    if (navigationHistory.current.length > 1) {
      navigationHistory.current.pop();
      const previous = navigationHistory.current.pop();

      if (previous) {
        console.log("Usando historial:", previous.path);
        navigate(previous.path, { state: previous.state });
        return;
      }
    }

    const routeInfo = {
      men: "/men",
      women: "/women",
      events: "/events",
      collection: "/collection",
      sales: "/sales",
      home: "/",
    };

    const fallbackRoute =
      routeInfo[originInfo.page as keyof typeof routeInfo] || "/";
    console.log("Usando fallback:", fallbackRoute);

    navigate(fallbackRoute, {
      state: originInfo.category
        ? {
            category: originInfo.category,
          }
        : undefined,
    });
  };

  const handleNavigateToCategory = (route: string, categoryState?: any) => {
    if (categoryState) {
      navigate(route, { state: categoryState });
    } else {
      navigate(route);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      selectedSize,
    );

    toast.success(
      `${cleanProductName} ${t.pages.product.addToCart} - ${t.pages.product.sizeGuide} ${selectedSize}`,
      {
        style: {
          borderRadius: "0px",
          background: "#000",
          color: "#fff",
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        },
      },
    );
  };

  const handleToggleWishlist = () => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const shouldShowFirstArrow = mainCategoryRoute !== "/" || displaySubCategory;

  return (
    <div className="min-h-screen bg-white pt-[100px]">
      <div
        className="fixed top-[100px] left-0 right-0 bg-white border-b z-[9999] py-4 shadow-sm"
        data-breadcrumb
        style={{ pointerEvents: "auto" }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <nav className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate("/");
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-black transition-colors px-2 py-1 rounded-sm select-none"
              style={{ pointerEvents: "auto" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/");
                }
              }}
            >
              {language === "es" ? "Inicio" : "Home"}
            </div>

            {shouldShowFirstArrow && (
              <span className="text-gray-300 text-[14px] select-none">→</span>
            )}

            {mainCategoryRoute !== "/" && (
              <>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavigateToCategory(mainCategoryRoute, {
                      category: originInfo.category,
                    });
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-black transition-colors px-2 py-1 rounded-sm select-none"
                  style={{ pointerEvents: "auto" }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNavigateToCategory(mainCategoryRoute, {
                        category: originInfo.category,
                      });
                    }
                  }}
                >
                  {mainCategoryLabel}
                </div>

                {displaySubCategory && (
                  <>
                    <span className="text-gray-300 text-[14px] select-none">
                      →
                    </span>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavigateToCategory(mainCategoryRoute, {
                          category: rawSubCategory,
                        });
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-black transition-colors px-2 py-1 rounded-sm select-none"
                      style={{ pointerEvents: "auto" }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNavigateToCategory(mainCategoryRoute, {
                            category: rawSubCategory,
                          });
                        }
                      }}
                    >
                      {displaySubCategory}
                    </div>
                  </>
                )}
              </>
            )}

            {(mainCategoryRoute !== "/" || displaySubCategory) && (
              <span className="text-gray-300 text-[14px] select-none">→</span>
            )}

            <span className="text-black font-black tracking-[0.1em] truncate max-w-[150px] md:max-w-none select-none px-2 py-1">
              {cleanProductName}
            </span>

            <div className="ml-auto">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigateBack();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest px-2 py-1 rounded-sm select-none"
                style={{ pointerEvents: "auto" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNavigateBack();
                  }
                }}
              >
                ← {language === "es" ? "Volver atrás" : "Go back"}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="pt-20">
        <div className="container mx-auto px-6 md:px-12 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-[#F3F3F3] aspect-[4/5] overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F3F3F3] aspect-square rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                </div>
                <div className="bg-[#F3F3F3] aspect-square rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-none">
                    {cleanProductName}
                  </h1>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    {t.pages.product.relatedProducts}: {product.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2.5 rounded-full transition-all ${
                      isWishlisted
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FiHeart
                      size={18}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-all">
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.oldPrice}
                    </span>
                    <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full">
                      -
                      {Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100,
                      )}
                      %
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-500 text-[12px] leading-relaxed mb-8 max-w-md">
                {product.description}
              </p>
              <div className="mb-8">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t.pages.product.freeShipping}
                </p>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        selectedColor === color.name
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                    >
                      {selectedColor === color.name && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {t.pages.product.sizeGuide}
                  </p>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] font-bold border-b border-black pb-0.5 hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    {language === "es" ? "GUÍA DE TALLAS" : "SIZE GUIDE"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-gray-400 italic mb-6"></p>
              <div className="flex gap-4 mb-10">
                <div className="flex items-center bg-gray-100 rounded-full px-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-200 rounded-l-full cursor-pointer"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-200 rounded-r-full cursor-pointer"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white rounded-full py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  {t.pages.product.addToCart}
                </button>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-black uppercase tracking-widest">
                    ✓ {t.pages.product.freeShipping}
                  </span>
                  <span className="text-gray-500">
                    {t.pages.product.shippingInfo}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-black uppercase tracking-widest">
                    ✓ {t.pages.product.freeReturns}
                  </span>
                  <span className="text-gray-500">
                    {t.pages.product.returnsInfo}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <section className="mt-24">
            <h2 className="text-4xl font-black text-center uppercase tracking-tighter mb-12">
              {t.pages.product.relatedProducts}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  {...relatedProduct}
                  name={relatedProduct.name
                    .replace(/[HOMBRE_|MUJER_]/g, "")
                    .replace(/_/g, " ")}
                  category={relatedProduct.category}
                  type={relatedProduct.type}
                  originContext={{
                    page: originInfo.page,
                    category: originInfo.category,
                    currentProductId: id,
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#333333]/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-[600px] p-8 relative shadow-2xl"
          >
            <button
              onClick={() => {
                setIsSizeGuideOpen(false);
                resetMeasurements();
              }}
              className="absolute right-4 top-4 text-black hover:rotate-90 transition-transform cursor-pointer"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b pb-4">
              {language === "es" ? "Guía de Talla" : "Size Guide"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {["chest", "waist", "hip"].map((key) => (
                <div key={key} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {key === "chest"
                      ? language === "es"
                        ? "Pecho (cm)"
                        : "Chest (cm)"
                      : key === "waist"
                        ? language === "es"
                          ? "Cintura (cm)"
                          : "Waist (cm)"
                        : language === "es"
                          ? "Cadera (cm)"
                          : "Hip (cm)"}
                  </label>
                  <input
                    type="number"
                    value={measurements[key as keyof typeof measurements]}
                    onChange={(e) =>
                      setMeasurements({
                        ...measurements,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 p-4 text-center text-lg font-light focus:border-black outline-none transition-all cursor-text"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            {calculatedResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-zinc-50 border border-zinc-100 text-center"
              >
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                  {language === "es"
                    ? "Tu talla perfecta es"
                    : "Your perfect size is"}
                </p>
                <span className="text-5xl font-black tracking-tighter">
                  {calculatedResult}
                </span>
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleCalculate}
                className="flex-[1.5] bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg cursor-pointer"
              >
                {language === "es" ? "Calcular Talla" : "Calculate Size"}
              </button>
              <button
                onClick={resetMeasurements}
                className="flex-1 border border-gray-200 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all text-gray-400 cursor-pointer"
              >
                {language === "es" ? "Borrar Todo" : "Clear All"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default ProductDetail;
