import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations.js';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'हिंदी (Hindi)', shortLabel: 'HI' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)', shortLabel: 'OR' },
];

export function LanguageProvider({ children }) {
  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved && ['en', 'hi', 'or'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('language', language);
    // Optionally set html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (langCode) => {
    if (['en', 'hi', 'or'].includes(langCode)) {
      setLanguage(langCode);
    }
  };

  // Translation helper function supporting nested keys (dot notation)
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English if translation is missing
        let fallbackValue = translations['en'];
        for (const fk of keys) {
          if (fallbackValue && fallbackValue[fk] !== undefined) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key; // return the raw key as a absolute fallback
          }
        }
        return fallbackValue;
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
