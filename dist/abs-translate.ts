export type AbsTranslateTranslationKey = string;
export type AbsTranslateLanguageId = string;
export type AbsTranslateDictionary = AbsTranslateLanguage[];

export interface AbsTranslateLanguage {
  languageId: AbsTranslateLanguageId,
  content: Record<AbsTranslateTranslationKey, string>;
}

export interface AbsTranslateConfig {
  storageKey?: string;
  nodeAttributeSelector?: string;
  missingTranslationWarning?: boolean;
  dictionary?: AbsTranslateDictionary;
  initialLanguage?: AbsTranslateLanguageId;
}

export class AbsTranslate {
  constructor(config?: AbsTranslateConfig) {
    this.storageKey = config?.storageKey || AbsTranslate.DEFAULT_STORAGE_KEY;
    this.nodeAttributeSelector = config?.nodeAttributeSelector || AbsTranslate.DEFAULT_NODE_ATTRIBUTE_SELECTOR;
    this.missingTranslationWarning = config?.missingTranslationWarning || true;
    this._dictionary = config?.dictionary || [];
    this._currentLanguage = config?.initialLanguage || null;
    this._currentLanguage && this.translate();
  }

  public static readonly DEFAULT_STORAGE_KEY: string = 'abs.translate';
  public static readonly DEFAULT_NODE_ATTRIBUTE_SELECTOR: string = 'data-abs-translate';
  public readonly storageKey: string;
  public readonly nodeAttributeSelector: string;
  public readonly missingTranslationWarning: boolean;
  private _dictionary: AbsTranslateDictionary;
  private _currentLanguage: AbsTranslateLanguageId | null;
  private _previousLanguage: AbsTranslateLanguageId | null = null;

  public addLanguage(newLanguage: AbsTranslateLanguage): void {
    const previousLanguage = this._dictionary?.find(language => language.languageId === newLanguage.languageId);
    if(previousLanguage) {
      const mergedLanguage = {...previousLanguage, newLanguage};
      const languageIndex = this._dictionary?.findIndex(language => language.languageId === newLanguage.languageId);
      this._dictionary[languageIndex] = mergedLanguage;
    } else {
      this._dictionary.push(newLanguage);
    }
  }
  
  public removeLanguage(languageId: AbsTranslateLanguageId): AbsTranslateLanguage | null {
    const languageIndex = this._dictionary?.findIndex(language => language.languageId === languageId);
    if(languageIndex > -1) {
      const removedLanguage = this._dictionary?.splice(languageIndex, 1);
      return removedLanguage[0];
    } else {
      return null;
    }
  }

  public getCurrentLanguage(): AbsTranslateLanguageId | null {
    return this._currentLanguage;
  }
  
  public getPreviousLanguage(): AbsTranslateLanguageId | null {
    return this._previousLanguage;
  }

  public getCurrentLanguageDictionary(): AbsTranslateLanguage | null {
    const currentLanguage = this._dictionary?.find(language => language.languageId === this._currentLanguage);
    if(currentLanguage === undefined) {
      return null;
    } else {
      return AbsTranslate._utils.deepCopy(currentLanguage as Object) as AbsTranslateLanguage;
    }
  }

  public getGlobalDictionary(): AbsTranslateDictionary {
    return AbsTranslate._utils.deepCopy(this._dictionary) as AbsTranslateDictionary;
  }

  public getTranslation(
    translationKey: AbsTranslateTranslationKey,
    language: AbsTranslateLanguageId = this._currentLanguage as AbsTranslateLanguageId
  ): string | undefined {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const currentLanguageDictionary = this._dictionary?.find(dictionary => dictionary.languageId === language);
      if(language === undefined || language === null) throw `[ABS] Default language is not defined.`;
      if(currentLanguageDictionary === undefined) throw `[ABS] Language "${language}" not found.`;
      return currentLanguageDictionary.content[translationKey] || undefined;
    } catch (error) {
      console.error(error);
    }
  }
  
  public setLanguage(languageId: AbsTranslateLanguageId): void {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const selectedLanguage = this._dictionary.find(language => language.languageId === languageId)
      if(selectedLanguage === undefined) throw `[ABS] Language "${languageId}" not found.`;
      this._previousLanguage = this._currentLanguage;
      this._currentLanguage = languageId;
      this.storageKey && localStorage.setItem(this.storageKey, languageId);
      this.translate();
    } catch (error) {
      console.error(error);
    }
  }
  
  //TODO add option `targetOutput` for either `innerHTML`, data-attribute or other
  //TODO convert into async for better performance?
  //TODO add `onDoneCallback` parameter for big pages
  public translate(
    languageId: AbsTranslateLanguageId = this._currentLanguage as AbsTranslateLanguageId,
    scopeNode?: HTMLElement
  ): void {
    const nodeList: NodeListOf<HTMLElement> = scopeNode ?
      scopeNode.querySelectorAll(`[${this.nodeAttributeSelector}]`) :
      document.querySelectorAll(`[${this.nodeAttributeSelector}]`);
    nodeList.forEach(node => {
      const translationKey: AbsTranslateTranslationKey | null = node.getAttribute(this.nodeAttributeSelector);
      (translationKey === null && this.missingTranslationWarning) && console.warn(`[ABS] Translation key "${translationKey}" is not defined in language "${languageId}"`);
      if(translationKey) {
        const translation = this.getTranslation(translationKey, languageId);
        node.innerHTML = translation || translationKey;
      }
    });
  }

  private static readonly _utils = {
    deepCopy: (src: any): any => {
      const target: any = Array.isArray(src) ? [] : {};
      for(let key in src) {
        const v = src[key];
        if(v) {
          if (typeof v === 'object') {
            target[key] = this._utils.deepCopy(v);
          } else {
            target[key] = v;
          }
        } else {
          target[key] = v;
        }
      }
      return target;
    }
  }
}