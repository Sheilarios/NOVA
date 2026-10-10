import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { FiHeart, FiTrash2, FiCheck, FiArrowRight } from "react-icons/fi";
import { translations } from "../../data/translations";
import { useLocale } from "../../context/LocaleContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Wishlist = () => {
  const { user, updateProfile } = useAuth();
  const { wishlistItems, toggleFavorite, isFavorite } = useWishlist();
  const { locale } = useLocale();
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  useEffect(() => {
    if (user?.favoritos && wishlistItems.length === 0) {
      console.log("User favorites:", user.favoritos);
    }
  }, [user, wishlistItems.length]);

  useEffect(() => {
    if (user && isUpdatingProfile) {
      const favoriteIds = wishlistItems.map((item) => item.id);

      try {
        updateProfile({ favoritos: favoriteIds });
        console.log("Favoritos actualizados en perfil");
      } catch (error: any) {
        console.error("Error updating favorites in profile:", error);
      } finally {
        setIsUpdatingProfile(false);
      }
    }
  }, [wishlistItems, user, isUpdatingProfile]);

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product);
    if (user) {
      setIsUpdatingProfile(true);
    }
  };
  const syncWishlistFromUserFavorites = async () => {
    if (!user?.favoritos) return;

    try {
      console.log(
        "Sincronizando wishlist con favoritos del usuario:",
        user.favoritos,
      );
    } catch (error) {
      console.error("Error syncing wishlist from user favorites:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleRemoveSelected = () => {
    const selectedProducts = wishlistItems.filter((item) =>
      selectedItems.includes(item.id),
    );

    selectedProducts.forEach((product) => {
      handleToggleFavorite(product);
    });

    setSelectedItems([]);
  };

  const handleSyncFromProfile = () => {
    syncWishlistFromUserFavorites();
  };

  const totalPrice = useMemo(() => {
    return wishlistItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.price || 0), 0);
  }, [wishlistItems, selectedItems]);

  const cleanProductName = (name: string) => {
    return name.replace("HOMBRE_", "").replace("MUJER_", "").replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-white mt-[120px] lg:mt-[160px] pb-20 relative z-10">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-[0.3em]">
          <Link to="/" className="hover:text-black transition-colors">
            {t.common?.home || "Inicio"}
          </Link>
          <span className="text-[8px] opacity-50">/</span>
          <span className="text-black">
            {t.pages?.wishlist?.yourSelection || "Wishlist"}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 pb-12 mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-black">
                {t.pages?.wishlist?.yourSelection || "Tu selección"}
                <FiHeart
                  className={
                    wishlistItems.length > 0
                      ? "inline-block ml-2 fill-black"
                      : "inline-block ml-2"
                  }
                  size={28}
                />
              </h1>
              {user && (
                <button
                  onClick={handleSyncFromProfile}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all"
                  title="Sincronizar con mi perfil"
                >
                  Sincronizar
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 tracking-[0.4em] font-bold uppercase">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
              {user && " • Guardado en tu perfil"}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-gray-400 hover:border-gray-200 transition-all"
            >
              {selectedItems.length === wishlistItems.length
                ? t.pages?.wishlist?.deselectAll || "Deseleccionar todos"
                : t.pages?.wishlist?.selectAll || "Seleccionar todos"}
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {selectedItems.length > 0 && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl bg-white border border-zinc-100 shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                    {selectedItems.length}{" "}
                    {t.pages?.wishlist?.selectedItems || "seleccionados"}
                  </span>
                  <span className="text-xl font-black">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={handleRemoveSelected}
                    className="flex-1 md:flex-none border border-zinc-200 px-6 py-4 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    {t.pages?.wishlist?.remove || "Eliminar"}
                  </button>
                  <button className="flex-1 md:flex-none bg-black text-white px-10 py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                    {t.pages?.wishlist?.addToBag || "Agregar a bolsa"}{" "}
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
              {wishlistItems.map((product) => {
                const isItemSelected = selectedItems.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="relative group animate-in fade-in duration-700"
                  >
                    <div
                      onClick={() => handleSelectItem(product.id)}
                      className={`absolute top-4 left-4 z-30 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        isItemSelected
                          ? "bg-black border-black text-white scale-110"
                          : "bg-white/80 border-zinc-200 text-transparent hover:border-black backdrop-blur-sm opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <FiCheck size={12} />
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-black hover:bg-red-500 hover:text-white shadow-sm"
                      title="Eliminar de favoritos"
                    >
                      <FiTrash2 size={14} />
                    </button>

                    <div
                      className={`transition-all duration-500 ${isItemSelected ? "opacity-40 grayscale-[0.5]" : ""}`}
                    >
                      <ProductCard
                        id={product.id}
                        name={cleanProductName(product.name)}
                        price={product.price}
                        image={product.image}
                        isFavorite={isFavorite(product.id)}
                        onToggleFavorite={() => handleToggleFavorite(product)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-40 bg-[#F9F9F9] flex flex-col items-center">
            <FiHeart className="text-gray-100 mb-8" size={60} />
            <h3 className="text-[12px] font-black mb-8 uppercase tracking-[0.4em] text-gray-400">
              {t.pages?.wishlist?.empty || "Tu wishlist está vacía"}
            </h3>
            {user?.favoritos && user.favoritos.length > 0 && (
              <button
                onClick={handleSyncFromProfile}
                className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-black transition-all"
              >
                Cargar favoritos de tu perfil ({user.favoritos.length})
              </button>
            )}
            <Link
              to="/collection"
              className="bg-black text-white px-14 py-4 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-800 transition-all"
            >
              {t.pages?.wishlist?.discover || "Descubrir productos"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
