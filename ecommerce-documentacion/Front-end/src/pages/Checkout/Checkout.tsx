import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiChevronRight,
  FiChevronDown,
  FiCreditCard,
  FiSmartphone,
  FiLoader,
  FiCheck,
  FiDollarSign,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useLocale } from "../../context/LocaleContext";
import { translations } from "../../data/translations";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "yape" | "efectivo" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepConfirmed, setStepConfirmed] = useState(false);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = subtotal * 0.2;
  const deliveryFee = subtotal > 0 ? 15.0 : 0;
  const total = subtotal - discount + deliveryFee;

  const handleConfirmAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setStepConfirmed(true);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      navigate("/success", {
        state: {
          total: total.toFixed(2),
          cartItems: cartItems,
        },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black mt-[120px] pb-20 relative z-10">
      {isProcessing && (
        <div className="fixed inset-0 z-[500] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <FiLoader
              className="animate-spin text-[#0052FF] relative z-10"
              size={40}
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
            {t.checkout.processing}
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-8 font-bold uppercase tracking-widest">
          <Link to="/cart" className="hover:text-black">
            {t.checkout.navigation.bag}
          </Link>
          <FiChevronRight />
          <span className="text-black">{t.checkout.navigation.checkout}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <section className="flex justify-center items-center py-16 bg-white">
              <div className="bg-[#8B8365] p-10 md:p-12 rounded-sm shadow-2xl w-full max-w-[650px] text-black transition-all">
                <h2 className="text-center text-sm font-medium uppercase tracking-[0.4em] mb-12 text-white">
                  {t.checkout.shipping.title}
                </h2>

                <form onSubmit={handleConfirmAddress} className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                      {t.checkout.shipping.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                      {t.checkout.shipping.email}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/20 shadow-inner"
                    />
                  </div>

                  <div className="flex gap-6 items-end">
                    <div className="flex flex-col gap-3">
                      <label className="text-[14px] font-light uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.countryCode}
                      </label>
                      <div className="relative w-[50px] h-[40px]">
                        <select className="w-full h-full bg-white border-none rounded-sm text-center text-[13px] text-black outline-none cursor-pointer appearance-none shadow-inner p-0">
                          <option value="+51">PE +51</option>
                          <option value="+34">ES +34</option>
                          <option value="+1">US +1</option>
                          <option value="+52">MX +52</option>
                          <option value="+54">AR +54</option>
                        </select>
                        <div className="absolute right-1 bottom-1 pointer-events-none opacity-30">
                          <FiChevronDown size={10} className="text-black" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      <label className="text-[14px] font-light uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.phoneNumber}
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full h-[40px] bg-white border-none rounded-sm px-4 text-sm text-black outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.country}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.state}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.city}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[13px] font-bold uppercase tracking-[0.2em] text-white">
                        {t.checkout.shipping.district}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                      {t.checkout.shipping.fullAddress}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white italic opacity-90">
                      {t.checkout.shipping.additionalInstructions}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border-[3px] border-[#3B82F6] rounded-sm px-4 py-3 text-sm outline-none shadow-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-[45%]">
                    <label className="text-[13px] font-medium uppercase tracking-[0.2em] text-white">
                      {t.checkout.shipping.postalCode}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border-none rounded-sm px-4 py-3 text-sm outline-none shadow-inner"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="billing"
                      className="w-5 h-5 accent-black cursor-pointer rounded-none"
                    />
                    <label
                      htmlFor="billing"
                      className="text-[12px] font-medium text-white uppercase tracking-wider cursor-pointer"
                    >
                      {t.checkout.shipping.useForBilling}
                    </label>
                  </div>

                  <div className="pt-8 flex justify-center">
                    <button
                      type="submit"
                      className={`w-full py-5 text-xs font-medium uppercase tracking-[0.5em] transition-all rounded-sm shadow-xl ${
                        stepConfirmed
                          ? "bg-green-600 text-white"
                          : "bg-black text-white hover:bg-zinc-900"
                      }`}
                    >
                      {stepConfirmed ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiCheck /> {t.checkout.shipping.confirmed}
                        </span>
                      ) : (
                        t.checkout.shipping.confirmButton
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section
              className={`space-y-6 transition-all duration-700 ${!stepConfirmed ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                  {t.checkout.payment.chooseMethod}
                </h2>
                {!stepConfirmed && (
                  <span className="text-[9px] font-bold bg-zinc-100 text-zinc-400 px-3 py-1 tracking-[0.2em] rounded-full animate-pulse">
                    {t.checkout.payment.locked}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`bg-[#F0F0F0] p-6 rounded-xl flex justify-between items-center cursor-pointer border-2 transition-all ${paymentMethod === "card" ? "border-black" : "border-transparent"}`}
                >
                  <div className="flex items-center gap-4">
                    <FiCreditCard size={20} />
                    <div>
                      <p className="font-bold text-sm uppercase">
                        {t.checkout.payment.options.card.title}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold italic">
                        {t.checkout.payment.options.card.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      className="h-3"
                      alt="visa"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      className="h-3"
                      alt="mastercard"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                      className="h-3"
                      alt="amex"
                    />
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("yape")}
                  className={`bg-[#F0F0F0] p-6 rounded-xl flex justify-between items-center cursor-pointer border-2 transition-all ${paymentMethod === "yape" ? "border-black" : "border-transparent"}`}
                >
                  <div className="flex items-center gap-4">
                    <FiSmartphone size={20} />
                    <p className="font-bold text-sm uppercase">
                      {t.checkout.payment.options.yape.title}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-[#742384] rounded-lg flex items-center justify-center text-white text-[8px] font-bold">
                    {t.checkout.payment.options.yape.badge}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("efectivo")}
                  className={`bg-[#F0F0F0] p-6 rounded-xl flex justify-between items-center cursor-pointer border-2 transition-all ${paymentMethod === "efectivo" ? "border-black" : "border-transparent"}`}
                >
                  <div className="flex items-center gap-4">
                    <FiDollarSign size={20} />
                    <p className="font-bold text-sm uppercase">
                      {t.checkout.payment.options.cash.title}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 italic">
                    {t.checkout.payment.options.cash.badge}
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod("paypal")}
                  className={`bg-[#F0F0F0] p-6 rounded-xl flex justify-between items-center cursor-pointer border-2 transition-all ${paymentMethod === "paypal" ? "border-black" : "border-transparent"}`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    className="h-5"
                    alt="paypal"
                  />
                </div>
              </div>

              <div className="bg-[#F9F9F9] p-8 rounded-[20px] mt-6 min-h-[200px] flex flex-col justify-center">
                {!paymentMethod && (
                  <p className="text-center text-gray-400 text-sm font-medium italic">
                    {t.checkout.payment.selectMethod}
                  </p>
                )}

                {paymentMethod === "card" && (
                  <form
                    onSubmit={handlePaymentSubmit}
                    className="space-y-6 animate-in fade-in duration-300"
                  >
                    <h3 className="text-xl font-black uppercase flex items-center gap-2">
                      <FiCreditCard /> {t.checkout.payment.forms.card.title}
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder={t.checkout.payment.forms.card.holderName}
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg p-4 outline-none focus:ring-1 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder={t.checkout.payment.forms.card.cardNumber}
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg p-4 outline-none focus:ring-1 focus:ring-black"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t.checkout.payment.forms.card.cvc}
                          required
                          className="bg-white border border-gray-200 rounded-lg p-4 outline-none focus:ring-1 focus:ring-black"
                        />
                        <input
                          type="text"
                          placeholder={t.checkout.payment.forms.card.expiry}
                          required
                          className="bg-white border border-gray-200 rounded-lg p-4 outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="save-card"
                          className="w-4 h-4 accent-black"
                        />
                        <label
                          htmlFor="save-card"
                          className="text-[10px] text-gray-500 font-bold uppercase"
                        >
                          {t.checkout.payment.forms.card.saveCard}
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0056e0] text-white py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-blue-700"
                    >
                      {t.checkout.payment.payButton} ${total.toFixed(2)}
                    </button>
                  </form>
                )}

                {paymentMethod === "yape" && (
                  <form
                    onSubmit={handlePaymentSubmit}
                    className="text-center space-y-6 animate-in fade-in duration-300"
                  >
                    <h3 className="text-xl font-black uppercase">
                      {t.checkout.payment.forms.yape.title}
                    </h3>
                    <div className="w-40 h-40 bg-white mx-auto border-4 border-[#742384] rounded-2xl p-2">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=YAPE-NOVA"
                        alt="QR Yape"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">
                        {t.checkout.payment.forms.yape.codeLabel}
                      </p>
                      <input
                        type="text"
                        placeholder="000000"
                        required
                        className="w-32 mx-auto text-center border-b-2 border-black text-2xl font-black outline-none bg-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#742384] text-white py-4 rounded-lg font-bold uppercase text-xs"
                    >
                      {t.checkout.payment.forms.yape.confirmButton}
                    </button>
                  </form>
                )}

                {paymentMethod === "efectivo" && (
                  <div className="text-center space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-xl font-black uppercase">
                      {t.checkout.payment.forms.cash.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold tracking-tighter">
                      {t.checkout.payment.forms.cash.description}
                    </p>
                    <button
                      onClick={handlePaymentSubmit}
                      className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase text-xs"
                    >
                      {t.checkout.payment.forms.cash.generateButton}
                    </button>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-black">
                        {t.checkout.payment.forms.paypal.paymentMethod}
                      </h3>
                      <div className="py-4">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                          className="h-12"
                          alt="PayPal"
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-black border-b pb-2">
                          {t.checkout.payment.forms.paypal.paymentInfo}
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="pt-4 border-t space-y-2">
                            <div className="flex justify-between text-gray-500">
                              <span>{t.checkout.summary.subtotal}</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-black pt-2">
                              <span>{t.checkout.summary.total}</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-black">
                        {t.checkout.payment.forms.paypal.completeInfo}
                      </h3>

                      <form
                        onSubmit={handlePaymentSubmit}
                        className="space-y-4"
                      >
                        <input
                          type="text"
                          placeholder={t.checkout.payment.forms.card.holderName}
                          className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none focus:border-blue-600 transition-colors"
                        />
                        <select className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none bg-white text-gray-500">
                          <option>
                            {t.checkout.payment.forms.paypal.idType}
                          </option>
                          <option>DNI</option>
                          <option>
                            {t.checkout.payment.forms.paypal.passport}
                          </option>
                        </select>
                        <input
                          type="text"
                          placeholder={t.checkout.payment.forms.paypal.idNumber}
                          className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none focus:border-blue-600"
                        />
                        <input
                          type="tel"
                          placeholder={t.checkout.shipping.phoneNumber}
                          className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none focus:border-blue-600"
                        />
                        <input
                          type="email"
                          placeholder={t.checkout.shipping.email}
                          className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none focus:border-blue-600"
                        />
                        <select className="w-full border border-gray-300 rounded-md p-4 text-sm outline-none bg-white text-gray-500">
                          <option>
                            {t.checkout.payment.forms.paypal.selectBank}
                          </option>
                          <option>BCP</option>
                          <option>BBVA</option>
                          <option>Interbank</option>
                        </select>

                        <div className="flex items-start gap-3 pt-2">
                          <input
                            type="checkbox"
                            required
                            className="mt-1 w-4 h-4 accent-blue-600"
                            id="terms"
                          />
                          <label
                            htmlFor="terms"
                            className="text-[11px] text-gray-500 leading-tight"
                          >
                            {t.checkout.payment.forms.paypal.terms}
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#0056e0] text-white py-4 rounded-md font-bold text-sm hover:bg-blue-700 transition-all shadow-md mt-6"
                        >
                          {t.checkout.payment.forms.paypal.goToPayment}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <p className="text-center text-[9px] text-zinc-400 font-medium px-6 leading-relaxed">
                  {t.checkout.payment.securityFooter}{" "}
                  <span className="text-black font-bold">
                    ${total.toFixed(2)}
                  </span>
                  .
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-gray-100 rounded-[30px] p-8 sticky top-[140px] bg-white shadow-2xl shadow-gray-100">
              <h2 className="text-xl font-black mb-8 uppercase tracking-tighter border-b pb-4">
                {t.checkout.summary.title}
              </h2>

              <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500"
                  >
                    <span>
                      {item.name
                        .replace("HOMBRE_", "")
                        .replace("MUJER_", "")
                        .replace(/_/g, " ")}
                      <span className="text-gray-300 ml-2">
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-gray-400 text-xs font-bold uppercase">
                  <span>{t.checkout.summary.subtotal}</span>
                  <span className="text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-500 text-xs font-bold uppercase">
                  <span>{t.checkout.summary.discount}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 uppercase border-t mt-4">
                  <span>{t.checkout.summary.total}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-gray-400 mt-10 leading-relaxed uppercase font-bold tracking-tighter">
                {t.checkout.summary.footer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
