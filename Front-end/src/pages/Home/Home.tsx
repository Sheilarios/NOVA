import { useState, useEffect, useMemo, useRef } from "react";
import { useGoogleLogin } from '@react-oauth/google';
type LoginData = {
  email: string;
  password: string;
};
type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { useAuth } from "../../context/AuthContext";
import { translations } from "../../data/translations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { products } from "../../data/products";
import EnvioIcon from "../../assets/icons/ENVIO.png";
import DevolucionesIcon from "../../assets/icons/DEVOLUCIONES.png";
import AtencionIcon from "../../assets/icons/ATENCION.png";
import casual from "../../assets/images/casual.avif";
import Formal from "../../assets/images/formal.webp";
import Streetwear from "../../assets/images/Streetwear.avif";
import Oversize from "../../assets/images/oversize.webp";
import Urbana from "../../assets/images/urbana.webp";
import Minimal from "../../assets/images/minimal.avif";
import collectionImg from "../../assets/images/collection.png";
import heroImg from "../../assets/images/placeholder.jpg";
import vestidoAmarillo from "../../assets/images/vestidoAmarillo.jpg";
import bestSellerImg from "../../assets/images/overcoat.jpg";
import newInImg from "../../assets/images/NEWIN.png";
import totalLookImg from "../../assets/images/TOTALLOOK.png";
import WOMEN from "../../assets/images/WOMEN.png";
import MEN from "../../assets/images/MEN.png";

// Interfaz para la respuesta del login social
interface SocialLoginResult {
  success: boolean;
  message?: string;
  user?: any;
}

