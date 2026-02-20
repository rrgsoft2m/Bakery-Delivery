'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

import uz from '@/locales/uz/common.json';
import ru from '@/locales/ru/common.json';
import en from '@/locales/en/common.json';

type Locale = 'uz' | 'ru' | 'en';
type Translations = typeof uz;

const translations: Record<Locale, Translations> = { uz, ru, en };

interface I18nContextType {
    locale: Locale;
    t: (key: keyof Translations) => string;
    setLocale: (locale: Locale) => void;
    locales: Locale[];
}

const I18nContext = createContext<I18nContextType>({
    locale: 'uz',
    t: (key) => key,
    setLocale: () => { },
    locales: ['uz', 'ru', 'en'],
});

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('uz');

    useEffect(() => {
        const saved = localStorage.getItem('bakery-lang') as Locale;
        if (saved && translations[saved]) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('bakery-lang', newLocale);
    }, []);

    const t = useCallback((key: keyof Translations): string => {
        return translations[locale]?.[key] || translations.uz[key] || key;
    }, [locale]);

    return (
        <I18nContext.Provider value={{ locale, t, setLocale, locales: ['uz', 'ru', 'en'] }}>
            {children}
        </I18nContext.Provider>
    );
}

export const useI18n = () => useContext(I18nContext);
export type { Locale };
