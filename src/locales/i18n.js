import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import slovníků
import translationCS from './cs/translation.json';
import translationEN from './en/translation.json';

const resources = {
  cs: { translation: translationCS },
  en: { translation: translationEN }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "cs", // Výchozí jazyk
    fallbackLng: "en",
    interpolation: { 
      escapeValue: false 
    }
  });

export default i18n;