import { useState, useMemo, useEffect } from "react";
import { products } from "../../data/products";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import {
  FiChevronRight,
  FiChevronLeft,
  FiSearch,
  FiX,
  FiFilter,
  FiPlus,
} from "react-icons/fi";
import { CATALOG_CONFIG } from "../../constants/catalogConfig";
import { Link } from "react-router-dom";
import { translations } from "../../data/translations";
import { useLocale } from "../../context/LocaleContext";

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

const FILTER_OPTIONS = {
  COLORES: ["NEGRO", "BLANCO", "AZUL MARINO", "GRIS", "BEIGE", "VERDE OLIVA"],
  MATERIAL: ["ALGODÓN", "LINO", "LANA", "DENIM", "CUERO", "POLIÉSTER"],
  COLECCION: ["PRIMAVERA/VERANO", "OTOÑO/INVIERNO", "COLECCIÓN ESPECIAL"],
  AJUSTE: ["SLIM FIT", "REGULAR FIT", "OVERSIZED", "TAILORED"],
  TIPO_PRODUCTO: ["DENIM", "LINO", "CUERO", "ALGODÓN", "TWEED"],
  OCASION: ["CASUAL", "STREETWEAR", "FORMAL", "WORKWEAR", "EVENTOS", "MINIMAL"],
};

const CATALOG_FILTERS: Record<string, string[]> = {
  SALES: ["COLORES", "OCASION", "MATERIAL", "COLECCION"],
  DEFAULT: ["COLORES", "OCASION", "MATERIAL", "COLECCION"],
};

