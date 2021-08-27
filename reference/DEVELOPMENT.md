fullstack-phone Development
======================

### (Work In Progress 🚧)

Supporting Tools
---

* [Google Closure Compiler Service](https://developers.google.com/closure/compiler/docs/api-ref)

Locally installed by `bin/update.sh` under the `vendor/` folder:

- [Google libphonenumber](https://github.com/googlei18n/libphonenumber)

To update libphonenumber, run `npm update` and provide the desired libphonenumber tag:

```bash
npm run update -- v8.9.14
```

Usage
-----

To install or pull in a libphonenumber update, run:

```bash
$ npm run update -- [LIBPHONENUMBER TAG]
# this executes bin/update.sh
```

To extract the regional metadata and compile the client code with the Google Closure Compiler Service, run:

```bash
$ npm run build
# this executes bin/build.sh
```

To run tests:

```bash
$ npm install
$ npm test
```

Local Compilation (Alternative)
------------

Ant and Maven:
```bash
$ brew install ant
$ brew install maven
```

Edit `./bin/local/update.sh` and run to install Google Closure Library & Google Closure Compiler and compile the project.

Output
------

The generated files are placed in the `server/metadata/` and `client/`folders.

### metadata/

`metadata.json` contains the individual metadata needed by for each region, which is extracted by the `loadMeta` module.

* Note that the `'001'` section in this file contains metadata for ["non-geographical entities"](https://github.com/googlei18n/libphonenumber/blob/master/resources/PhoneNumberMetadata.xml#L19) (Universal International Toll Free Number, Universal International Shared Cost Number, Inmarsat Global Limited, VISIONng, Iridium, etc.). `'001'` can be passed as a region code to `loadMeta` to load this metadata.

`dependencyMap.json` contains the information needed by `loadMeta` to determine which regions depend on other regions for loading metadata (e.g. KZ metadata requires RU metadata to be bundled with it, since RU is the main country for calling code 7).

### client/index.js

This is the Closure-compiled result of processing the files in `src/` with their Closure dependencies.

How It Works
------------

### Terminology

In order to make sense of the code, the distinction between `regionCode` and `countryCode` must be kept absolutely clear:

- `regionCode` = ISO 3166-1 alpha-2 code (e.g. 'AU', 'US', 'GB')
- `countryCode` = country calling code (e.g. 61 for AU, 1 for US, 44 for GB)

For example, `regionCodeToCountryCodeMap` maps from 'AU' to 61', while `countryCodeToRegionCodeMap` maps from '61' to 'AU', 'CC', and 'CX' (all the regions that share calling code 61).

### bin/update.sh

TODO

### bin/build.sh

TODO

### util/metadataExtractor.js

During the build process, `metadataExtractor.js` is run in a simulated Google Closure context to access the compiled libphonenumber metadata in `libphonenumber/javascript/i18n/phonenumbers/metadata.js`. It:

- extracts the metadata for each region (+ the non-geographical entities) into `server/metadata/metadata.json`
- "fakes" the metadata for PN, XK, and AN by copying from other regions
- creates `dependencyMap.json` to map between regions and country codes and indicate which regions depend on other regions

### server/loadMeta.js

The `loadMeta.js` module takes an array of region codes and uses the information in `dependencyMap.json` to return the appropriate set of regional metadata from `server/metadata/metadata.json`. For example:

```js
loadMeta(['CC']); // load phone metadata for Cocos Island

// Cocos Island uses country calling code 61
// Australia is the main country for calling code 61
// so CC metadata depends on having AU metadata present
// therefore, returned metadata is:

{ regionCodes: [ 'CC', 'AU' ],
  countryCodeToRegionCodeMap: { '61': [ 'AU', 'CC' ] },
  countryToMetadata:
   { CC: <CC METADATA HERE>,
     AU: <AU METADATA HERE>
   }
}
```

### src/injectMeta.js

The libphonenumber `phonenumberutil.js` Closure module contains this line, which tells the Closure compiler that it requires the `i18n.phonenumbers.metadata` module:

```js
goog.require('i18n.phonenumbers.metadata');
```

The corresponding `provide` statement is found in libphonenumber `metadata.js`, a JavaScript version of the phone metadata compiled from `PhoneNumberMetadata.xml`.

```js
goog.provide('i18n.phonenumbers.metadata');
```

This `metadata.js` module stores its metadata in two variables:

```js
i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = {
1:["US","AG" ...

i18n.phonenumbers.metadata.countryToMetadata = {
"AC": ...
}
```

To provide metadata injection functionality, `metadata.js` is excluded from the build process here, and `injectMeta` is included instead, with its own `goog.provide('i18n.phonenumbers.metadata')` statement to "trick" `phonenumberutil.js` into believing that it has the metadata it needs.

But `injectMeta.js` actually contains no metadata itself. Rather, it provides an `injectMeta` function (called by `phoneAdapter.js`) taking two parameters, and simply sets `i18n.phonenumbers.metadata.countryCodeToRegionCodeMap` and `i18n.phonenumbers.metadata.countryToMetadata` to those two parameters.

### src/phoneAdapter.js

TODO
