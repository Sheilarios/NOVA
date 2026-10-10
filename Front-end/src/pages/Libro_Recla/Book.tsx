import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "../../context/LocaleContext";

const LibroReclamaciones = () => {
  const { locale } = useLocale();
  const language = locale.language;
  const t =
    language === "es"
      ? {
          title: "Libro de Reclamaciones",
          ruc: "RUC: 91823124378",
          businessName: "RAZÓN SOCIAL: NOVA S.A.C",
          address:
            "DIRECCIÓN: AV. LA PAZ 1234, DISTRITO DE MIRAFLORES, PROVINCIA Y DEPARTAMENTO DE LIMA",
          personalData: "Datos personales",
          contactData: "Datos de contacto",
          purchaseDetails: "Detalles de la compra",
          claimDetails: "Detalle del reclamo",
          document: "Documento",
          documentNumber: "Número de Documento",
          fullName: "Nombre Completo",
          email: "Email",
          addressField: "Domicilio",
          code: "Código",
          phone: "Teléfono",
          claimedAmount: "Monto reclamado",
          identifiedProduct: "Identificación del bien contratado",
          storeType: "Tipo de tienda",
          problemDate: "Fecha del problema",
          additionalDetails: "¿Algún detalle adicional? Número de pedido, etc",
          claimDetailsField: "Detalle de reclamo/queja",
          solution: "¿Cómo podemos solucionar tu problema?",
          selectProduct: "Identificación del bien contratado",
          selectStoreType: "Tipo de tienda",
          productOption: "Producto",
          serviceOption: "Servicio",
          virtualOption: "Virtual",
          physicalOption: "Física",
          sendButton: "Enviar",
        }
      : {
          title: "Complaint Book",
          ruc: "RUC: 91823124378",
          businessName: "BUSINESS NAME: NOVA S.A.C",
          address:
            "ADDRESS: AV. LA PAZ 1234, MIRAFLORES DISTRICT, LIMA PROVINCE AND DEPARTMENT",
          personalData: "Personal data",
          contactData: "Contact data",
          purchaseDetails: "Purchase details",
          claimDetails: "Claim details",
          document: "Document",
          documentNumber: "Document Number",
          fullName: "Full Name",
          email: "Email",
          addressField: "Address",
          code: "Code",
          phone: "Phone",
          claimedAmount: "Claimed amount",
          identifiedProduct: "Identified product/service",
          storeType: "Store type",
          problemDate: "Problem date",
          additionalDetails: "Any additional details? Order number, etc",
          claimDetailsField: "Claim/complaint details",
          solution: "How can we solve your problem?",
          selectProduct: "Identify product/service",
          selectStoreType: "Store type",
          productOption: "Product",
          serviceOption: "Service",
          virtualOption: "Virtual",
          physicalOption: "Physical",
          sendButton: "Send",
        };
  useEffect(() => {
    document.body.classList.add("libro-page-active");

    return () => {
      document.body.classList.remove("libro-page-active");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#4A1D1D] pt-40 pb-20 px-4 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[850px] p-8 md:p-14 shadow-2xl"
      >
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-4 tracking-tight uppercase">
            {t.title}
          </h1>
          <div className="text-[11px] md:text-[12px] font-bold text-black space-y-1 leading-relaxed uppercase">
            <p>{t.ruc}</p>
            <p>{t.businessName}</p>
            <p>{t.address}</p>
          </div>
        </header>

        <form className="space-y-10">
          <section>
            <h2 className="text-[14px] font-extrabold mb-6 uppercase tracking-widest">
              {t.personalData}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                placeholder={t.document}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
              <input
                type="text"
                placeholder={t.documentNumber}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
              <input
                type="text"
                placeholder={t.fullName}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-extrabold mb-6 uppercase tracking-widest">
              {t.contactData}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <input
                type="email"
                placeholder={t.email}
                className="md:col-span-2 w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
              <input
                type="text"
                placeholder={t.addressField}
                className="md:col-span-2 w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
              <input
                type="text"
                placeholder={t.code}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
              <input
                type="tel"
                placeholder={t.phone}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-extrabold mb-6 uppercase tracking-widest">
              {t.purchaseDetails}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                placeholder={t.claimedAmount}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300"
              />

              <div className="relative border-b border-gray-300 group">
                <select className="w-full py-2 focus:outline-none text-sm text-gray-400 bg-transparent cursor-pointer appearance-none">
                  <option>{t.selectProduct}</option>
                  <option value="product">{t.productOption}</option>
                  <option value="service">{t.serviceOption}</option>
                </select>
                <span className="absolute right-0 top-3 pointer-events-none text-[10px] text-gray-400 group-hover:text-black">
                  ▼
                </span>
              </div>

              <div className="relative border-b border-gray-300 group">
                <select className="w-full py-2 focus:outline-none text-sm text-gray-400 bg-transparent cursor-pointer appearance-none">
                  <option>{t.selectStoreType}</option>
                  <option value="virtual">{t.virtualOption}</option>
                  <option value="physical">{t.physicalOption}</option>
                </select>
                <span className="absolute right-0 top-3 pointer-events-none text-[10px] text-gray-400 group-hover:text-black">
                  ▼
                </span>
              </div>

              <div className="relative border-b border-gray-300 group flex items-center">
                <input
                  type="text"
                  placeholder={t.problemDate}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  className="w-full py-2 focus:outline-none focus:border-black transition-colors text-sm placeholder:text-gray-300 bg-transparent"
                />
              </div>

              <textarea
                placeholder={t.additionalDetails}
                className="w-full bg-[#F5F5F5] p-5 h-28 mt-2 focus:outline-none text-sm resize-none placeholder:text-gray-400"
              />
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-extrabold mb-6 uppercase tracking-widest">
              {t.claimDetails}
            </h2>
            <div className="space-y-6">
              <textarea
                placeholder={t.claimDetailsField}
                className="w-full bg-[#F5F5F5] p-5 h-36 focus:outline-none text-sm resize-none placeholder:text-gray-400"
              />
              <textarea
                placeholder={t.solution}
                className="w-full bg-[#F5F5F5] p-5 h-28 focus:outline-none text-sm resize-none placeholder:text-gray-400"
              />
            </div>
          </section>
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="text-3xl font-black tracking-tighter hover:text-gray-500 transition-colors uppercase"
            >
              {t.sendButton}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LibroReclamaciones;
