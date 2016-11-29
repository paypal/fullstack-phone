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
  - [loadPhoneMeta.js](#loadphonemeta-js)
  - [phoneUtil.js](#phoneUtil-js)
  - [phoneUtil_full.js](#phoneUtil_full-js)
- [Custom Methods](#custom-methods)
  - [useMeta](#usemeta)
  - [getSupportedRegions](#getsupportedregions)
  - [countryCodeToRegionCodeMap](#countrycodetoregioncodemap)
  - [getCountryCodeForRegion](#getcountrycodeforregion)
  - [formatPhoneNumber](#formatphonenumber)
  - [validatePhoneNumber](#validatephonenumber)
  - [parsePhoneNumber](#parsephonenumber)
  - [getExampleNumberForType](#getexamplenumberfortype)
  - [getAsYouTypeFormatter](#getasyoutypeformatter)
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

The JSON files in this subfolder contain the individual metadata needed by `phoneUtil` for each region, and are loaded by the `loadPhoneMeta` module (described in the next section). Two extra files should be noted:

- `001.json`: This file contains metadata for ["non-geographical entities"](https://github.com/googlei18n/libphonenumber/blob/master/resources/PhoneNumberMetadata.xml#L19) (Universal International Toll Free Number, Universal International Shared Cost Number, Inmarsat Global Limited, VISIONng, Iridium, etc.). '001' can be passed as a region code to `loadPhoneMeta` to load this metadata, but so far this appears unnecessary for our purposes.

- `dependencyMap.json`: This file contains the information needed by `loadPhoneMeta` to determine which regions depend on other regions for loading metadata (e.g. KZ metadata requires RU metadata to be bundled with it, since RU is the main country for calling code 7).

### loadPhoneMeta.js

The module for loading appropriate regional metadata based on  country code dependencies, to be passed to the custom `phoneUtil` module. The `require` lines in this module should be modified to point to wherever the `metadata/` folder is located. Note: this module depends on the [Ramda library](https://www.npmjs.com/package/ramda).

  The metadata loader is used as follows:

```javascript
var loadPhoneMeta = require('./loadPhoneMeta.js');
var meta = loadPhoneMeta(['CA', 'KZ']); // array of region codes to be supported
// 'meta' variable now has metadata for CA, US, KZ, and RU
```

### phoneUtil.js

The custom phone module with hooks for injecting regional metadata. It can be initialized as follows:

```javascript
var phoneUtil = require('./phoneUtil.js');
var loadPhoneMeta = require('./loadPhoneMeta.js');
var meta = loadPhoneMeta(['CA', 'KZ']); // load necessary metadata for CA and KZ (includes US and RU)
phoneUtil.useMeta(meta); // inject this metadata to phoneUtil
// at this point phoneUtil is ready to use
```

(The custom methods provided by this module are described [below](#custom-methods).)

### phoneUtil.js

The custom phone module compiled with all metadata __already included__. The module can therefore be used __without the metadata loader__, but the regions must be intialized as follows:

```javascript
var phoneUtil = require('./phoneUtil.js');
var meta = { regionCodes: ['US', 'CA', 'AU'] }; // construct array of all region codes desired
phoneUtil.useMeta(meta); // tell phoneUtil which regions to support
```

Custom Methods
--------------

The methods provided by the custom `phoneUtil` module are as follows:

### useMeta
#### `useMeta(metadata)`

Inject regional metadata from the `loadPhoneMeta` module.

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
phoneUtil.getCountryCodeForRegion('RU'); // 7
```

### formatPhoneNumber
#### `formatPhoneNumber(phoneObj, options)`

Given a `phoneObj` object (with string properties `countryCode` and `nationalNumber`), and `options` object (with string property `style`: 'national', 'international', 'E164' or 'RFC3699'), return formatted phone number.

The phone object is defined as follows:

```
{
  countryCode : {string or number} country calling code (e.g. '1'); DIGITS ONLY [required]
  nationalNumber : {string or number} phone number, (e.g. '4085551212'); DIGITS ONLY [required]
  extension : {string} phone extension (e.g. '123') [optional]
}```

#### Example

```javascript
var phone = { countryCode: '1', nationalNumber: '5101234567' };
var options = { style: 'international' };
phoneUtil.formatPhoneNumber(phone, options); // '+1 510-123-4567'

options.style = 'national';
phoneUtil.formatPhoneNumber(phone, options); // '(510) 123-4567'
```

### validatePhoneNumber
#### `validatePhoneNumber(phoneObj, regionCode)`

Given a `phoneObj` object (defined above) and `regionCode`, return Error object or indicating any problems with the phone object (or true if it passed validation):

```javascript
var phone = { countryCode: '1', nationalNumber: '5' };
phoneUtil.validatePhoneNumber(phone, 'US'); // [Error: PHN_NUMBER_TOO_SHORT]
```

### parsePhoneNumber
#### `parsePhoneNumber(phoneNumberToParse, regionCode)`

Given a string `phoneNumberToParse` and `regionCode`, return a `phoneObj` object or an Error object if the number is invalid:

```javascript
phoneUtil.parsePhoneNumber('5101234567', 'US'); // { countryCode: '1', nationalNumber: '5101234567' }

phoneUtil.parsePhoneNumber('ABC', 'US'); // [Error: PHN_NOT_A_NUMBER]
```

### getExampleNumberForType
#### `getExampleNumberForType(regionCode, type)`

Given the string parameters `regionCode` and `type` ('GENERAL', 'MOBILE', 'FIXED_LINE', 'FIXED_LINE_OR_MOBILE', 'PREMIUM_RATE', 'VOIP', 'TOLL_FREE', etc.) return a `phoneObj` object with an example number for that type:

```javascript
phoneUtil.getExampleNumberForType('US', 'MOBILE'); // { countryCode: '1', nationalNumber: '2015550123' }
```

### getAsYouTypeFormatter
#### `getAsYouTypeFormatter(regionCode)`

Returns a new AsYouTypeFormatter object instantiated for the given region.

#### Exceptions

The function will throw the following exception if an invalid parameter is supplied:

* PHN_UNSUPPORTED_REGION: region code not supported/valid

#### Example
```javascript
var formatter = phoneUtil.getAsYouTypeFormatter('GB'); // returns AsYouTypeFormatter object initialized to Great Britain
```

The AsYouTypeFormatter object contains the following methods:

### inputDigit
#### `formatter.inputDigit(digit)`

Given a digit (number or string), output the phone number formatted thus far, given the history of inputted digits.

#### Parameter
* `digit`: A digit (as number or string); can include '+' and '*'

#### Output

Returns a string representing the phone number formatted so far.

#### Example
```javascript
formatter.inputDigit('5'); // '5'
formatter.inputDigit('1'); // '51'
formatter.inputDigit('0'); // '510'
formatter.inputDigit('1'); // '510-1'
formatter.inputDigit('2'); // '510-12'
formatter.inputDigit('3'); // '510-123'
formatter.inputDigit('4'); // '510-1234'
formatter.inputDigit('5'); // '(510) 123-45'
formatter.inputDigit('6'); // '(510) 123-456'
formatter.inputDigit('7'); // '(510) 123-4567'
```

### clear
#### `formatter.clear()`

Clears the formatter state.

#### Example
```javascript
formatter.inputDigit('5'); // '5'
formatter.inputDigit('1'); // '51'
formatter.inputDigit('0'); // '510'
formatter.inputDigit('1'); // '510-1'
formatter.inputDigit('2'); // '510-12'
formatter.clear();
formatter.inputDigit('9'); // '9'
formatter.inputDigit('1'); // '91'
formatter.inputDigit('9'); // '919'
formatter.inputDigit('4'); // '919-4'
formatter.inputDigit('8'); // '919-48'
...
```

How It Works
------------

TODO

- `metadataExtractor.js`

- `loadPhoneMeta.js`

- `phoneAdapter.js`

- `metadataInjector.js`

  - `metadataInjectorNoop.js`