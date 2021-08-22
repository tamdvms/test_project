import i18next from 'i18next'
import { StorageKeys } from '../constants/index.js'
import en from './en.js'
import vi from './vi.js'

const resources = {
    en,
    vi
}

const initLanguage = localStorage.getItem(StorageKeys.appLanguage) || 'vi'

i18next.init({
    interpolation: {
        // React already does escaping
        escapeValue: false,
        format: function(value, format, lng) {
            if (format === 'uppercase') return value?.toUpperCase() || '';
            else if(format === 'lowercase') return value?.toLowerCase() || '';
            else if(format === 'capitalize') return `${value?.substr(0, 1).toUpperCase()}${value.substr(1)}` || '';
            return value;
        }
    },
    // keySeparator: false,
    // fallbackLng: 'en',
    lng: initLanguage,
    // Using simple hardcoded resources for simple example
    resources,
    missingKeyHandler: (lngs, namespace, key, res) => {
        console.debug({ lngs, namespace })
    },
})

// for debug
window.i18next = i18next

export default i18next
