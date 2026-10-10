import { useState, useMemo, useEffect } from "react";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { products } from "../../data/products";
import {
  FiFilter,
  FiX,
  FiPlus,
  FiChevronRight,
  FiChevronLeft,
  FiSearch,
} from "react-icons/fi";
import { CATALOG_CONFIG } from "../../constants/catalogConfig";
import womenVideo from "../../assets/videos/women.mp4";
import { useNavigate, useLocation } from "react-router-dom";
import { translations } from "../../data/translations";
import { useLocale } from "../../context/LocaleContext";

const FILTER_OPTIONS = {
  COLORES: ["NEGRO", "BLANCO", "AZUL", "BEIGE", "MARRÓN", "GRIS"],
  MATERIAL: ["ALGODÓN", "LINO", "SEDA", "LANA", "POLIÉSTER"],
  COLECCION: ["PRIMAVERA/VERANO", "OTOÑO/INVIERNO", "COLECCIÓN ESPECIAL"],
  AJUSTE: ["SLIM FIT", "STRAIGHT", "RELAXED", "WIDE LEG", "SKINNY"],
  TIPO_CINTURA: ["ALTA", "MEDIA", "BAJA"],
  CORTE_PANTALON: ["RECTO", "ACAMPANADO", "PITILLO", "PALAZZO", "TAPERED"],
  LONGITUD_PRENDA: ["CORTO", "TOBILLERO", "LARGO", "EXTRA LARGO"],
  ESTILO_CUELLO: ["V", "REDONDO", "ALTO", "CAMISERO", "HALTER"],
  OCASION: [
    "ELEGANTE",
    "URBANO",
    "CASUAL",
    "STREETWEAR",
    "MINIMAL",
    "OVERSIZE",
    "FIESTA",
    "EVENTOS",
  ],
  TIPO_PRODUCTO: ["CASUAL", "FORMAL", "SASTRE", "CARGO", "JOGGER", "DENIM"],
};

const CATALOG_FILTERS: Record<string, string[]> = {
  MUJER_POLOS_Y_TOPS: [
    "COLORES",
    "TIPO_PRODUCTO",
    "AJUSTE",
    "ESTILO_CUELLO",
    "LONGITUD_PRENDA",
    "OCASION",
    "MATERIAL",
    "COLECCION",
  ],
  MUJER_PANTALONES: [
    "COLORES",
    "AJUSTE",
    "TIPO_CINTURA",
    "CORTE_PANTALON",
    "LONGITUD_PRENDA",
    "OCASION",
    "MATERIAL",
    "COLECCION",
  ],
  MUJER_VESTIDOS: [
    "COLORES",
    "LONGITUD_PRENDA",
    "OCASION",
    "MATERIAL",
    "COLECCION",
  ],
  MUJER_BLAZERS: ["COLORES", "AJUSTE", "OCASION", "MATERIAL", "COLECCION"],
  DEFAULT: ["COLORES", "OCASION", "MATERIAL", "COLECCION"],
};