const CATALOG_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    COLORES: "COLORS",
    MATERIAL: "MATERIAL",
    COLECCION: "COLLECTION",
    AJUSTE: "FIT",
    TIPO_PRODUCTO: "PRODUCT TYPE",
    OCASION: "OCCASION",
    PRECIO: "PRICE",
    TALLA: "SIZE",
    ORDEN: "SORT",
    BUSQUEDA: "SEARCH",
    FILTRAR: "FILTER",
    "BUSCAR...": "SEARCH...",
    NEGRO: "BLACK",
    BLANCO: "WHITE",
    "AZUL MARINO": "NAVY BLUE",
    GRIS: "GRAY",
    BEIGE: "BEIGE",
    "VERDE OLIVA": "OLIVE GREEN",
    ALGODÓN: "COTTON",
    LINO: "LINEN",
    LANA: "WOOL",
    DENIM: "DENIM",
    CUERO: "LEATHER",
    POLIÉSTER: "POLYESTER",
    "PRIMAVERA/VERANO": "SPRING/SUMMER",
    "OTOÑO/INVIERNO": "FALL/WINTER",
    "COLECCIÓN ESPECIAL": "SPECIAL COLLECTION",
    "SLIM FIT": "SLIM FIT",
    "REGULAR FIT": "REGULAR FIT",
    OVERSIZED: "OVERSIZED",
    TAILORED: "TAILORED",
    TWEED: "TWEED",
    CASUAL: "CASUAL",
    STREETWEAR: "STREETWEAR",
    FORMAL: "FORMAL",
    WORKWEAR: "WORKWEAR",
    EVENTOS: "EVENTS",
    MINIMAL: "MINIMAL",
    "MÁS NUEVOS": "NEWEST",
    HASTA: "UP TO",
    "LIMPIAR TODO": "CLEAR ALL",
    "VER TODO": "VIEW ALL",
    ARTÍCULOS: "ITEMS",
    VER: "SEE",
    PRODUCTOS: "PRODUCTS",
    DESCUENTO: "DISCOUNT",
    LIQUIDACIÓN: "LIQUIDATION",
    "OFERTAS ESPECIALES": "SPECIAL OFFERS",
    "RANGOS DE PRECIO": "PRICE RANGES",
    "MENOS DE $500": "UNDER $500",
    "MÁS DE $1000": "OVER $1000",
    "PRECIO: < $500": "PRICE: < $500",
    "PRECIO: $500-$1000": "PRICE: $500-$1000",
    "PRECIO: > $1000": "PRICE: > $1000",
    "NOMBRE: A-Z": "NAME: A-Z",
    "NOMBRE: Z-A": "NAME: Z-A",
    ITEMS: "ITEMS",
    "BORRAR TODO": "CLEAR ALL",
    "SIN RESULTADOS": "NO RESULTS",
    "Rango de Precio": "Price Range",
    "Tallas Disponibles": "Available Sizes",
    "ORDENAR POR": "SORT BY",
    BUSCAR: "SEARCH",
    TALLAS: "SIZES",
    OFERTAS: "SALES",
    "EN OFERTA": "ON SALE",
    POLOS: "POLOS",
    BODY: "BODY",
    "CORSÉS Y BUSTIER": "CORSETS & BUSTIER",
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
    PALAZZO: "PALAZZO",
    JOGGER: "JOGGER",
    RECTOS: "STRAIGHT",
    "WIDE LEG": "WIDE LEG",
    FLARE: "FLARE",
    MAXI: "MAXI",
    MINI: "MINI",
    FIESTA: "PARTY",
    CHALECOS: "VESTS",
    PINZAS: "DARTED",
    STRETCH: "STRETCH",
    LINEN: "LINEN",
    SLIM: "SLIM",
    CLASSIC: "CLASSIC",
    MODERN: "MODERN",
    POLERAS: "SWEATERS",
    ABRIGOS: "COATS",
    MIDI: "MIDI",
    CAMISEROS: "SHIRT DRESSES",
    SATINADOS: "SATIN",
    AJUSTADO: "FITTED",
    VAQUEROS: "DENIM",
    TOPS: "TOPS",
    BOTTOMS: "BOTTOMS",
    OUTERWEAR: "OUTERWEAR",
    CONJUNTOS: "SETS",
    DEPORTIVOS: "SPORTSWEAR",
    "NOVEDADES MUJER": "WOMEN'S NEW ARRIVALS",
    "NOVEDADES HOMBRE": "MEN'S NEW ARRIVALS",
    ACCESORIOS: "ACCESSORIES",
    "EDICIÓN LIMITADA": "LIMITED EDITION",
    TENDENCIAS: "TRENDS",
    "RECIÉN LLEGADOS": "JUST ARRIVED",
    DESTACADOS: "FEATURED",
    SUITS: "SUITS",
    ENSEMBLES: "ENSEMBLES",
    "COORDINATED SETS": "COORDINATED SETS",
    "LOOKS CASUALES": "CASUAL LOOKS",
    "LOOKS ELEGANTES": "ELEGANT LOOKS",
    "LOOKS DE OFICINA": "OFFICE LOOKS",
    "LOOKS DE NOCHE": "NIGHT LOOKS",
    "BEACH WEAR": "BEACH WEAR",
    "TELAS LIGERAS": "LIGHT FABRICS",
    "COLORES VIVOS": "BRIGHT COLORS",
    "VACATION LOOKS": "VACATION LOOKS",
    "T-SHIRTS": "T-SHIRTS",
    SWEATERS: "SWEATERS",
    HOODIES: "HOODIES",
    "LOOK DIARIO": "DAILY LOOK",
    COMFY: "COMFY",
    JACKETS: "JACKETS",
    SNEAKERS: "SNEAKERS",
    PANTS: "PANTS",
    "URBAN LOOK": "URBAN LOOK",
    TRENDY: "TRENDY",
    "VESTIDOS ELEGANTES": "ELEGANT DRESSES",
    TRAJES: "SUITS",
    CAMISAS: "SHIRTS",
    "PANTALONES DE VESTIR": "DRESS PANTS",
    OFICINA: "OFFICE",
    NOCHE: "NIGHT",
    URBAN: "URBAN",
    "COMFY FIT": "COMFY FIT",
    "TREND LOOK": "TREND LOOK",
    "STREET STYLE": "STREET STYLE",
    "DAILY LOOK": "DAILY LOOK",
    "COLORES NEUTROS": "NEUTRAL COLORS",
    "LÍNEAS LIMPIAS": "CLEAN LINES",
    TIMELESS: "TIMELESS",
    "INVITADA DE BODA": "WEDDING GUEST",
    NOVIAS: "BRIDES",
    "BAUTIZOS Y COMUNIONES": "BAPTISMS & COMMUNIONS",
    GRADUACIONES: "GRADUATIONS",
    "FALDAS Y PANTALONES": "SKIRTS & PANTS",
    CHALES: "SHAWLS",
  },
  es: {
    COLORS: "COLORES",
    MATERIAL: "MATERIAL",
    COLLECTION: "COLECCIÓN",
    FIT: "AJUSTE",
    "PRODUCT TYPE": "TIPO DE PRODUCTO",
    OCCASION: "OCASIÓN",
    PRICE: "PRECIO",
    SIZE: "TALLA",
    SORT: "ORDEN",
    SEARCH: "BUSCAR",
    FILTER: "FILTRAR",
    BLACK: "NEGRO",
    WHITE: "BLANCO",
    "NAVY BLUE": "AZUL MARINO",
    GRAY: "GRIS",
    "OLIVE GREEN": "VERDE OLIVA",
    COTTON: "ALGODÓN",
    LINEN: "LINO",
    WOOL: "LANA",
    LEATHER: "CUERO",
    POLYESTER: "POLIÉSTER",
    "SPRING/SUMMER": "PRIMAVERA/VERANO",
    "FALL/WINTER": "OTOÑO/INVIERNO",
    "SPECIAL COLLECTION": "COLECCIÓN ESPECIAL",
    CASUAL: "CASUAL",
    STREETWEAR: "STREETWEAR",
    FORMAL: "FORMAL",
    WORKWEAR: "WORKWEAR",
    EVENTS: "EVENTOS",
    MINIMAL: "MINIMAL",
    "VIEW ALL": "VER TODO",
    "SEARCH...": "BUSCAR...",
    "CLEAR ALL": "LIMPIAR TODO",
    NEWEST: "MÁS NUEVOS",
    "NAME: A-Z": "NOMBRE: A-Z",
    "NAME: Z-A": "NOMBRE: Z-A",
    "PRICE RANGES": "RANGOS DE PRECIO",
    "UNDER $500": "MENOS DE $500",
    "OVER $1000": "MÁS DE $1000",
    ITEMS: "ARTÍCULOS",
    PRODUCTS: "PRODUCTOS",
    SEE: "VER",
    "UP TO": "HASTA",
    SALES: "OFERTAS",
    "ON SALE": "EN OFERTA",
    DISCOUNT: "DESCUENTO",
    LIQUIDATION: "LIQUIDACIÓN",
    "SPECIAL OFFERS": "OFERTAS ESPECIALES",
  },
};

