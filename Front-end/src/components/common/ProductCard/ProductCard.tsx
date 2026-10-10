import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useLocale } from "../../../context/LocaleContext";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import corazonIcon from "../../../assets/icons/corazon.png";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHover?: string;
  oldPrice?: number;
  onSale?: boolean;
  category?: string;
  type?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  originContext?: {
    page?: string;
    category?: string;
    type?: string;
    filters?: any;
    pageNumber?: number;
    returnPath?: string;
  };
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  imageHover,
  oldPrice,
  onSale,
  category,
  type,
  isFavorite,
  originContext,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite: isProductFavorite } = useWishlist();
  const { locale } = useLocale();
  const currency = locale.currency;

  const favorite =
    isFavorite !== undefined ? isFavorite : isProductFavorite(id);
  const sizes = ["XXS", "XS", "S", "M", "L", "XL"];

  const getCurrencySymbol = () => {
    if (currency?.includes("PEN")) return "S/";
    if (currency?.includes("EUR")) return "€";
    if (currency?.includes("USD")) return "$";
    if (currency?.includes("MXN")) return "$";
    return "$";
  };

  const formatPrice = (amount: number) => {
    const symbol = getCurrencySymbol();
    return `${symbol} ${amount.toFixed(2)}`;
  };

  const handleProductClick = () => {
    navigate(`/product/${id}`, {
      state: {
        returnPath: location.pathname + location.search,
        category: category || determineCategoryFromPath(),
        type: type || "",
        originContext: originContext || {
          page: determinePageFromPath(),
          category: category || determineCategoryFromPath(),
          type: type || "",
          pageNumber: 1,
        },
      },
    });
  };
  const determineCategoryFromPath = () => {
    const path = location.pathname;

    if (path.includes("/women")) return "women";
    if (path.includes("/men")) return "men";
    if (path.includes("/events")) return "events";
    if (path.includes("/collection")) return "collection";
    if (path.includes("/sales")) return "sales";
    return category || "";
  };
  const determinePageFromPath = () => {
    const path = location.pathname;
    if (path.includes("/women")) return "women";
    if (path.includes("/men")) return "men";
    if (path.includes("/events")) return "events";
    if (path.includes("/collection")) return "collection";
    if (path.includes("/sales")) return "sales";
    if (path.includes("/")) return "home";

    return "home";
  };
  const handleAddToCart = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, image }, size);
    toast.success(`${name} añadido - Talla ${size}`, {
      style: {
        borderRadius: "0px",
        background: "#000",
        color: "#fff",
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
      },
    });
  };
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({ id, name, price, image });

    if (!favorite) {
      toast.success(`${name} a favoritos`, {
        icon: (
          <img src={corazonIcon} alt="Fav" className="w-5 h-5 object-contain" />
        ),
        duration: 2000,
        style: {
          borderRadius: "0px",
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e5e5",
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: "bold",
        },
      });
    }
  };
  const cleanName = name
    .replace("HOMBRE_", "")
    .replace("MUJER_", "")
    .replace(/_/g, " ");

  return (
    <div
      className="flex flex-col group mb-8 cursor-pointer"
      onClick={handleProductClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleProductClick()}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            isHovered && imageHover ? "opacity-0" : "opacity-100"
          }`}
        />
        {imageHover && (
          <img
            src={imageHover}
            alt={`${name} hover`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {onSale && oldPrice && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
            -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
          </div>
        )}
        {!isHovered && (
          <div className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-md z-10 pointer-events-none">
            <FiShoppingBag size={18} className="text-black" />
          </div>
        )}
        <div
          className={`absolute inset-0 flex flex-col justify-end transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/95 backdrop-blur-sm w-full py-6 px-2 transform translate-y-0 transition-transform duration-300">
            <p className="text-center text-[9px] font-black mb-3 uppercase tracking-[0.2em] text-gray-500">
              Añadir Talla
            </p>

            <div className="flex justify-center gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleAddToCart(size, e)}
                  className="border border-gray-200 text-[10px] font-bold py-2 px-1 min-w-[38px] bg-white hover:bg-black hover:text-white transition-all uppercase"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 leading-tight">
            {cleanName}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            {oldPrice && onSale ? (
              <>
                <span className="text-[13px] font-black">
                  {formatPrice(price)}
                </span>
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(oldPrice)}
                </span>
              </>
            ) : (
              <span className="text-[13px] font-black">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="text-gray-400 hover:text-black transition-all duration-300 pt-1"
        >
          <FiHeart
            size={20}
            fill={favorite ? "black" : "none"}
            className={favorite ? "text-black scale-110" : "text-gray-400"}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