const CATALOG_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    COLORES: "COLORS",
    MATERIAL: "MATERIAL",
    COLECCION: "COLLECTION",
    AJUSTE: "FIT",
    TIPO_CINTURA: "WAIST TYPE",
    CORTE_PANTALON: "PANT CUT",
    LONGITUD_PRENDA: "LENGTH",
    OCASION: "OCCASION",
    TIPO_PRODUCTO: "PRODUCT TYPE",
    ESTILO_CUELLO: "NECKLINE",
    PRECIO: "PRICE",
    TALLA: "SIZE",
    ORDEN: "SORT",
    BUSQUEDA: "SEARCH",
    FILTRAR: "FILTER",
    "BUSCAR...": "SEARCH...",
    NEGRO: "BLACK",
    BLANCO: "WHITE",
    AZUL: "BLUE",
    BEIGE: "BEIGE",
    MARRÓN: "BROWN",
    GRIS: "GREY",
    ALGODÓN: "COTTON",
    LINO: "LINEN",
    SEDA: "SILK",
    LANA: "WOOL",
    POLIÉSTER: "POLYESTER",
    RECTO: "STRAIGHT",
    ALTA: "HIGH",
    MEDIA: "MID",
    BAJA: "LOW",
    PALAZZO: "PALAZZO",
    TAPERED: "TAPERED",
    CORTO: "SHORT",
    TOBILLERO: "ANKLE LENGTH",
    LARGO: "LONG",
    "EXTRA LARGO": "EXTRA LONG",
    V: "V-NECK",
    REDONDO: "ROUND",
    ALTO: "HIGH",
    CAMISERO: "SHIRT COLLAR",
    HALTER: "HALTER",
    ELEGANTE: "ELEGANT",
    URBANO: "URBAN",
    CASUAL: "CASUAL",
    STREETWEAR: "STREETWEAR",
    MINIMAL: "MINIMALIST",
    FIESTA: "PARTY",
    EVENTOS: "EVENTS",
    OVERSIZE: "OVERSIZED",
    JOGGER: "JOGGER",
    DENIM: "DENIM",
    "PRIMAVERA/VERANO": "SPRING/SUMMER",
    "OTOÑO/INVIERNO": "FALL/WINTER",
    "COLECCIÓN ESPECIAL": "SPECIAL COLLECTION",
    "MÁS NUEVOS": "NEWEST",
    HASTA: "UP TO",
    "LIMPIAR TODO": "CLEAR ALL",
    "VER TODO": "VIEW ALL",
    ARTÍCULOS: "ITEMS",
    VER: "SEE",
    PRODUCTOS: "PRODUCTS",
    "POLOS Y TOPS": "POLOS & TOPS",
    PANTALONES: "PANTS",
    VESTIDOS: "DRESSES",
    BLAZERS: "BLAZERS",
    MUJER_POLOS_Y_TOPS: "WOMEN'S POLOS & TOPS",
    MUJER_PANTALONES: "WOMEN'S PANTS",
    MUJER_VESTIDOS: "WOMEN'S DRESSES",
    MUJER_BLAZERS: "WOMEN'S BLAZERS",
    MUJER: "WOMEN",
    "RANGOS DE PRECIO": "PRICE RANGES",
    "MENOS DE $500": "UNDER $500",
    "MÁS DE $1000": "OVER $1000",
    "PRECIO: < $500": "PRICE: < $500",
    "PRECIO: $500-$1000": "PRICE: $500-$1000",
    "PRECIO: > $1000": "PRICE: > $1000",
    "NOMBRE: A-Z": "NAME: A-Z",
    "NOMBRE: Z-A": "NAME: Z-A",
    ITEMS: "ITEMS",
    "SLIM FIT": "SLIM FIT",
    STRAIGHT: "STRAIGHT",
    RELAXED: "RELAXED",
    "WIDE LEG": "WIDE LEG",
    SKINNY: "SKINNY",
    POLOS: "POLOS",
    TOPS: "TOPS",
    BODY: "BODY",
    "CORSÉS Y BUSTIER": "CORSETS & BUSTIERS",
    ESTAMPADOS: "PRINTS",
    "CROPPED TOPS": "CROPPED TOPS",
    BASICOS: "BASICS",
    "CUELLO ALTO": "HIGH NECK",
    "SIN MANGAS": "SLEEVELESS",
    JEANS: "JEANS",
    SASTRE: "TAILORED",
    CARGO: "CARGO",
    LEGGINGS: "LEGGINGS",
    SHORTS: "SHORTS",
    RECTOS: "STRAIGHT",
    FLARE: "FLARE",
    MAXI: "MAXI",
    MINI: "MINI",
    MIDI: "MIDI",
    CAMISEROS: "SHIRT DRESSES",
    SATINADOS: "SATIN",
    AJUSTADO: "FITTED",
    VAQUEROS: "DENIM",
    OVERSIZED: "OVERSIZED",
    CHALECOS: "WAISTCOATS",
    VESTIDOS_Y_MONOS: "DRESSES & JUMPSUITS",
  },
};