const FILTER_TITLE_MAP: Record<string, string> = {
  COLORES: "colors",
  MATERIAL: "material",
  COLECCION: "collection",
  AJUSTE: "fit",
  TIPO_PRODUCTO: "productType",
  OCASION: "occasion",
  PRECIO: "priceRange",
  TALLA: "availableSizes",
  TALLAS: "availableSizes",
  BUSQUEDA: "search",
  ORDEN: "sort",
};

const Sales = () => {
  const { locale } = useLocale();
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const translate = (text: string): string => {
    if (!text || text.trim() === "") return "";
    const normalizedKey = text.toUpperCase().replace(/_/g, " ").trim();
    const specialCases: Record<string, string> = {
      "VER TODO": language === "en" ? "VIEW ALL" : "VER TODO",
      "VIEW ALL": language === "en" ? "VIEW ALL" : "VER TODO",
      "BUSCAR...": language === "en" ? "SEARCH..." : "BUSCAR...",
      BUSCAR: language === "en" ? "SEARCH" : "BUSCAR",
      "LIMPIAR TODO": language === "en" ? "CLEAR ALL" : "LIMPIAR TODO",
      "CLEAR ALL": language === "en" ? "CLEAR ALL" : "LIMPIAR TODO",
      "MÁS NUEVOS": language === "en" ? "NEWEST" : "MÁS NUEVOS",
      NEWEST: language === "en" ? "NEWEST" : "MÁS NUEVOS",
      "NOMBRE: A-Z": language === "en" ? "NAME: A-Z" : "NOMBRE: A-Z",
      "NAME: A-Z": language === "en" ? "NAME: A-Z" : "NOMBRE: A-Z",
      "NOMBRE: Z-A": language === "en" ? "NAME: Z-A" : "NOMBRE: Z-A",
      "NAME: Z-A": language === "en" ? "NAME: Z-A" : "NOMBRE: Z-A",
      "RANGOS DE PRECIO":
        language === "en" ? "PRICE RANGES" : "RANGOS DE PRECIO",
      "PRICE RANGES": language === "en" ? "PRICE RANGES" : "RANGOS DE PRECIO",
      "MENOS DE $500": language === "en" ? "UNDER $500" : "MENOS DE $500",
      "UNDER $500": language === "en" ? "UNDER $500" : "MENOS DE $500",
      "MÁS DE $1000": language === "en" ? "OVER $1000" : "MÁS DE $1000",
      "OVER $1000": language === "en" ? "OVER $1000" : "MÁS DE $1000",
      "PRECIO: < $500": language === "en" ? "PRICE: < $500" : "PRECIO: < $500",
      "PRECIO: $500-$1000":
        language === "en" ? "PRICE: $500-$1000" : "PRECIO: $500-$1000",
      "PRECIO: > $1000":
        language === "en" ? "PRICE: > $1000" : "PRECIO: > $1000",
      ARTÍCULOS: language === "en" ? "ITEMS" : "ARTÍCULOS",
      ITEMS: language === "en" ? "ITEMS" : "ARTÍCULOS",
      PRODUCTOS: language === "en" ? "PRODUCTS" : "PRODUCTOS",
      PRODUCTS: language === "en" ? "PRODUCTS" : "PRODUCTOS",
      VER: language === "en" ? "SEE" : "VER",
      SEE: language === "en" ? "SEE" : "VER",
      HASTA: language === "en" ? "UP TO" : "HASTA",
      "UP TO": language === "en" ? "UP TO" : "HASTA",
      "$500 - $1000": language === "en" ? "$500 - $1000" : "$500 - $1000",
      TALLAS: language === "en" ? "SIZES" : "TALLAS",
      OFERTAS: language === "en" ? "SALES" : "OFERTAS",
      SALES: language === "en" ? "SALES" : "OFERTAS",
      "EN OFERTA": language === "en" ? "ON SALE" : "EN OFERTA",
      DESCUENTO: language === "en" ? "DISCOUNT" : "DESCUENTO",
      LIQUIDACIÓN: language === "en" ? "LIQUIDATION" : "LIQUIDACIÓN",
      "OFERTAS ESPECIALES":
        language === "en" ? "SPECIAL OFFERS" : "OFERTAS ESPECIALES",
    };

    if (specialCases[normalizedKey]) {
      return specialCases[normalizedKey];
    }

    if (
      CATALOG_TRANSLATIONS[language] &&
      CATALOG_TRANSLATIONS[language][normalizedKey]
    ) {
      return CATALOG_TRANSLATIONS[language][normalizedKey];
    }

    if (language === "es") {
      return text;
    }

    const otherLang = language === "en" ? "es" : "en";
    if (CATALOG_TRANSLATIONS[otherLang]) {
      const invertedEntry = Object.entries(
        CATALOG_TRANSLATIONS[otherLang],
      ).find(([_, value]) => value.toUpperCase() === normalizedKey);
      if (invertedEntry) {
        return CATALOG_TRANSLATIONS[language][invertedEntry[0]] || text;
      }
    }
    if (language === "en") {
      if (t.catalog?.filters) {
        for (const value of Object.values(t.catalog.filters)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }
      if (t.catalog?.options) {
        for (const value of Object.values(t.catalog.options)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }
      if (t.catalog?.labels) {
        for (const value of Object.values(t.catalog.labels)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }
      if (t.filters) {
        for (const value of Object.values(t.filters)) {
          if (
            typeof value === "string" &&
            value.toUpperCase() === normalizedKey
          ) {
            return value;
          }
        }
      }

      if (t.categories) {
        for (const [_, categoryObj] of Object.entries(t.categories)) {
          if (typeof categoryObj === "object") {
            for (const [_, value] of Object.entries(categoryObj)) {
              if (
                typeof value === "string" &&
                value.toUpperCase() === normalizedKey
              ) {
                return value;
              }
            }
          }
        }
      }
    }

    return text;
  };

  const getFilterTitle = (filterKey: string): string => {
    const mappedKey = FILTER_TITLE_MAP[filterKey];

    if (mappedKey) {
      if (
        t.catalog?.filters &&
        t.catalog.filters[mappedKey as keyof typeof t.catalog.filters]
      ) {
        const filterValue =
          t.catalog.filters[mappedKey as keyof typeof t.catalog.filters];
        if (filterValue && typeof filterValue === "string") {
          return filterValue.toUpperCase();
        }
      }

      if (t.filters && t.filters[mappedKey as keyof typeof t.filters]) {
        const filterValue = t.filters[mappedKey as keyof typeof t.filters];
        if (filterValue && typeof filterValue === "string") {
          return filterValue.toUpperCase();
        }
      }

      if (t.common && t.common[mappedKey as keyof typeof t.common]) {
        const commonValue = t.common[mappedKey as keyof typeof t.common];
        if (commonValue && typeof commonValue === "string") {
          return commonValue.toUpperCase();
        }
      }
    }

    return translate(filterKey);
  };

  const compareTags = (tag: string, filterValue: string): boolean => {
    const normalizedTag = tag.toUpperCase().trim();
    const normalizedFilter = filterValue.toUpperCase().trim();

    if (
      normalizedTag === normalizedFilter ||
      normalizedTag.includes(normalizedFilter)
    ) {
      return true;
    }

    const translatedTag = translate(tag).toUpperCase();
    if (
      translatedTag === normalizedFilter ||
      translatedTag.includes(normalizedFilter)
    ) {
      return true;
    }
    const translatedFilter = translate(filterValue).toUpperCase();
    if (
      normalizedTag === translatedFilter ||
      normalizedTag.includes(translatedFilter)
    ) {
      return true;
    }
    const englishTag = CATALOG_TRANSLATIONS.en?.[normalizedTag];
    if (englishTag && englishTag.toUpperCase() === normalizedFilter) {
      return true;
    }
    const spanishTag = CATALOG_TRANSLATIONS.es?.[normalizedFilter];
    if (spanishTag && spanishTag.toUpperCase() === normalizedTag) {
      return true;
    }
    const tagWords = normalizedTag.split(/[\s_]+/);
    const filterWords = normalizedFilter.split(/[\s_]+/);
    if (
      filterWords.some((word) =>
        tagWords.some((tagWord) => tagWord.includes(word)),
      )
    ) {
      return true;
    }

    return false;
  };
  const VIEW_ALL_LABEL = (t.common.viewAllProducts || "VER TODO").toUpperCase();
  const [activeSubFilter, setActiveSubFilter] = useState(VIEW_ALL_LABEL);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>(["PRECIO"]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const itemsPerPage = 12;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    const rawTags = CATALOG_CONFIG.SALES || [];
    const filteredTags = rawTags.filter(
      (tag: string) =>
        !tag.toUpperCase().includes("VER TODO") &&
        !tag.toUpperCase().includes("VIEW ALL"),
    );

    const translatedTags = filteredTags.map((tag) => translate(tag));
    return [VIEW_ALL_LABEL, ...translatedTags];
  }, [VIEW_ALL_LABEL, language]);

  const saleProducts = useMemo(() => {
    const productsArray = Array.isArray(products) ? products : [];

    let result = productsArray.filter((p: Product) => {
      const hasDiscount =
        p.onSale === true || (p.oldPrice && p.oldPrice > p.price);

      if (!hasDiscount) return false;

      const matchesSubFilter =
        activeSubFilter === VIEW_ALL_LABEL
          ? true
          : compareTags(p.type || "", activeSubFilter) ||
            (p.tags?.some((tag: string) => compareTags(tag, activeSubFilter)) ??
              false) ||
            (p.category
              ?.toUpperCase()
              .includes(activeSubFilter.toUpperCase()) ??
              false);

      if (!matchesSubFilter) return false;

      const matchesSearch = searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      if (!matchesSearch) return false;

      const matchesPrice = p.price <= priceRange;
      if (!matchesPrice) return false;

      const matchesSize =
        activeSizes.length > 0
          ? activeSizes.some((s) => p.sizes?.includes(s))
          : true;

      if (!matchesSize) return false;
      const matchesDynamicFilters = Object.entries(activeFilters).every(
        ([_, selectedValues]) => {
          if (selectedValues.length === 0) return true;

          return selectedValues.some((value) => {
            if (p.tags?.some((tag: string) => compareTags(tag, value))) {
              return true;
            }

            if (p.type && compareTags(p.type, value)) {
              return true;
            }

            if (p.category && compareTags(p.category, value)) {
              return true;
            }

            return false;
          });
        },
      );

      if (!matchesDynamicFilters) return false;
      let matchesRange = true;
      if (sortBy === "range1") matchesRange = p.price < 500;
      if (sortBy === "range2") matchesRange = p.price >= 500 && p.price <= 1000;
      if (sortBy === "range3") matchesRange = p.price > 1000;

      return matchesRange;
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
    activeSubFilter,
    searchTerm,
    sortBy,
    priceRange,
    activeSizes,
    activeFilters,
    VIEW_ALL_LABEL,
    language,
  ]);

  const totalPages = Math.ceil(saleProducts.length / itemsPerPage);
  const currentItems = saleProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSortByText = (sortValue: string): string => {
    switch (sortValue) {
      case "low":
        return t.common.priceLowHigh.toUpperCase();
      case "high":
        return t.common.priceHighLow.toUpperCase();
      case "az":
        return translate("NOMBRE: A-Z");
      case "za":
        return translate("NOMBRE: Z-A");
      case "newest":
        return translate("MÁS NUEVOS");
      case "range1":
        return translate("PRECIO: < $500");
      case "range2":
        return translate("PRECIO: $500-$1000");
      case "range3":
        return translate("PRECIO: > $1000");
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[120px]">
      <div className="px-6 md:px-12 pt-10">
        <nav className="relative z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8 font-bold pointer-events-auto">
          <Link
            to="/"
            className="text-gray-400 hover:text-black transition-colors duration-300 cursor-pointer"
          >
            {String(t.navigation?.home || "HOME").toUpperCase()}
          </Link>
          <FiChevronRight size={10} className="text-gray-300" />
          <span className="text-black font-black uppercase">
            {t.menu.sales.toUpperCase()}
          </span>
        </nav>

        <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-10 uppercase text-black">
          {t.menu.sales}
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
              {getFilterTitle("ORDEN")}: {getSortByText(sortBy)}
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
              {saleProducts.length} {translate("ARTÍCULOS")}{" "}
              {translate("EN OFERTA")}
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
                  {tag}
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
                <optgroup label={translate("ORDENAR POR")}>
                  <option value="low">{t.common.priceLowHigh}</option>
                  <option value="high">{t.common.priceHighLow}</option>
                  <option value="az">{translate("NOMBRE: A-Z")}</option>
                  <option value="za">{translate("NOMBRE: Z-A")}</option>
                  <option value="newest">{translate("MÁS NUEVOS")}</option>
                </optgroup>
                <optgroup label={translate("RANGOS DE PRECIO")}>
                  <option value="range1">{translate("MENOS DE $500")}</option>
                  <option value="range2">{translate("$500 - $1000")}</option>
                  <option value="range3">{translate("MÁS DE $1000")}</option>
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
      <div className="px-6 md:px-12 pb-20 animate-in fade-in duration-700">
        {currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
              {currentItems.map((product: Product) => (
                <ProductCard
                  key={String(product.id)}
                  id={String(product.id)}
                  name={product.name
                    .replace("HOMBRE_", "")
                    .replace("MUJER_", "")
                    .replace(/_/g, " ")}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  onSale={
                    product.onSale ||
                    Boolean(
                      product.oldPrice && product.oldPrice > product.price,
                    )
                  }
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
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center">
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-serif italic mb-4">
              {t.common.noProductsFound || "No hay productos en oferta"}
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
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[500] transition-opacity duration-500 ${
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowFilters(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white z-[510] shadow-2xl transition-transform duration-700 ease-in-out ${
          showFilters ? "translate-x-0" : "translate-x-full"
        }`}
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

            {(CATALOG_FILTERS.SALES || CATALOG_FILTERS.DEFAULT).map(
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
                      <div className="pb-8 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-4 pt-2">
                          {filterOptions.map((option) => {
                            const isChecked =
                              activeFilters[filterKey]?.includes(option);

                            return (
                              <label
                                key={option}
                                className="flex items-center gap-4 cursor-pointer group"
                                onClick={() =>
                                  handleFilterToggle(filterKey, option)
                                }
                              >
                                <div
                                  className={`w-5 h-5 border transition-all flex items-center justify-center ${
                                    isChecked
                                      ? "border-black bg-black"
                                      : "border-gray-200 group-hover:border-black"
                                  }`}
                                >
                                  {isChecked && (
                                    <div className="w-2 h-2 bg-white" />
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                    isChecked
                                      ? "text-black"
                                      : "text-gray-400 group-hover:text-black"
                                  }`}
                                >
                                  {translate(option)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
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
              {translate("BORRAR TODO")}
            </button>
            <button
              onClick={() => {
                setShowFilters(false);
                setCurrentPage(1);
              }}
              disabled={saleProducts.length === 0}
              className={`py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 ${
                saleProducts.length > 0
                  ? "bg-black text-white hover:bg-zinc-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saleProducts.length > 0
                ? `${translate("VER")} ${saleProducts.length} ${translate("PRODUCTOS")}`
                : translate("SIN RESULTADOS")}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sales;
