import { createI18n } from 'vue-i18n';
import ko from './locales/ko.json';
import en from './locales/en.json';
import zh from './locales/zh.json';

const STORAGE_KEY = 'wedding-locale';

export const messages = { ko, en, zh };
export type Locale = keyof typeof messages;

export function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in messages) return saved as Locale;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ko')) return 'ko';
  return 'zh';
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh',
  messages,
});

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

document.documentElement.lang = i18n.global.locale.value;
