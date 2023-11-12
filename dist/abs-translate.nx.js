var _a;
class AbsTranslate {
    constructor(config) {
        this._previousLanguage = null;
        this.storageKey = (config === null || config === void 0 ? void 0 : config.storageKey) || _a.DEFAULT_STORAGE_KEY;
        this.nodeAttributeSelector = (config === null || config === void 0 ? void 0 : config.nodeAttributeSelector) || _a.DEFAULT_NODE_ATTRIBUTE_SELECTOR;
        this.missingTranslationWarning = (config === null || config === void 0 ? void 0 : config.missingTranslationWarning) || true;
        this._dictionary = (config === null || config === void 0 ? void 0 : config.dictionary) || [];
        this._currentLanguage = (config === null || config === void 0 ? void 0 : config.initialLanguage) || null;
        this._currentLanguage && this.translate();
    }
    addLanguage(newLanguage) {
        var _b, _c;
        const previousLanguage = (_b = this._dictionary) === null || _b === void 0 ? void 0 : _b.find(language => language.languageId === newLanguage.languageId);
        if (previousLanguage) {
            const mergedLanguage = Object.assign(Object.assign({}, previousLanguage), { newLanguage });
            const languageIndex = (_c = this._dictionary) === null || _c === void 0 ? void 0 : _c.findIndex(language => language.languageId === newLanguage.languageId);
            this._dictionary[languageIndex] = mergedLanguage;
        }
        else {
            this._dictionary.push(newLanguage);
        }
    }
    removeLanguage(languageId) {
        var _b, _c;
        const languageIndex = (_b = this._dictionary) === null || _b === void 0 ? void 0 : _b.findIndex(language => language.languageId === languageId);
        if (languageIndex > -1) {
            const removedLanguage = (_c = this._dictionary) === null || _c === void 0 ? void 0 : _c.splice(languageIndex, 1);
            return removedLanguage[0];
        }
        else {
            return null;
        }
    }
    getCurrentLanguage() {
        return this._currentLanguage;
    }
    getPreviousLanguage() {
        return this._previousLanguage;
    }
    getCurrentLanguageDictionary() {
        var _b;
        const currentLanguage = (_b = this._dictionary) === null || _b === void 0 ? void 0 : _b.find(language => language.languageId === this._currentLanguage);
        if (currentLanguage === undefined) {
            return null;
        }
        else {
            return _a._utils.deepCopy(currentLanguage);
        }
    }
    getGlobalDictionary() {
        return _a._utils.deepCopy(this._dictionary);
    }
    getTranslation(translationKey, language = this._currentLanguage) {
        var _b;
        try {
            if (this._dictionary === undefined)
                throw `[ABS] Dictionary is not defined.`;
            const currentLanguageDictionary = (_b = this._dictionary) === null || _b === void 0 ? void 0 : _b.find(dictionary => dictionary.languageId === language);
            if (language === undefined || language === null)
                throw `[ABS] Default language is not defined.`;
            if (currentLanguageDictionary === undefined)
                throw `[ABS] Language "${language}" not found.`;
            return currentLanguageDictionary.content[translationKey] || undefined;
        }
        catch (error) {
            console.error(error);
        }
    }
    setLanguage(languageId) {
        try {
            if (this._dictionary === undefined)
                throw `[ABS] Dictionary is not defined.`;
            const selectedLanguage = this._dictionary.find(language => language.languageId === languageId);
            if (selectedLanguage === undefined)
                throw `[ABS] Language "${languageId}" not found.`;
            this._previousLanguage = this._currentLanguage;
            this._currentLanguage = languageId;
            this.storageKey && localStorage.setItem(this.storageKey, languageId);
            this.translate();
        }
        catch (error) {
            console.error(error);
        }
    }
    translate(languageId = this._currentLanguage, scopeNode) {
        const nodeList = scopeNode ?
            scopeNode.querySelectorAll(`[${this.nodeAttributeSelector}]`) :
            document.querySelectorAll(`[${this.nodeAttributeSelector}]`);
        nodeList.forEach(node => {
            const translationKey = node.getAttribute(this.nodeAttributeSelector);
            (translationKey === null && this.missingTranslationWarning) && console.warn(`[ABS] Translation key "${translationKey}" is not defined in language "${languageId}"`);
            if (translationKey) {
                const translation = this.getTranslation(translationKey, languageId);
                node.innerHTML = translation || translationKey;
            }
        });
    }
}
_a = AbsTranslate;
AbsTranslate.DEFAULT_STORAGE_KEY = 'abs.translate';
AbsTranslate.DEFAULT_NODE_ATTRIBUTE_SELECTOR = 'data-abs-translate';
AbsTranslate._utils = {
    deepCopy: (src) => {
        const target = Array.isArray(src) ? [] : {};
        for (let key in src) {
            const v = src[key];
            if (v) {
                if (typeof v === 'object') {
                    target[key] = _a._utils.deepCopy(v);
                }
                else {
                    target[key] = v;
                }
            }
            else {
                target[key] = v;
            }
        }
        return target;
    }
};
//# sourceMappingURL=abs-translate.js.map