const Home = () => {
  const { locale, updateLocale } = useLocale();
  const { login: authLogin, register: authRegister, socialLogin } = useAuth();
  const [modalStep, setModalStep] = useState<"location" | "auth" | null>(null);
  const [tempCountry, setTempCountry] = useState("pe");
  const [tempLanguage, setTempLanguage] = useState("es");
  const [tempCurrency, setTempCurrency] = useState("pen");
  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;
  const favoriteProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, 10);
  }, []);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const hasCheckedModals = useRef(false);
  
  useEffect(() => {
    if (locale) {
      setTempCountry(locale.country || "pe");
      setTempLanguage(locale.language || "es");
      if (locale.currency?.includes("PEN")) {
        setTempCurrency("pen");
      } else if (locale.currency?.includes("EUR")) {
        setTempCurrency("eur");
      } else if (locale.currency?.includes("USD")) {
        setTempCurrency("usd");
      } else {
        setTempCurrency("pen");
      }
    }
  }, [locale]);

  useEffect(() => {
    if (hasCheckedModals.current) return;
    const savedUser = localStorage.getItem("nova_session");
    const locationSet = localStorage.getItem("nova_location_set");
    const authSkipped = localStorage.getItem("nova_auth_skipped");
    if (!locationSet) {
      setModalStep("location");
    } else if (!savedUser && !authSkipped) {
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData && userData.guest !== true) {
            return;
          }
        } catch (error) {
          setModalStep("auth");
        }
      } else {
        setModalStep("auth");
      }
    }
    hasCheckedModals.current = true;
  }, []);

  const handleConfirmLocation = () => {
    updateLocale({
      country: tempCountry,
      language: tempLanguage,
      currency:
        tempCurrency === "pen"
          ? "PEN (S/)"
          : tempCurrency === "eur"
            ? "EUR (€)"
            : tempCurrency === "usd"
              ? "USD ($)"
              : tempCurrency === "mxn"
                ? "MXN ($)"
                : "PEN (S/)",
    });

    localStorage.setItem("nova_location_set", "true");
    localStorage.removeItem("nova_auth_skipped");
    setModalStep("auth");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "login") {
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password,
        };
        const success = await authLogin(loginData);
        if (success) {
          setModalStep(null);
          if (formData.email === "admin@nova.com") {
            console.log(" Administrador Principal autenticado desde Home");
          } else if (formData.email === "manager@nova.com") {
            console.log("Gerente de Tienda autenticado desde Home");
          } else if (formData.email === "soporte@nova.com") {
            console.log("Soporte Técnico autenticado desde Home");
          } else if (formData.email === "contenido@nova.com") {
            console.log("Editor de Contenido autenticado desde Home");
          }
        } else {
          alert("Error en el login. Verifica tus credenciales.");
        }
      } else if (authMode === "register") {
  const registerData: RegisterData = {
    name: formData.nombre,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };
  console.log("Enviando registro:", registerData); // ← AGREGAR
  const success = await authRegister(registerData);
  console.log("Resultado registro:", success); // ← AGREGAR
  if (success) {
    setModalStep(null);
  } else {
    alert("Error en el registro. Intenta nuevamente.");
  }
}
    } catch (error) {
      console.error("Error en autenticación:", error);
      alert("Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // IMPLEMENTACIÓN CORREGIDA DE LOGIN SOCIAL
  // ==============================================
  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    
    if (provider === "Google") {
      // Este hook abre el popup de Google
      loginWithGoogle();
    } else if (provider === "Facebook") {
      // Por ahora mantén la lógica temporal para Facebook
      // Cuando implementes Facebook SDK, actualiza esto
      try {
        const loginData: LoginData = {
          email: `facebook@nova.com`,
          password: "social_password",
        };
        const success = await authLogin(loginData);
        if (success) {
          setModalStep(null);
          window.location.reload();
        } else {
          alert("Error en login con Facebook");
        }
      } catch (error) {
        console.error("Error en login social:", error);
        alert("Error en la autenticación con Facebook");
      } finally {
        setSocialLoading(null);
      }
    }
  };

  // Hook de Google Login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // tokenResponse.access_token es lo que Google nos da
        const result = await socialLogin('google', tokenResponse.access_token);
        
        if (result.success) {
          setModalStep(null); // Cerrar modal
          window.location.reload(); // Recargar para actualizar el estado de auth
        } else {
          alert(result.message || "Error en login con Google");
        }
      } catch (error) {
        console.error("Error en login con Google:", error);
        alert("Error en la autenticación con Google");
      } finally {
        setSocialLoading(null);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      alert("Error al abrir el popup de Google. Por favor, intenta nuevamente.");
      setSocialLoading(null);
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  const categories = [
    {
      image: casual,
      title: t.categories.collection.casual,
      position: "object-top",
    },
    {
      image: Formal,
      title: t.categories.collection.formal,
      position: "object-top",
    },
    {
      image: Streetwear,
      title: t.categories.collection.streetwear,
      position: "object-center",
    },
    {
      image: Oversize,
      title: t.categories.collection.oversize,
      position: "object-top",
    },
    {
      image: Urbana,
      title: t.categories.collection.urban,
      position: "object-center",
    },
    {
      image: Minimal,
      title: t.categories.collection.minimal,
      position: "object-center",
    },
  ];

  const collections = [
    {
      name: t.home.collections.bestSellers,
      id: "BEST SELLERS",
      image: bestSellerImg,
    },
    {
      name: t.home.collections.dressesAndJumpsuits,
      id: "VESTIDOS Y MONOS",
      image: vestidoAmarillo,
    },
    { name: t.home.collections.newIn, id: "NEW IN", image: newInImg },
    {
      name: t.home.collections.totalLook,
      id: "TOTAL LOOK",
      image: totalLookImg,
    },
  ];

  const features = [
    { icon: EnvioIcon, title: t.pages.about.features.shipping },
    { icon: DevolucionesIcon, title: t.pages.about.features.returns },
    {
      icon: AtencionIcon,
      title: t.pages.about.features.customerService,
      desc: "",
    },
  ];

  return (
    <div className="bg-white overflow-x-hidden relative">
      {showAnnouncement && (
        <div className="bg-black text-white py-1.5 px-4 relative flex items-center justify-center animate-in fade-in slide-in-from-top duration-500 z-[110]">
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-center">
            {"ENVÍO GRATIS EN PEDIDOS SUPERIORES A 100€"}
          </p>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 text-white/70 hover:text-white transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* =======================
          MODAL DE LOCALIZADOR 
      =========================== */}
      {modalStep === "location" && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0 w-full h-full"
            onClick={() => setModalStep(null)}
          ></div>
          <div className="relative bg-white w-full max-w-[480px] p-10 md:p-14 shadow-2xl z-[1001] animate-in zoom-in-95 duration-300 rounded-sm">
            <button
              onClick={() => setModalStep(null)}
              className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300"
            >
              <FiX size={28} />
            </button>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-black mb-12">
              {t.location.title}
            </h3>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-black block">
                  {t.location.country}
                </label>
                <div className="relative group">
                  <select
                    value={tempCountry}
                    onChange={(e) => setTempCountry(e.target.value)}
                    className="w-full appearance-none bg-white border border-black px-5 py-4 text-[11px] uppercase tracking-widest focus:outline-none cursor-pointer pr-12 font-medium"
                  >
                    <option value="pe">PERÚ</option>
                    <option value="es">ESPAÑA</option>
                    <option value="mx">MÉXICO</option>
                    <option value="us">UNITED STATES</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-black">
                    <FiChevronRight className="rotate-90" size={18} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-black block">
                  {t.location.language}
                </label>
                <div className="relative group">
                  <select
                    value={tempLanguage}
                    onChange={(e) => setTempLanguage(e.target.value)}
                    className="w-full appearance-none bg-white border border-black px-5 py-4 text-[11px] uppercase tracking-widest focus:outline-none cursor-pointer pr-12 font-medium"
                  >
                    <option value="es">ESPAÑOL</option>
                    <option value="en">ENGLISH</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-black">
                    <FiChevronRight className="rotate-90" size={18} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-black block">
                  {t.location.currency}
                </label>
                <div className="relative group">
                  <select
                    value={tempCurrency}
                    onChange={(e) => setTempCurrency(e.target.value)}
                    className="w-full appearance-none bg-white border border-black px-5 py-4 text-[11px] uppercase tracking-widest focus:outline-none cursor-pointer pr-12 font-medium"
                  >
                    <option value="pen">PEN (S/)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="usd">USD ($)</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-black">
                    <FiChevronRight className="rotate-90" size={18} />
                  </div>
                </div>
              </div>
              <button
                onClick={handleConfirmLocation}
                className="w-full bg-black text-white py-5 mt-4 font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all active:scale-[0.99]"
              >
                {t.location.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================
          MODAL DE REGISTRO / LOGIN
      ============================== */}
      {modalStep === "auth" && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0 w-full h-full"
            onClick={() => setModalStep(null)}
          ></div>

          <div className="relative bg-white w-full max-w-[480px] p-12 shadow-2xl z-[1001] animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setModalStep(null)}
              className="absolute top-6 right-6 text-black hover:rotate-90 transition-transform duration-300 z-[1002]"
              type="button"
            >
              <FiX size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-7xl font-serif tracking-tighter text-black">
                NOVA
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 font-black mt-4 uppercase">
                {authMode === "login" ? t.login.signIn : t.login.register}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {authMode === "register" && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
                    {t.login.fullName}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={t.login.writeHere}
                    className="w-full bg-white border border-black px-4 py-4 text-[11px] uppercase tracking-tighter outline-none focus:ring-1 focus:ring-black"
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    disabled={isLoading || !!socialLoading}
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
                  {t.login.email}{" "}
                  {authMode === "login" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  required
                  type="email"
                  placeholder={t.login.writeHere}
                  className="w-full bg-white border border-black px-4 py-4 text-[11px] uppercase tracking-tighter outline-none focus:ring-1 focus:ring-black"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading || !!socialLoading}
                />
              </div>

              <div
                className={
                  authMode === "register"
                    ? "grid grid-cols-2 gap-4"
                    : "space-y-1"
                }
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
                    {t.login.password}{" "}
                    {authMode === "login" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    required
                    type="password"
                    placeholder={t.login.writeHere}
                    className="w-full bg-white border border-black px-4 py-4 text-[11px] uppercase tracking-tighter outline-none focus:ring-1 focus:ring-black"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={isLoading || !!socialLoading}
                  />
                </div>
                {authMode === "register" && (
                  <div className="space-y-1 animate-in fade-in duration-500">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
                      {t.login.confirm}
                    </label>
                    <input
                      required
                      type="password"
                      placeholder={t.login.writeHere}
                      className="w-full bg-white border border-black px-4 py-4 text-[11px] uppercase tracking-tighter outline-none focus:ring-1 focus:ring-black"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={isLoading || !!socialLoading}
                    />
                  </div>
                )}
              </div>

              {authMode === "register" && (
                <div className="flex items-start gap-3 pt-2 animate-in fade-in duration-500">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      required
                      type="checkbox"
                      id="terms"
                      className="peer appearance-none w-5 h-5 bg-white border border-black checked:bg-black transition-all cursor-pointer"
                      disabled={isLoading || !!socialLoading}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-[10px] text-gray-400 uppercase tracking-tight leading-tight cursor-pointer select-none"
                  >
                    {t.login.readAndAgree}{" "}
                    <span
                      className="text-black font-bold underline underline-offset-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTermsOpen(true);
                      }}
                    >
                      {t.login.termsAndConditions}
                    </span>{" "}
                    {t.login.ofNOVA}
                  </label>
                </div>
              )}

              {authMode === "login" && (
                <div className="space-y-3 pt-1 text-left">
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="text-[11px] text-[#4285F4] hover:underline block transition-colors"
                  >
                    {t.login.forgotPassword}
                  </button>
                  <p className="text-[11px] text-gray-400 italic">
                    {t.login.ageWarning}{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => setIsTermsOpen(true)}
                    >
                      {t.login.legalTerms}
                    </span>
                  </p>
                </div>
              )}

              <div
                className={
                  authMode === "login" ? "flex gap-4 pt-2" : "block pt-2"
                }
              >
                {authMode === "login" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="flex-1 bg-black text-white py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
                      disabled={isLoading || !!socialLoading}
                    >
                      {t.login.registerButton}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 border border-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center"
                      disabled={isLoading || !!socialLoading}
                    >
                      {isLoading ? (
                        <FiLoader className="animate-spin" size={16} />
                      ) : (
                        t.login.signInButton
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center"
                    disabled={isLoading || !!socialLoading}
                  >
                    {isLoading ? (
                      <FiLoader className="animate-spin" size={16} />
                    ) : (
                      t.login.createAccount
                    )}
                  </button>
                )}
              </div>

              {authMode === "register" && (
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mt-4"
                  disabled={isLoading || !!socialLoading}
                >
                  ¿Ya tienes una cuenta?
                </button>
              )}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-[10px] text-gray-400 uppercase tracking-widest">
                    o
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="w-full border border-black py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 group"
                  disabled={isLoading || !!socialLoading}
                >
                  {socialLoading === "Facebook" ? (
                    <>
                      <FiLoader className="animate-spin" size={14} />
                      {t.login.processing}
                    </>
                  ) : (
                    <>
                      <img
                        src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                        alt="FB"
                      />
                      {t.login.continueWithFacebook}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full border border-black py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 group"
                  disabled={isLoading || !!socialLoading}
                >
                  {socialLoading === "Google" ? (
                    <>
                      <FiLoader className="animate-spin" size={14} />
                      {t.login.processing}
                    </>
                  ) : (
                    <>
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                        alt="G"
                      />
                      {t.login.continueWithGoogle}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================
          MODAL DE TÉRMINOS 
      ========================== */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6">
          <div
            className="absolute inset-0"
            onClick={() => setIsTermsOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black">
                {t.login.termsAndConditions}
              </h3>
              <button
                onClick={() => setIsTermsOpen(false)}
                className="text-black hover:rotate-90 transition-transform duration-300"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-[11px] leading-relaxed text-gray-600 space-y-6 font-medium tracking-wide">
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">
                  Introduction
                </h4>
                <p>
                  Welcome to NOVA. By accessing and using our website, you agree
                  to comply with the following terms and conditions.
                </p>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">
                  Site Use
                </h4>
                <p>
                  This site is intended for users 18 years and older. You commit
                  to using the site in a legal and ethical manner.
                </p>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">
                  Privacy
                </h4>
                <p>
                  We respect your privacy. See our Privacy Policy for more
                  details on how we handle your data.
                </p>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">
                  Shipping & Returns
                </h4>
                <p>
                  Check our shipping and return policies for information on
                  deadlines, costs, and conditions.
                </p>
              </section>
              <p className="text-[9px] italic text-gray-400 pt-4">
                {t.home.terms.lastUpdate}
              </p>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
              >
                {t.home.terms.understandButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN PORTADA */}
      <section className="relative h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-[5%] bg-black/10">
          <div className="max-w-7xl">
            <h1 className="text-[3.5rem] md:text-[7rem] font-serif text-white leading-[0.9] tracking-tighter italic">
              {t.home.hero.line1}
            </h1>
            <h2
              className="text-[3.5rem] md:text-[7rem] font-serif leading-[0.9] tracking-tighter md:ml-48"
              style={{ color: "#692222" }}
            >
              {t.home.hero.line2}
            </h2>
            <p className="mt-8 text-[14px] md:text-[18px] text-white tracking-[0.4em] font-light uppercase">
              {t.home.hero.subtitle}
            </p>
          </div>
        </div>
        <div className="absolute z-10 bottom-12 right-12">
          <Link
            to="/sales"
            className="border border-white px-12 py-4 text-[10px] font-bold tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all"
          >
            {t.home.shopNow}
          </Link>
        </div>
      </section>
      {/* SECCIÓN GÉNERO */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase text-gray-800 mb-3">
              {t.home.discoverStyle.title}
            </h2>
            <p className="text-[10px] text-gray-400 tracking-[0.4em] font-bold">
              {t.home.discoverStyle.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Link
              to="/women"
              className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-lg md:rounded-xl"
            >
              <img
                src={WOMEN}
                alt={t.home.gender.women.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-end justify-start p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-[0.3em] mb-2">
                    {t.home.gender.women.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base font-light tracking-widest">
                    {t.home.gender.women.explore}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/men"
              className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-lg md:rounded-xl"
            >
              <img
                src={MEN}
                alt={t.home.gender.men.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-end justify-start p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-[0.3em] mb-2">
                    {t.home.gender.men.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base font-light tracking-widest">
                    {t.home.gender.men.explore}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to="/collection"
              state={{ category: cat.title.toUpperCase() }}
              className="group"
            >
              <div className="relative aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className={`w-full h-full object-cover transition duration-700 group-hover:scale-110 ${cat.position || "object-center"}`}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.25em] text-center px-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN COLECCIONES */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {collections.map((col, i) => (
              <Link
                key={i}
                to="/collection"
                state={{ category: col.name.toUpperCase() }}
                className="group relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl shadow-xl bg-gray-100"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-end justify-start p-8 md:p-16">
                  <div className="transform translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85]">
                      {col.name}
                    </h3>
                    <div className="mt-8 flex items-center gap-2 text-white font-bold text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                      {t.home.collections.explore}{" "}
                      <FiArrowRight className="text-lg" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN FAVORITOS */}
      <section className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light tracking-[0.3em] uppercase text-gray-800">
              {t.home.favorites.title}
            </h2>
            <p className="text-[10px] text-gray-400 tracking-[0.4em] font-bold mt-4">
              {t.home.favorites.subtitle}
            </p>
          </div>

          <div className="relative px-2 md:px-12">
            <Swiper
              modules={[Navigation]}
              spaceBetween={25}
              slidesPerView={1}
              loop={favoriteProducts.length > 4}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-10"
            >
              {favoriteProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    {...product}
                    id={String(product.id)}
                    name={product.name
                      .replace("HOMBRE_", "")
                      .replace("MUJER_", "")
                      .replace(/_/g, " ")}
                    originContext={{
                      page: "home",
                      category: "favorites",
                      type: product.type || "featured",
                      filters: {
                        activeSubFilter: null,
                        priceRange: null,
                        activeSizes: [],
                        activeFilters: [],
                        searchTerm: "",
                        sortBy: "featured",
                      },
                      pageNumber: 1,
                      returnPath: "/",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-custom absolute left-[-10px] md:left-0 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
              <FiChevronLeft size={20} />
            </button>
            <button className="swiper-button-next-custom absolute right-[-10px] md:right-0 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BANNER SECUNDARIO */}
      <section className="relative h-[70vh] md:h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-[3000ms] hover:scale-105"
          style={{
            backgroundImage: `url(${collectionImg})`,
            backgroundPosition: "center 20%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="relative z-10 h-full w-full px-6 md:px-10 flex flex-col justify-end pb-12 md:pb-20">
          <div className="w-full">
            <h2 className="text-white text-5xl md:text-[9rem] lg:text-[11rem] font-serif leading-none tracking-tighter whitespace-nowrap">
              {t.home.summerBanner.title}
            </h2>
            <p className="text-white text-sm md:text-xl font-light mt-2 tracking-[0.4em] uppercase opacity-80">
              {t.home.summerBanner.subtitle}
            </p>
          </div>
          <div className="absolute bottom-8 right-6 md:bottom-12 md:right-10">
            <Link
              to="/collection"
              state={{ category: "SUMMER COLLECTION" }}
              className="inline-block border border-white/40 px-10 py-4 text-[10px] md:text-xs tracking-[0.3em] text-white uppercase hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
            >
              {t.home.summerBanner.button}
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN FEATURES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {features.map((feat, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="h-32 flex items-center justify-center mb-6">
                  <img
                    src={feat.icon}
                    alt={feat.title}
                    className={`object-contain transition-all duration-500 group-hover:scale-110 ${
                      feat.title === t.pages.about.features.customerService
                        ? "h-24"
                        : "h-16"
                    }`}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-[11px] font-bold tracking-[0.3em] text-black uppercase mb-2">
                    {feat.title}
                  </h3>
                  {feat.desc && (
                    <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                      {feat.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;