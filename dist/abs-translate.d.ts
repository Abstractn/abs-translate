export type AbsTranslateTranslationKey = string;
export type AbsTranslateLanguageId = string;
export type AbsTranslateDictionary = AbsTranslateLanguage[];
export interface AbsTranslateLanguage {
  languageId: AbsTranslateLanguageId;
  content: Record<AbsTranslateTranslationKey, string>;
}
export interface AbsTranslateConfig {
  storageKey?: string;
  nodeAttributeSelector?: string;
  missingTranslationWarning?: boolean;
  dictionary?: AbsTranslateDictionary;
  initialLanguage?: AbsTranslateLanguageId;
}
export declare class AbsTranslate {
  constructor(config?: AbsTranslateConfig);
  static readonly DEFAULT_STORAGE_KEY: string;
  static readonly DEFAULT_NODE_ATTRIBUTE_SELECTOR: string;
  readonly storageKey: string;
  readonly nodeAttributeSelector: string;
  readonly missingTranslationWarning: boolean;
  private _dictionary;
  private _currentLanguage;
  private _previousLanguage;
  addLanguage(newLanguage: AbsTranslateLanguage): void;
  removeLanguage(languageId: AbsTranslateLanguageId): AbsTranslateLanguage | null;
  getCurrentLanguage(): AbsTranslateLanguageId | null;
  getPreviousLanguage(): AbsTranslateLanguageId | null;
  getCurrentLanguageDictionary(): AbsTranslateLanguage | null;
  getGlobalDictionary(): AbsTranslateDictionary;
  getTranslation(translationKey: AbsTranslateTranslationKey, language?: AbsTranslateLanguageId): string | undefined;
  setLanguage(languageId: AbsTranslateLanguageId): void;
  translate(languageId?: AbsTranslateLanguageId, scopeNode?: HTMLElement): void;
  private static readonly _utils;
}