import DE from '../resources/translation.de.json';
import EN from '../resources/translation.de.json';
import DK from '../resources/translation.dk.json';

class Globalizer {
    preferedLanguage: string;
    defaultLanguage: string;

    constructor(
        preferedLanguage: string,
        defaultLanguage: string) {
            this.preferedLanguage = preferedLanguage;
            this.defaultLanguage = defaultLanguage;
    }

    resolveText = (resourceId: string) => {
        const preferedTranslation = this.tryGetResourceDictionary(this.preferedLanguage);
        if(preferedTranslation && preferedTranslation[resourceId]) {
            return preferedTranslation[resourceId];
        }
        const defaultTranslation = this.tryGetResourceDictionary(this.defaultLanguage);
        if(defaultTranslation && defaultTranslation[resourceId]) {
            return defaultTranslation[resourceId];
        }
        throw new Error(`Cannot resolve resource '${resourceId}'`);
    }

    tryGetResourceDictionary = (language: string): { [key: string]: string } | false => {
        switch(language.toLocaleLowerCase()) {
            case 'en':
                return EN;
            case 'de':
                return DE;
            case 'dk':
                return DK;
        }
        return false;
    }
}
const defaultGlobalizer = new Globalizer('de', 'en');

export function setLanguage(languageId: string): void {
    defaultGlobalizer.preferedLanguage = languageId;
}
export function getPreferedLanguage(): string {
    return defaultGlobalizer.preferedLanguage;
}
export function getFallbackLanguage(): string {
    return defaultGlobalizer.defaultLanguage;
}

export function resolveText(resourceId: string): string {
    return defaultGlobalizer.resolveText(resourceId);
}