import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import en from './locales/en.json';
import nl from './locales/nl.json';

// Detect device locale without expo-localization (no native build needed)
const rawLocale: string =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale ??
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ??
          'en'
        : NativeModules.I18nManager?.localeIdentifier ?? 'nl';

const deviceLanguage = rawLocale.startsWith('nl') ? 'nl' : 'en';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        nl: { translation: nl },
    },
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
