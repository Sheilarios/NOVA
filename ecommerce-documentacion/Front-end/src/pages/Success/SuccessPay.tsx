import { useEffect, useMemo } from "react";
import { FiCheck, FiDownload, FiHome } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";
import { translations } from "../../data/translations";
import { useLocale } from "../../context/LocaleContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  cartItems: CartItem[];
  subtotal: string;
  discount: string;
  deliveryFee: string;
  total: string;
  orderNumber: string;
  orderDate: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
  };
}

interface SuccessPageProps {
  onFinalize: () => void;
}

const SuccessPage = ({ onFinalize }: SuccessPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useLocale();

  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;

  const orderData = (location.state as OrderData) || {
    cartItems: [],
    subtotal: "0.00",
    discount: "0.00",
    deliveryFee: "0.00",
    total: "0.00",
    orderNumber: "NV-TEMP",
    orderDate: new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  const transactionId = useMemo(
    () => `NV-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  const currentDate = useMemo(() => {
    const dateFormat = language === "es" ? "es-PE" : "en-US";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date().toLocaleDateString(dateFormat, options);
  }, [language]);

  useEffect(() => {
    window.scrollTo(0, 0);
    onFinalize();
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      navigate("/");
    };

    const end = Date.now() + 3 * 1000;
    const colors = ["#0052FF", "#8B8365", "#22C55E"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      window.onpopstate = null;
    };
  }, [onFinalize, navigate]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const items = orderData.cartItems || [];
    const subtotalCalc = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const discountCalc = subtotalCalc * 0.2;
    const deliveryCalc = 15.0;
    const totalCalc = subtotalCalc - discountCalc + deliveryCalc;

    const f = (val: string | number, fallback: number) => {
      const num = Number(val);
      return isNaN(num) || num === 0 ? fallback.toFixed(2) : num.toFixed(2);
    };

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(t.checkout.storeName || "NOVA STORE", 105, 25, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(t.pdf.receiptTitle, 105, 50, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${t.pdf.order}: ${orderData.orderNumber || "N/A"}`, 20, 60);
    doc.text(`${t.pdf.date}: ${currentDate}`, 20, 67);
    doc.text(`${t.pdf.transaction}: ${transactionId}`, 20, 74);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.pdf.status}: ${t.pdf.paid}`, 155, 67);
    let tableStartY = 85;
    if (orderData.customer) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(t.pdf.customerInfo, 20, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${t.pdf.name}: ${orderData.customer.name || "---"}`, 20, 92);
      doc.text(`${t.pdf.phone}: ${orderData.customer.phone || "---"}`, 20, 98);
      doc.text(
        `${t.pdf.address}: ${orderData.customer.address || "---"}`,
        20,
        104,
      );
      tableStartY = 115;
    }
    doc.setTextColor(0, 0, 0);
    doc.line(20, tableStartY, 190, tableStartY);
    doc.setFont("helvetica", "bold");
    doc.text(t.pdf.product, 22, tableStartY + 7);
    doc.text(t.pdf.quantity, 115, tableStartY + 7);
    doc.text("Precio", 145, tableStartY + 7);
    doc.text(t.pdf.subtotal, 188, tableStartY + 7, { align: "right" });
    doc.line(20, tableStartY + 11, 190, tableStartY + 11);

    let y = tableStartY + 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    items.forEach((item) => {
      let cleanName = item.name
        .replace("HOMBRE_", "")
        .replace("MUJER_", "")
        .replace(/_/g, " ");
      const finalName =
        cleanName.length > 25 ? cleanName.substring(0, 23) + "..." : cleanName;

      doc.text(finalName.toUpperCase(), 22, y);
      doc.text(item.quantity.toString(), 120, y, { align: "center" });
      doc.text(`$${Number(item.price).toFixed(2)}`, 145, y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 188, y, {
        align: "right",
      });
      y += 8;
    });
    y += 5;
    doc.line(110, y, 190, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`${t.pdf.subtotal}:`, 120, y);
    doc.text(`$${f(orderData.subtotal, subtotalCalc)}`, 188, y, {
      align: "right",
    });
    y += 7;
    doc.text(`${t.pdf.discount}:`, 120, y);
    doc.text(`-$${f(orderData.discount, discountCalc)}`, 188, y, {
      align: "right",
    });
    y += 7;
    doc.text(`${t.pdf.shipping}:`, 120, y);
    doc.text(`$${f(orderData.deliveryFee, deliveryCalc)}`, 188, y, {
      align: "right",
    });
    y += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.pdf.totalPaid}:`, 110, y);
    doc.text(`$${f(orderData.total, totalCalc)}`, 188, y, { align: "right" });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(t.pdf.footerMessage, 105, 280, { align: "center" });

    doc.save(`${t.pdf.filename}_${transactionId}.pdf`);
  };

  const calculatedSubtotal = orderData.cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );

  const cleanProductName = (name: string) => {
    return name.replace("HOMBRE_", "").replace("MUJER_", "").replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-40 pb-12 p-15 font-sans animate-in fade-in duration-1000">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
        <div className="w-28 h-28 md:w-36 md:h-36 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(34,197,94,0.5)] z-10 relative">
          <FiCheck className="text-white text-5xl md:text-6xl stroke-[3]" />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] text-black mb-2 text-center">
        {t.pages.success.confirmed}
      </h1>

      <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-12">
        {t.pages.success.orderProcessing}
      </p>

      <div className="w-full max-w-[450px] bg-zinc-50 rounded-2xl p-8 border border-zinc-100 space-y-6">
        <div className="border-b border-zinc-200 pb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">
            {t.pages.success.orderDetails}
          </h3>
          <div className="space-y-4">
            {orderData.cartItems.map((item: CartItem) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-black leading-tight">
                    {cleanProductName(item.name)}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">
                    ID: {item.id} | {t.pages.cart.quantity}: {item.quantity}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-black">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            <span>{t.pages.success.subtotal}</span>
            <span>${calculatedSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            <span>{t.pages.success.discount} (20%)</span>
            <span className="text-red-500">
              -${(calculatedSubtotal * 0.2).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            <span>{t.pages.success.shipping}</span>
            <span>${orderData.deliveryFee || "15.00"}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
            <span className="text-[12px] font-black uppercase tracking-tighter">
              {t.pages.success.totalPaid}
            </span>
            <span className="text-xl font-black text-[#0052FF]">
              ${orderData.total}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200">
          <div className="grid grid-cols-2 gap-4 text-[9px]">
            <div>
              <p className="text-zinc-400 font-bold uppercase tracking-wider mb-1">
                {t.pages.success.orderNumber}
              </p>
              <p className="font-black text-black">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="text-zinc-400 font-bold uppercase tracking-wider mb-1">
                {t.pages.success.date}
              </p>
              <p className="font-black text-black">{orderData.orderDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[450px] mt-10 space-y-3">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-black text-white py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl"
        >
          <FiHome size={16} /> {t.pages.success.backToStore}
        </button>

        <button
          onClick={generatePDF}
          className="w-full bg-white text-black border border-zinc-200 py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-3"
        >
          <FiDownload size={16} /> {t.pages.success.downloadPDF}
        </button>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="h-1 w-12 bg-zinc-200 rounded-full" />
        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
          {t.pages.success.copyright}
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
