import { useLocale } from "../../context/LocaleContext";
import { translations } from "../../data/translations";
import EnvioIcon from "../../assets/icons/ENVIO.png";
import DevolucionesIcon from "../../assets/icons/DEVOLUCIONES.png";
import AtencionIcon from "../../assets/icons/ATENCION.png";

const About = () => {
  const { locale } = useLocale();

  const language = locale?.language || "es";
  const t =
    translations[language as keyof typeof translations] || translations.es;

  const features = [
    {
      icon: EnvioIcon,
      title: t.pages.about.features.shipping,
      desc: "",
    },
    {
      icon: DevolucionesIcon,
      title: t.pages.about.features.returns,
      desc: "",
    },
    {
      icon: AtencionIcon,
      title: t.pages.about.features.customerService,
      desc: "",
    },
  ];

  const values = [
    {
      name: t.pages.about.values,
      img: "https://images.pexels.com/photos/3756030/pexels-photo-3756030.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      name: t.pages.about.values,
      img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGllbmRhJTIwZGUlMjBtb2RhfGVufDB8fDB8fHww",
    },
    {
      name: t.pages.about.values,
      img: "https://images.pexels.com/photos/2811089/pexels-photo-2811089.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      name: t.pages.about.values,
      img: "https://images.pexels.com/photos/2739792/pexels-photo-2739792.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-[110px]">
      <section className="relative h-[90vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/flagged/photo-1570733117311-d990c3816c47?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA=="
          alt="About Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-8xl font-serif tracking-tighter uppercase mb-2">
            {t.pages.about.hero}
          </h1>
          <h2 className="text-4xl md:text-7xl font-serif italic tracking-tight opacity-90"></h2>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          <img
            src="https://images.pexels.com/photos/5868272/pexels-photo-5868272.jpeg?auto=compress&cs=tinysrgb&w=500"
            alt={t.menu.about}
            className="w-full h-[400px] object-cover"
          />
          <img
            src="https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg?auto=compress&cs=tinysrgb&w=500"
            alt={t.menu.about}
            className="w-full h-[400px] object-cover"
          />
          <img
            src="https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg?auto=compress&cs=tinysrgb&w=500"
            alt={t.menu.about}
            className="w-full h-[400px] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8MHx8fDA%3D"
            alt={t.menu.about}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl md:text-4xl font-serif italic tracking-tighter"></h3>
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500 leading-loose"></p>
        </div>
      </section>

      <section className="bg-[#4A1D1D] py-20 text-white overflow-hidden">
        <h3 className="text-center text-4xl md:text-5xl font-serif italic mb-20 tracking-tighter">
          {t.pages.about.values}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          {values.map((val, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white/20 mb-6 transition-transform duration-500 group-hover:scale-105">
                <img
                  src={val.img}
                  alt={val.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <span className="text-[10px] tracking-[0.4em] font-bold uppercase">
                {val.name}
              </span>
            </div>
          ))}
        </div>
      </section>

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

export default About;
