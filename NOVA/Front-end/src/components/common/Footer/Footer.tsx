import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InstagramIcon from "../../../assets/icons/INSTAGRAM.png";
import FacebookIcon from "../../../assets/icons/FACEBOOK.png";
import TiktokIcon from "../../../assets/icons/TIKTOK.png";
import LibroReclamacionesIcon from "../../../assets/icons/LIBRO_RECLAMACIONES.png";
import SiguienteIcon from "../../../assets/icons/SIGUIENTE.png";
import LogoNA from "../../../assets/icons/LOGO1.png";
import VisaIcon from "../../../assets/icons/VISA.png";
import MastercardIcon from "../../../assets/icons/Mastercard.png";
import PayPalIcon from "../../../assets/icons/PayPal.png";
import ApplePayIcon from "../../../assets/icons/Pay.png";
import GooglePayIcon from "../../../assets/icons/GooglePay.png";
import { useLocale } from "../../../context/LocaleContext";
import { translations } from "../../../data/translations";

const Footer = () => {
  const { locale, updateLocale } = useLocale();

  const currentLang = (locale?.language || "es") as keyof typeof translations;
  const t = translations[currentLang] || translations.es;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const socialIcons = [
    {
      icon: InstagramIcon,
      alt: "Instagram",
      url: "https://instagram.com/tu_cuenta",
    },
    {
      icon: FacebookIcon,
      alt: "Facebook",
      url: "https://facebook.com/tu_cuenta",
    },
    { icon: TiktokIcon, alt: "TikTok", url: "https://tiktok.com/@tu_cuenta" },
  ];

  const footerSections = [
    {
      title: t.footer.aboutUs.title,
      links: t.footer.aboutUs.links.map((text: string) => ({
        text,
        url: `/${text.toLowerCase().replace(/\s+/g, "-")}`,
      })),
    },
    {
      title: t.footer.customerService.title,
      links: t.footer.customerService.links.map((text: string) => ({
        text,
        url: `/${text.toLowerCase().replace(/\s+/g, "-")}`,
      })),
    },
    {
      title: t.footer.legalInfo.title,
      links: t.footer.legalInfo.links.map((text: string) => ({
        text,
        url: `/${text.toLowerCase().replace(/\s+/g, "-")}`,
      })),
    },
  ];

  const paymentMethods = [
    { icon: VisaIcon, alt: "Visa" },
    { icon: MastercardIcon, alt: "Mastercard" },
    { icon: PayPalIcon, alt: "PayPal" },
    { icon: ApplePayIcon, alt: "Apple Pay" },
    { icon: GooglePayIcon, alt: "Google Pay" },
  ];

  const handleLanguageChange = (lang: string) => {
    updateLocale({ ...locale, language: lang });
  };

  const languages = [
    { code: "es", name: "ES" },
    { code: "en", name: "EN" },
    { code: "fr", name: "FR" },
  ];

  const currencies = [
    { code: "USD", name: "USD $", country: "USA" },
    { code: "EUR", name: "EUR €", country: "España" },
    { code: "PEN", name: "PEN S/", country: "Perú" },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-12 px-6 md:px-16 font-sans overflow-hidden">
      <motion.div
        className="max-w-[1400px] mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
          {footerSections.map((col, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="text-[14px] font-bold mb-10 tracking-[0.2em] uppercase">
                {col.title}
              </h4>
              <ul className="space-y-5 text-[12px] tracking-widest uppercase font-medium">
                {col.links.map((link: any, linkIdx: number) => (
                  <motion.li
                    key={linkIdx}
                    whileHover={{ x: 5 }}
                    className="hover:text-gray-400 transition-colors"
                  >
                    <a href={link.url} className="cursor-pointer block">
                      {link.text}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-start w-full"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={LogoNA}
              alt="Logo"
              className="w-30 mb-2 object-contain md:-ml-5 self-start"
            />

            <div className="w-full max-w-[320px]">
              <h4 className="text-[14px] font-bold mb-4 tracking-[0.2em] uppercase text-left">
                {t.footer.newsletter.title}
              </h4>
              <p className="text-[13px] mb-6 text-white text-left font-light leading-relaxed">
                {t.footer.newsletter.description}
              </p>

              <div className="relative border border-white rounded-md overflow-hidden group flex items-center">
                <input
                  type="email"
                  placeholder={t.footer.newsletter.placeholder}
                  className="w-full bg-transparent py-3 px-4 pr-12 text-[13px] focus:outline-none placeholder:text-gray-500"
                />
                <motion.button
                  whileTap={{ opacity: 0.7 }}
                  className="absolute right-2 bg-[#555] rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-white transition-colors duration-300"
                >
                  <img
                    src={SiguienteIcon}
                    alt="send"
                    className="w-3 h-3 group-hover:invert transition-all"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mt-20">
          <div className="flex items-center space-x-6 pb-2">
            {socialIcons.map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
              >
                <img
                  src={social.icon}
                  alt={social.alt}
                  className="w-8 h-8 cursor-pointer"
                />
              </motion.a>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center md:mr-35 cursor-pointer group"
          >
            <Link
              to="/libro-de-reclamaciones"
              className="flex flex-col items-center"
            >
              <img
                src={LibroReclamacionesIcon}
                alt="Libro de Reclamaciones"
                className="w-14 mb-1 transition-transform group-hover:scale-110"
              />
              <span className="text-[10px] font-bold text-center leading-tight tracking-widest uppercase whitespace-pre-line group-hover:text-gray-400 transition-colors">
                {t.footer.complaintBook.title}
              </span>
            </Link>
          </motion.div>

          <div className="flex flex-col items-end space-y-5">
            <div className="flex items-center space-x-6 text-[11px] font-medium tracking-wide">
              <div className="relative group cursor-pointer hover:opacity-70">
                <div className="flex items-center gap-1">
                  {t.location.currency}
                  <span className="text-xs">⌄</span>
                </div>
                <div className="absolute bottom-full right-0 mb-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  {currencies.map((currency) => (
                    <div
                      key={currency.code}
                      className="px-4 py-2 hover:bg-gray-100 text-xs font-medium tracking-wide cursor-pointer"
                    >
                      {currency.country} ({currency.name})
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group cursor-pointer hover:opacity-70">
                <div className="flex items-center gap-1">
                  {currentLang.toUpperCase()}
                  <span className="text-xs">⌄</span>
                </div>
                <div className="absolute bottom-full right-0 mb-2 w-24 bg-white text-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-4 py-2 hover:bg-gray-100 text-xs font-medium tracking-wide cursor-pointer ${
                        currentLang === lang.code ? "bg-gray-100" : ""
                      }`}
                    >
                      {lang.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.15 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={method.icon}
                    alt={method.alt}
                    className="h-10 w-auto object-contain brightness-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
