import React, { createContext, useContext, useState } from "react";
interface LocaleState {
  country: string;
  language: string;
  currency: string;
}
interface LocaleContextType {
  locale: LocaleState;
  updateLocale: (newLocale: Partial<LocaleState>) => void;
}
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<LocaleState>({
    country: "PE",
    language: "es",
    currency: "PEN (S/)",
  });
  const updateLocale = (newLocale: Partial<LocaleState>) => {
    setLocale((prev) => ({ ...prev, ...newLocale }));
    localStorage.setItem(
      "nova_locale",
      JSON.stringify({ ...locale, ...newLocale }),
    );
  };
  return (
    <LocaleContext.Provider value={{ locale, updateLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale debe usarse dentro de LocaleProvider");
  return context;
};
