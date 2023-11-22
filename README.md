# Abs-Translate

[![npm version](https://badgen.net/npm/v/abs-translate)](https://www.npmjs.com/package/abs-translate) [![Install size](https://packagephobia.com/badge?p=abs-translate)](https://packagephobia.com/result?p=abs-translate)


## Introduction:

This module offers a quick translation system using local dictionaries.


## CDN:

Typescript:
```https://abstractn.github.io/lib/abs-translate.ts```

Javascript (with export):
```https://abstractn.github.io/lib/abs-translate.js```

Javascript (without export):
```https://abstractn.github.io/lib/abs-translate.nx.js```

Browser iclusion:
```<script src="https://abstractn.github.io/lib/abs-translate.nx.js"></script>```


## Dictionaries

You can have your dictionaries from dedicated JSON files or defined directly from code as objects.
This is what one would look like:
```typescript
@import { AbsTranslateLanguage } from 'abs-translate';
const myEnglishDictionary: AbsTranslateLanguage = {
  languageId: 'english',
  content: {
    'example-text-1': 'Example text #1',
    'example-text-2': 'Example text #2',
  }
}
const myItalianDictionary: AbsTranslateLanguage = {
  languageId: 'italian',
  content: {
    'example-text-1': 'Testo di esempio #1',
    'example-text-2': 'Testo di esempio #2',
  }
}
```
Note how the keys inside `content` ("translation keys") are the same for all languages.
These translation keys are going to be what the HTML page references instead of directly printing text.

```html
<span data-abs-translate="example-text-1"></span>
<span data-abs-translate="example-text-2"></span>
```
Now you can have a custom language selector that calls `.setLanguage(languageId: string)` and all translatable nodes will automatically switch language without needing to reload the page.
> NOTE: this module has not been tested with pages containing high amount of content so this system may result in poor performance.