import { useState, useEffect } from 'react';
import { getLanguage, getTranslations, type Language } from '../utils/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getLanguage);
  const [translations, setTranslations] = useState(getTranslations(language));

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<{ language: Language }>) => {
      const newLang = event.detail.language;
      setLanguage(newLang);
      setTranslations(getTranslations(newLang));
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  return { language, translations, t: (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }};
}

