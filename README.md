libphonenumber-builder
======================

Custom build system on top of Google libphonenumber to provide compressed version with dynamic regional metadata loading.

Extended from [Nathan Hammond's project](https://github.com/nathanhammond/libphonenumber).

Contents
--------
- [Prerequisites](#prerequisites)
- [Supporting Tools](#supporting-tools)
- [Usage](#usage)
- [Output](#output)
  - [metadata/](#metadata-)
  - [loadMeta.js](#loadmeta-js)
  - [libphonenumber.js](#libphonenumber-js)
  - [libphonenumber_full.js](#libphonenumber_full-js)
- [Custom Methods](#custom-methods)
  - [useMeta](#usemeta)
  - [getSupportedRegions](#getsupportedregions)
  - [countryCodeToRegionCodeMap](#countrycodetoregioncodemap)
  - [getCountryCodeForRegion](#getcountrycodeforregion)
  - [formatPhoneNumber](#formatphonenumber)
  - [validatePhoneNumber](#validatephonenumber)
  - [parsePhoneNumber](#parsephonenumber)
  - [AsYouType Formatter Methods](#asyoutype-formatter-methods)
    - [setRegion](#setregion)
    - [inputDigit](#inputdigit)
    - [clear](#clear)
- [How It works](#how-it-works)

Prerequisites
------------

Ant and Maven:
```bash
$ brew install ant
$ brew install maven
```

Supporting Tools
---

Installed by `build.sh` under the `vendor/` folder:

- [Google Closure Library](https://github.com/google/closure-library)
- [Google Closure Compiler](https://github.com/google/closure-compiler)
- [Google libphonenumber](https://github.com/googlei18n/libphonenumber)

Usage
-----

If running for the first time, execute:

```bash
$ ./build.sh
```

This clones/updates all the supporting tools (google closure library, closure compiler, and libphonenumber), compiles the closure compiler (with Maven), and runs the libphonenumber builder in this repo with Ant (based on `build.xml`).


Thereafter, unless libphonenumber needs to be updated, execute:

```bash
$ ./build_quick.sh
```

This runs only the Ant compilation tasks in `build.xml`.

To run tests:

```bash
$ npm install # installs mocha and ramdajs
$ npm test
```

Output
------

The generated files are placed in the `dist/` folder:

### metadata/

The JSON files in this subfolder contain the individual metadata needed by libphonenumber for each region, and are loaded by the `loadMeta` module (described in the next section). Two extra files should be noted:

- `001.json`: This file contains metadata for ["non-geographical entities"](https://github.com/googlei18n/libphonenumber/blob/master/resources/PhoneNumberMetadata.xml#L19) (Universal International Toll Free Number, Universal International Shared Cost Number, Inmarsat Global Limited, VISIONng, Iridium, etc.). '001' can be passed as a region code to `loadMeta` to load this metadata, but so far this appears unnecessary for our purposes.

- `dependencyMap.json`: This file contains the information needed by `loadMeta` to determine which regions depend on other regions for loading metadata (e.g. KZ metadata requires RU metadata to be bundled with it, since RU is the main country for calling code 7).

### loadMeta.js

The module for loading appropriate regional metadata based on  country code dependencies, to be passed to the custom libphonenumber module. The `require` lines in this module should be modified to point to wherever the `metadata/` folder is located. Note: this module depends on the [Ramda library](https://www.npmjs.com/package/ramda).

  The metadata loader is used as follows:

```javascript
var loadMeta = require('./loadMeta.js');
var meta = loadMeta(['CA', 'KZ']); // array of region codes to be supported
// 'meta' variable now has metadata for CA, US, KZ, and RU
```

### libphonenumber.js

The custom libphonenumber module with hooks for injecting regional metadata. It can be initialized as follows:

```javascript
var libphonenumber = require('./libphonenumber.js');
var loadMeta = require('./loadMeta.js');
var meta = loadMeta(['CA', 'KZ']); // load necessary metadata for CA and KZ (includes US and RU)
libphonenumber.useMeta(meta); // inject this metadata to libphonenumber
// at this point libphonenumber is ready to use
```

(The custom methods provided by this module are described [below](#custom-methods).)

### libphonenumber_full.js

The custom libphonenumber module compiled with all metadata __already included__. The module can therefore be used __without the metadata loader__, but the regions must be intialized as follows:

```javascript
var libphonenumber = require('./libphonenumber_full.js');
var meta = { regionCodes: ['US', 'CA', 'AU'] }; // construct array of all region codes desired
libphonenumber.useMeta(meta); // tell libphonenumber which regions to support
```

Custom Methods
--------------

The methods provided by the custom `libphonenumber` module are as follows:

### useMeta
#### `useMeta(metadata)`

Inject regional metadata from the `loadMeta` module.

### getSupportedRegions
#### `getSupportedRegions()`

Return array of supported region codes.

### countryCodeToRegionCodeMap
#### `countryCodeToRegionCodeMap()`

Return map from country calling codes to array of supported regions, e.g. `{'7': [ 'RU', 'KZ' ]}`

###  getCountryCodeForRegion
#### `getCountryCodeForRegion(regionCode)`

Given a `regionCode` (assuming metadata has already been loaded for that region), return its country calling code:

```javascript
libphonenumber.getCountryCodeForRegion('RU'); // 7
```

### formatPhoneNumber
#### `formatPhoneNumber(canonicalPhone, options)`

Given a `canonicalPhone` object (with string properties `countryCode` and `nationalNumber`), and `options` object (with string property `style`: 'national', 'international', 'E164' or 'RFC3699'), return formatted phone number:

```javascript
var phone = { countryCode: '1', nationalNumber: '5101234567' };
var options = { style: 'international' };
libphonenumber.formatPhoneNumber(phone, options); // '+1 510-123-4567'

options.style = 'national';
libphonenumber.formatPhoneNumber(phone, options); // '(510) 123-4567'
```

### validatePhoneNumber
#### `validatePhoneNumber(canonicalPhone, regionCode)`

Given a `canonicalPhone` object (defined above) and `regionCode`, return Error object or indicating any problems with the phone object (or empty object if it passed validation):

```javascript
var phone = { countryCode: '1', nationalNumber: '5' };
libphonenumber.validatePhoneNumber(phone, 'US'); // [Error: PHN_NUMBER_TOO_SHORT]
```

### parsePhoneNumber
#### `parsePhoneNumber(phoneNumberToParse, regionCode)`

Given a string `phoneNumberToParse` and `regionCode`, return a `canonicalPhone` object or an Error object if the number is invalid:

```javascript
libphonenumber.parsePhoneNumber('5101234567', 'US'); // { countryCode: '1', nationalNumber: '5101234567' }

libphonenumber.parsePhoneNumber('ABC', 'US'); //[Error: PHN_NOT_A_NUMBER]
```

### AsYouType Formatter Methods

The AsYouType Formatter methods are namespaced under the `asYouType` object. Note that these methods are stateful, depending on an AsYouType initialized by the `setRegion` method:

#### setRegion
##### `asYouType.setRegion(regionCode)`

Set the particular region (out of the supported regions) for which to initialize the AsYouType Formatter.

#### inputDigit
##### `asYouType.inputDigit(digit)`

Given a string `digit`, return the formatted phone number up to that point:

```javascript
libphonenumber.asYouType.setRegion('US');

libphonenumber.asYouType.inputDigit('9') // '9'
libphonenumber.asYouType.inputDigit('1') // '91'
libphonenumber.asYouType.inputDigit('9') // '919'
libphonenumber.asYouType.inputDigit('2') // '919-2'
libphonenumber.asYouType.inputDigit('8') // '919-28'
libphonenumber.asYouType.inputDigit('2') // '919-282'
libphonenumber.asYouType.inputDigit('3') // '919-2823' (a phone number without area code)
libphonenumber.asYouType.inputDigit('4') // '(919) 282-34'
libphonenumber.asYouType.inputDigit('5') // '(919) 282-345'
libphonenumber.asYouType.inputDigit('6') // '(919) 282-3456'
```

#### clear
##### `asYouType.clear()`

Clear the history of digits passed to `inputDigit`.

How It Works
------------

TODO

- `metadataExtractor.js`

- `loadMeta.js`

- `phoneAdapter.js`

- `metadataInjector.js`

  - `metadataInjectorNoop.js`