const FILTER_TITLE_MAP: Record<string, string> = {
  COLORES: "color",
  AJUSTE: "fit",
  MATERIAL: "materials",
  COLECCION: "collection",
  TIPO_PRODUCTO: "productType",
  ESTILO_CUELLO: "neckline",
  LONGITUD_PRENDA: "length",
  OCASION: "occasion",
  TIPO_CINTURA: "waistType",
  CORTE_PANTALON: "pantCut",
  PRECIO: "priceRange",
  TALLA: "availableSizes",
};

interface Product {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  category?: string;
  type?: string;
  sizes?: string[];
  date?: string | Date;
  image: string;
  imageHover?: string;
  onSale?: boolean;
  tags?: string[];
}

const Women = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useLocale();

  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;

  const translate = (text: string): string => {
    if (!text || text.trim() === "") return "";

    const normalizedKey = text.toUpperCase().replace(/_/g, " ").trim();

    if (normalizedKey === "VER TODO" || normalizedKey === "VIEW ALL") {
      return language === "en" ? "VIEW ALL" : "VER TODO";
    }

    if (language === "es") {
      return text;
    }

    if (CATALOG_TRANSLATIONS.en && CATALOG_TRANSLATIONS.en[normalizedKey]) {
      return CATALOG_TRANSLATIONS.en[normalizedKey];
    }

    const invertedEntry = Object.entries(CATALOG_TRANSLATIONS.en || {}).find(
      ([_, englishValue]) => englishValue.toUpperCase() === normalizedKey,
    );
    if (invertedEntry) {
      return invertedEntry[1];
    }

    if (language === "en") {
      if (t.catalog?.filters) {
        for (const [, value] of Object.entries(t.catalog.filters)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }

      if (t.catalog?.options) {
        for (const [, value] of Object.entries(t.catalog.options)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }

      if (t.catalog?.labels) {
        for (const [, value] of Object.entries(t.catalog.labels)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }
    }

    return text;
  };

  const getFilterTitle = (filterKey: string): string => {
    const mappedKey = FILTER_TITLE_MAP[filterKey];

    if (mappedKey) {
      if (t.common && t.common[mappedKey as keyof typeof t.common]) {
        const commonValue = t.common[mappedKey as keyof typeof t.common];
        if (commonValue && typeof commonValue === "string") {
          return commonValue;
        }
      }

      if (t.filters && t.filters[mappedKey as keyof typeof t.filters]) {
        const filterValue = t.filters[mappedKey as keyof typeof t.filters];
        if (filterValue && typeof filterValue === "string") {
          return filterValue;
        }
      }

      if (
        t.catalog?.filters &&
        typeof t.catalog.filters === "object" &&
        mappedKey in t.catalog.filters
      ) {
        const catalogValue = (t.catalog.filters as Record<string, string>)[
          mappedKey
        ];
        if (catalogValue && typeof catalogValue === "string") {
          return catalogValue;
        }
      }
    }

    return translate(filterKey);
  };

  const VIEW_ALL_LABEL = (t.common.viewAllProducts || "VER TODO").toUpperCase();

  const [view, setView] = useState<"landing" | "catalog">("landing");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeSubFilter, setActiveSubFilter] = useState(VIEW_ALL_LABEL);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSections, setOpenSections] = useState<string[]>(["PRECIO"]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  const itemsPerPage = 12;

  const categoryTiles = [
    {
      id: "MUJER_POLOS_Y_TOPS",
      title: t.categories.women.tops.split(" ")[0],
      subtitle:
        t.categories.women.tops.split(" ")[2] ||
        t.categories.women.tops.split(" ")[1],
      img: "https://hmperu.vtexassets.com/arquivos/ids/5665022/Chaleco-largo---Beige-claro-Estampado-de-cebra---H-M-PE.jpg?v=638854067345830000",
      titleColor: "text-black",
      subtitleColor: "text-[#4ade80]",
    },
    {
      id: "MUJER_PANTALONES",
      title: t.categories.women.pants,
      img: "https://image.hm.com/assets/hm/ce/05/ce059d2a9c2fbbac82abeca7d0ae8be774295b68.jpg",
      titleColor: "text-[#f4a7a7]",
    },
    {
      id: "MUJER_VESTIDOS",
      title: t.categories.women.dresses,
      img: "https://etceterabridal.co.nz/wp-content/uploads/2022/10/faye-1.jpg",
      titleColor: "text-black",
    },
    {
      id: "MUJER_BLAZERS",
      title: t.categories.women.blazers,
      img: "https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/zoom/5051637bcbbc922301aa324a6586daaf8e49a244_xxl-1.jpg",
      titleColor: "text-white",
    },
  ];

  const displayTitle = selectedCategory
    ? selectedCategory.replace("MUJER_", "").replace(/_/g, " ")
    : t.menu.women;

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      setActiveSubFilter(VIEW_ALL_LABEL);
      setCurrentPage(1);
      setView("catalog");

      window.history.replaceState({}, document.title);
    }

    window.scrollTo(0, 0);
  }, [location, view, selectedCategory, VIEW_ALL_LABEL]);

  useEffect(() => {
    if (view === "catalog" && !selectedCategory) {
      setView("landing");
    }
  }, [selectedCategory, view]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handleFilterToggle = (filterCategory: string, option: string) => {
    setActiveFilters((prev) => {
      const currentCategoryOptions = prev[filterCategory] || [];
      const isSelected = currentCategoryOptions.includes(option);

      return {
        ...prev,
        [filterCategory]: isSelected
          ? currentCategoryOptions.filter((item) => item !== option)
          : [...currentCategoryOptions, option],
      };
    });
    setCurrentPage(1);
  };

  const handleSizeToggle = (size: string) => {
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActiveSizes([]);
    setPriceRange(2000);
    setActiveFilters({});
    setActiveSubFilter(VIEW_ALL_LABEL);
    setSearchTerm("");
    setSortBy("");
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    if (!selectedCategory) return [];
    const rawTags = (CATALOG_CONFIG as any)[selectedCategory] || [];
    const filteredTags = rawTags.filter(
      (tag: string) =>
        !tag.toUpperCase().includes("VER TODO") &&
        !tag.toUpperCase().includes("VIEW ALL"),
    );
    return [VIEW_ALL_LABEL, ...filteredTags];
  }, [selectedCategory, VIEW_ALL_LABEL, language]);

  const compareTags = (tag: string, filterValue: string): boolean => {
    const normalizedTag = tag.toUpperCase();
    const normalizedFilter = filterValue.toUpperCase();
    if (
      normalizedTag === normalizedFilter ||
      normalizedTag.includes(normalizedFilter)
    ) {
      return true;
    }
    if (language === "en") {
      const translatedTag = translate(tag).toUpperCase();
      if (
        translatedTag === normalizedFilter ||
        translatedTag.includes(normalizedFilter)
      ) {
        return true;
      }
    }
    if (language === "es") {
      const translatedFilter = translate(filterValue).toUpperCase();
      if (
        normalizedTag === translatedFilter ||
        normalizedTag.includes(translatedFilter)
      ) {
        return true;
      }
    }
    const englishTag = CATALOG_TRANSLATIONS.en?.[normalizedTag];
    if (englishTag && englishTag.toUpperCase() === normalizedFilter) {
      return true;
    }

    return false;
  };
  const filteredProducts = useMemo(() => {
    const productsArray = Array.isArray(products) ? products : [];
    let result = productsArray.filter((p: Product) => {
      const isWomen = p.category?.toLowerCase() === "women";
      const matchesCat = selectedCategory
        ? p.type === selectedCategory || p.tags?.includes(selectedCategory)
        : true;
      const matchesSubFilter =
        activeSubFilter === VIEW_ALL_LABEL
          ? true
          : p.type?.toUpperCase().includes(activeSubFilter.toUpperCase()) ||
            p.tags?.some((tag: string) => {
              const tagMatch = compareTags(tag, activeSubFilter);
              if (!tagMatch && selectedCategory) {
                const catalogTags =
                  (CATALOG_CONFIG as any)[selectedCategory] || [];
                const isInCatalogTags = catalogTags.some(
                  (catalogTag: string) => {
                    const normalizedCatalogTag = catalogTag.toUpperCase();
                    return compareTags(tag, normalizedCatalogTag);
                  },
                );
                if (isInCatalogTags) {
                  const translatedActiveSubFilter =
                    translate(activeSubFilter).toUpperCase();
                  const translatedTag = translate(tag).toUpperCase();
                  return (
                    translatedTag === translatedActiveSubFilter ||
                    translatedTag.includes(translatedActiveSubFilter)
                  );
                }
              }
              return tagMatch;
            });

      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPrice = p.price <= priceRange;
      const matchesSize =
        activeSizes.length > 0
          ? activeSizes.some((s) => p.sizes?.includes(s))
          : true;

      const matchesDynamicFilters = Object.entries(activeFilters).every(
        ([_, selectedValues]) => {
          if (selectedValues.length === 0) return true;

          return selectedValues.some((value) => {
            const normalizedValue = value.toUpperCase();

            return p.tags?.some((tag: string) => {
              const normalizedTag = tag.toUpperCase();

              if (
                normalizedTag === normalizedValue ||
                normalizedTag.includes(normalizedValue)
              ) {
                return true;
              }

              if (language === "en") {
                const translatedTag = translate(tag).toUpperCase();
                if (
                  translatedTag === normalizedValue ||
                  translatedTag.includes(normalizedValue)
                ) {
                  return true;
                }
              }

              if (language === "es") {
                const translatedValue = translate(value).toUpperCase();
                if (
                  normalizedTag === translatedValue ||
                  normalizedTag.includes(translatedValue)
                ) {
                  return true;
                }
              }

              return false;
            });
          });
        },
      );

      let matchesRange = true;
      if (sortBy === "range1") matchesRange = p.price < 500;
      if (sortBy === "range2") matchesRange = p.price >= 500 && p.price <= 1000;
      if (sortBy === "range3") matchesRange = p.price > 1000;

      return (
        isWomen &&
        matchesCat &&
        matchesSubFilter &&
        matchesPrice &&
        matchesSize &&
        matchesDynamicFilters &&
        matchesSearch &&
        matchesRange
      );
    });

    return [...result].sort((a: Product, b: Product) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "za") return b.name.localeCompare(a.name);
      if (sortBy === "newest") {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [
    selectedCategory,
    activeSubFilter,
    priceRange,
    activeSizes,
    activeFilters,
    searchTerm,
    sortBy,
    VIEW_ALL_LABEL,
    language,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCategory = (id: string) => {
    setSelectedCategory(id);
    setActiveSubFilter(VIEW_ALL_LABEL);
    setCurrentPage(1);
    setView("catalog");
  };

  return (
    <div className="min-h-screen bg-white pt-[120px]">
      {view === "landing" ? (
        <div className="animate-in fade-in duration-700">
          <div className="relative h-[75vh] w-full overflow-hidden">
            <video
              src={womenVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-between py-24 text-white">
              <h1
                className="tracking-[0.3em] text-center uppercase px-4 drop-shadow-lg leading-tight"
                style={{
                  fontFamily: '"Papyrus", "Comic Sans MS", serif',
                  fontSize: "64px",
                  fontWeight: "normal",
                  fontStyle: "normal",
                }}
              >
                {t.pages.women.hero}
              </h1>
              <p
                className="tracking-[0.1em] uppercase text-center px-4 drop-shadow-md leading-tight"
                style={{
                  fontFamily: "Padauk, sans-serif",
                  fontSize: "55px",
                  fontWeight: "400",
                }}
              >
                {t.pages.women.subtitle}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
            {categoryTiles.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleOpenCategory(cat.id)}
                className="relative h-[500px] md:h-[700px] cursor-pointer group overflow-hidden"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="font-serif italic text-4xl md:text-6xl px-4 drop-shadow-sm leading-tight">
                    <span className={cat.titleColor}>{cat.title}</span>
                    {cat.subtitle && (
                      <>
                        <br />
                        <span className={cat.subtitleColor}>
                          {cat.subtitle}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pb-25 px-1 md:px-1 w-full mx-auto">
            <p
              className="text-[16px] md:text-[18px] text-black leading-[2.2] uppercase tracking-[0.15em] text-justify font-bold px-10 md:px-20"
              style={{ textAlignLast: "center" }}
            >
              {t.pages.women.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="px-6 md:px-12 pt-10">
            <nav className="relative z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8 font-bold pointer-events-auto">
              <button
                type="button"
                className="hover:text-black transition-colors cursor-pointer"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                {(t.navigation.home || "HOME").toUpperCase()}
              </button>
              <FiChevronRight size={10} className="text-gray-300" />
              <button
                type="button"
                className="hover:text-black transition-colors cursor-pointer"
                onClick={() => {
                  setView("landing");
                  setSelectedCategory("");
                  setActiveSubFilter(VIEW_ALL_LABEL);
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                {t.menu.women.toUpperCase()}
              </button>
              <FiChevronRight size={10} className="text-gray-300" />
              <span className="text-black font-black select-none">
                {translate(displayTitle)}
              </span>
            </nav>
            <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-10 uppercase text-black">
              {translate(displayTitle)}
            </h2>
          </div>

          <div className="px-6 md:px-12 mb-8 flex flex-wrap gap-3">
            {Object.entries(activeFilters).map(([category, values]) =>
              values.map((val) => (
                <button
                  key={`${category}-${val}`}
                  onClick={() => handleFilterToggle(category, val)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest hover:border-black transition-all"
                >
                  <span>
                    {getFilterTitle(category)}: {translate(val)}
                  </span>
                  <FiX size={12} />
                </button>
              )),
            )}
            {activeSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest hover:border-black transition-all"
              >
                <span>
                  {getFilterTitle("TALLA")}: {size}
                </span>
                <FiX size={12} />
              </button>
            ))}
            {priceRange < 2000 && (
              <button
                onClick={() => setPriceRange(2000)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest hover:border-black transition-all"
              >
                <span>
                  {getFilterTitle("PRECIO")}: {translate("HASTA")} ${priceRange}
                </span>
                <FiX size={12} />
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest hover:border-black transition-all"
              >
                <span>
                  {getFilterTitle("BUSQUEDA")}: {searchTerm}
                </span>
                <FiX size={12} />
              </button>
            )}
            {sortBy && (
              <button
                onClick={() => setSortBy("")}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest hover:border-black transition-all"
              >
                <span>
                  {getFilterTitle("ORDEN")}:{" "}
                  {sortBy === "low"
                    ? t.common.priceLowHigh.toUpperCase()
                    : sortBy === "high"
                      ? t.common.priceHighLow.toUpperCase()
                      : sortBy === "az"
                        ? translate("NOMBRE: A-Z")
                        : sortBy === "za"
                          ? translate("NOMBRE: Z-A")
                          : sortBy === "newest"
                            ? translate("MÁS NUEVOS")
                            : sortBy === "range1"
                              ? translate("PRECIO: < $500")
                              : sortBy === "range2"
                                ? translate("PRECIO: $500-$1000")
                                : translate("PRECIO: > $1000")}
                </span>
                <FiX size={12} />
              </button>
            )}
            {(Object.keys(activeFilters).length > 0 ||
              activeSizes.length > 0 ||
              priceRange < 2000 ||
              searchTerm ||
              sortBy) && (
              <button
                onClick={handleResetFilters}
                className="text-[9px] font-black uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-colors ml-2"
              >
                {translate("LIMPIAR TODO")}
              </button>
            )}
          </div>

          <div className="px-6 md:px-12 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-y border-gray-100 py-6">
              <div className="flex flex-wrap items-center gap-6">
                <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase whitespace-nowrap">
                  {filteredProducts.length} {translate("ARTÍCULOS")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {categories.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveSubFilter(tag.toUpperCase());
                        setCurrentPage(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`px-4 py-2 text-[9px] font-bold tracking-widest border transition-all uppercase whitespace-nowrap ${
                        activeSubFilter === tag.toUpperCase()
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
                      }`}
                    >
                      {tag === VIEW_ALL_LABEL
                        ? translate("VER TODO")
                        : translate(tag.replace(/_/g, " "))}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3 border-b border-gray-200 focus-within:border-black transition-all pb-1">
                  <FiSearch className="text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder={translate("BUSCAR...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-[10px] font-black tracking-widest uppercase w-32 md:w-48 placeholder:text-gray-300"
                  />
                </div>

                <div className="relative group border-b border-transparent hover:border-black transition-all">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-8 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-black"
                  >
                    <option value="">{t.common.sortBy}</option>
                    <optgroup label={t.filters?.sortBy || "SORT BY"}>
                      <option value="low">{t.common.priceLowHigh}</option>
                      <option value="high">{t.common.priceHighLow}</option>
                      <option value="az">{translate("NOMBRE: A-Z")}</option>
                      <option value="za">{translate("NOMBRE: Z-A")}</option>
                      <option value="newest">{translate("MÁS NUEVOS")}</option>
                    </optgroup>
                    <optgroup label={translate("RANGOS DE PRECIO")}>
                      <option value="range1">
                        {translate("MENOS DE $500")}
                      </option>
                      <option value="range2">$500 - $1000</option>
                      <option value="range3">
                        {translate("MÁS DE $1000")}
                      </option>
                    </optgroup>
                  </select>
                  <FiChevronRight
                    className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                    size={12}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-3 border border-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  <FiFilter /> {t.common.filter}
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-12 pb-20">
            {currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
                  {currentItems.map((product: Product) => (
                    <ProductCard
                      key={String(product.id)}
                      id={String(product.id)}
                      name={product.name
                        .replace("MUJER_", "")
                        .replace("HOMBRE_", "")
                        .replace(/_/g, " ")}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      image={product.image}
                      onSale={product.onSale}
                      category={product.category || "women"}
                      type={product.type || selectedCategory}
                      originContext={{
                        page: "women",
                        category: selectedCategory,
                        type: product.type || selectedCategory,
                        filters: {
                          activeSubFilter,
                          priceRange,
                          activeSizes,
                          activeFilters,
                          searchTerm,
                          sortBy,
                        },
                        pageNumber: currentPage,
                        returnPath: `/women?category=${selectedCategory}`,
                      }}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col items-center mt-32 space-y-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-4 disabled:opacity-10 hover:opacity-70"
                      >
                        <FiChevronLeft />
                      </button>
                      <div className="flex gap-4">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${
                              currentPage === i + 1
                                ? "bg-black text-white"
                                : "text-gray-400 hover:text-black"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-4 disabled:opacity-10 hover:opacity-70"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                    <div className="w-48 h-[1px] bg-gray-100 relative">
                      <div
                        className="absolute h-full bg-black transition-all duration-500"
                        style={{
                          width: `${(currentPage / totalPages) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-40 text-center animate-in fade-in duration-1000">
                <p className="text-gray-400 uppercase tracking-widest text-[10px] font-serif italic mb-4">
                  {t.common.noProductsFound}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-black border-b border-black pb-1 uppercase tracking-widest"
                >
                  {translate("VER TODO")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[500] transition-opacity duration-500 ${showFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowFilters(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white z-[510] shadow-2xl transition-transform duration-700 ease-in-out ${showFilters ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-10 flex justify-between items-center border-b border-gray-100">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
              {t.common.filter}
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="hover:rotate-90 transition-transform duration-300"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-6 space-y-2">
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleSection("PRECIO")}
                className="w-full py-6 flex justify-between items-center group"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                  {getFilterTitle("PRECIO")}
                </span>
                <FiPlus
                  className={`text-gray-400 transition-transform duration-300 ${openSections.includes("PRECIO") ? "rotate-45" : ""}`}
                  size={14}
                />
              </button>

              {openSections.includes("PRECIO") && (
                <div className="pb-8 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {getFilterTitle("PRECIO")}
                      </span>
                      <span className="font-serif italic text-lg text-black">
                        ${priceRange}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange}
                      onChange={(e) => {
                        setPriceRange(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full h-1 bg-gray-100 accent-black appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-gray-300">
                      <span>$0</span>
                      <span>$2000</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleSection("TALLA")}
                className="w-full py-6 flex justify-between items-center group"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                  {getFilterTitle("TALLA")}
                </span>
                <FiPlus
                  className={`text-gray-400 transition-transform duration-300 ${openSections.includes("TALLA") ? "rotate-45" : ""}`}
                  size={14}
                />
              </button>

              {openSections.includes("TALLA") && (
                <div className="pb-8 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {getFilterTitle("TALLA")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {["XS", "S", "M", "L", "XL"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSizeToggle(s)}
                          className={`w-14 h-14 text-[10px] font-bold border transition-all duration-300 ${
                            activeSizes.includes(s)
                              ? "bg-black text-white border-black"
                              : "border-gray-100 text-gray-400 hover:border-black hover:text-black"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(CATALOG_FILTERS[selectedCategory] || CATALOG_FILTERS.DEFAULT).map(
              (filterKey) => {
                const filterOptions =
                  FILTER_OPTIONS[filterKey as keyof typeof FILTER_OPTIONS];
                if (!filterOptions) return null;

                return (
                  <div key={filterKey} className="border-b border-gray-100">
                    <button
                      onClick={() => toggleSection(filterKey)}
                      className="w-full py-6 flex justify-between items-center group"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                        {getFilterTitle(filterKey)}
                      </span>
                      <FiPlus
                        className={`text-gray-400 transition-transform duration-300 ${openSections.includes(filterKey) ? "rotate-45" : ""}`}
                        size={14}
                      />
                    </button>

                    {openSections.includes(filterKey) && (
                      <div className="pb-8 space-y-3 animate-in fade-in slide-in-from-top-2">
                        {filterOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={
                                activeFilters[filterKey]?.includes(option) ||
                                false
                              }
                              onChange={() =>
                                handleFilterToggle(filterKey, option)
                              }
                              className="w-4 h-4 border-gray-300 rounded accent-black"
                            />
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-black uppercase">
                              {translate(option) || option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          <div className="p-10 bg-gray-50 grid grid-cols-2 gap-4">
            <button
              onClick={handleResetFilters}
              className="py-5 text-[10px] font-bold uppercase border bg-white hover:bg-black hover:text-white transition-all"
            >
              {t.common.reset}
            </button>
            <button
              onClick={() => {
                setShowFilters(false);
                setCurrentPage(1);
              }}
              disabled={filteredProducts.length === 0}
              className={`py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 ${
                filteredProducts.length > 0
                  ? "bg-black text-white hover:bg-zinc-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {filteredProducts.length > 0
                ? `${translate("VER")} ${filteredProducts.length} ${translate("PRODUCTOS")}`
                : t.common.noProductsFound}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Women;
