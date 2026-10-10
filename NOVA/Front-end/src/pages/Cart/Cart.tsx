import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useLocale } from "../../context/LocaleContext";
import { translations } from "../../data/translations";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { locale } = useLocale();

  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const cartT = t.pages?.cart;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountRate = 0.2;
  const discount = subtotal * discountRate;
  const deliveryFee = subtotal > 0 ? 15.0 : 0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-white font-sans text-black mt-[120px] lg:mt-[160px] pb-20 relative z-10">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-[0.3em]">
          <Link to="/" className="hover:text-black transition-colors">
            Inicio
          </Link>
          <span className="text-[8px] opacity-50">/</span>
          <span className="text-black">{cartT?.yourBag || "Bolsa"}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-serif italic tracking-tighter mb-16 text-black">
          {cartT?.yourBag || "Tu Bolsa"}
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="border-t border-gray-100">
                {cartItems.map((item) => {
                  const cleanName = item.name
                    .replace("HOMBRE_", "")
                    .replace("MUJER_", "")
                    .replace(/_/g, " ");

                  return (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-6 py-8 border-b border-gray-100 group"
                    >
                      <div className="w-24 h-32 md:w-32 md:h-44 bg-[#F9F9F9] overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-1">
                              {cleanName}
                            </h3>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                              {"Talla"}: {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-gray-300 hover:text-black transition-colors"
                            aria-label="Eliminar"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-gray-200 px-4 py-2 gap-6">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity - 1,
                                )
                              }
                              className="hover:text-black text-gray-400 disabled:opacity-30"
                              disabled={item.quantity <= 1}
                              aria-label="Disminuir"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="font-bold text-[11px] min-w-[12px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity + 1,
                                )
                              }
                              className="hover:text-black text-gray-400"
                              aria-label="Aumentar"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <span className="text-lg font-black tracking-tighter">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#F9F9F9] p-10 sticky top-[180px]">
                <h2 className="text-[11px] font-black mb-10 uppercase tracking-[0.4em] border-b border-black/10 pb-4">
                  {cartT?.summary || "Resumen"}
                </h2>

                <div className="space-y-6">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
                    <span>{cartT?.subtotal || "Subtotal"}</span>
                    <span className="text-black font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[11px] uppercase tracking-widest text-red-500">
                      <span>{cartT?.discount || "Descuento"}</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-6">
                    <span>{cartT?.delivery || "Envío"}</span>
                    <span className="text-black font-bold">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xl font-black pt-4 uppercase tracking-tighter">
                    <span>{cartT?.total || "Total"}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
                  <Link
                    to="/checkout"
                    className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group uppercase tracking-[0.3em] text-[10px] font-bold"
                  >
                    {cartT?.checkout || "Finalizar compra"}
                    <FiArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link
                    to="/collection"
                    className="w-full border border-black text-black py-5 flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold"
                  >
                    {cartT?.continueShopping || "Seguir comprando"}
                  </Link>
                </div>

                <p className="mt-8 text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                  {cartT?.shippingNote || ""}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 bg-[#F9F9F9]">
            <FiShoppingBag
              className="mx-auto text-gray-200 mb-8 shadow-sm"
              size={60}
            />
            <h3 className="text-[12px] font-black mb-8 uppercase tracking-[0.4em] text-gray-400">
              {cartT?.empty || "Tu bolsa está vacía"}
            </h3>
            <Link
              to="/collection"
              className="inline-block bg-black text-white px-14 py-4 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-800 transition-all"
            >
              {cartT?.continueShopping || "Seguir comprando"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
