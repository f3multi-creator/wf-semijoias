// UTM Tracking Utility
// Captura e armazena parâmetros UTM da URL para rastrear a origem das conversões

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_STORAGE_KEY = 'wf_utm_params';

export interface UTMData {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    landing_page?: string;
    timestamp?: string;
}

// Capturar UTM params da URL atual e salvar no sessionStorage
export function captureUTMParams(): UTMData | null {
    if (typeof window === 'undefined') return null;

    const searchParams = new URLSearchParams(window.location.search);
    const utmData: UTMData = {};
    let hasUTM = false;

    for (const param of UTM_PARAMS) {
        const value = searchParams.get(param);
        if (value) {
            utmData[param] = value;
            hasUTM = true;
        }
    }

    if (hasUTM) {
        utmData.landing_page = window.location.pathname;
        utmData.timestamp = new Date().toISOString();

        // Salvar no sessionStorage (persiste durante a sessão)
        try {
            sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
        } catch {
            // sessionStorage pode estar indisponível
        }

        console.log('[UTM] Parâmetros capturados:', utmData);
        return utmData;
    }

    return null;
}

// Recuperar UTM params salvos
export function getStoredUTMParams(): UTMData | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

// Retornar UTM params como query string para anexar a requisições
export function getUTMQueryString(): string {
    const utmData = getStoredUTMParams();
    if (!utmData) return '';

    const params = new URLSearchParams();
    for (const param of UTM_PARAMS) {
        if (utmData[param]) {
            params.set(param, utmData[param]!);
        }
    }

    return params.toString();
}
