// Telegram WebApp SDK types and utilities
declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
        };
        query_id?: string;
    };
    colorScheme: 'light' | 'dark';
    themeParams: Record<string, string>;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        setText: (text: string) => void;
        onClick: (cb: () => void) => void;
        offClick: (cb: () => void) => void;
        showProgress: (leaveActive?: boolean) => void;
        hideProgress: () => void;
    };
    BackButton: {
        isVisible: boolean;
        show: () => void;
        hide: () => void;
        onClick: (cb: () => void) => void;
        offClick: (cb: () => void) => void;
    };
    ready: () => void;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    requestLocation: (callback: (data: any) => void) => void;
}

export function getTelegramWebApp(): TelegramWebApp | null {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        return window.Telegram.WebApp;
    }
    return null;
}

export function isTelegramMiniApp(): boolean {
    return !!getTelegramWebApp()?.initData;
}

export function getTelegramUser() {
    const webapp = getTelegramWebApp();
    return webapp?.initDataUnsafe?.user || null;
}

export function getTelegramColorScheme(): 'light' | 'dark' {
    const webapp = getTelegramWebApp();
    return webapp?.colorScheme || 'light';
}

export function setupTelegramMainButton(text: string, onClick: () => void) {
    const webapp = getTelegramWebApp();
    if (!webapp) return;
    webapp.MainButton.setText(text);
    webapp.MainButton.onClick(onClick);
    webapp.MainButton.show();
}

export function hideTelegramMainButton() {
    const webapp = getTelegramWebApp();
    if (!webapp) return;
    webapp.MainButton.hide();
}
