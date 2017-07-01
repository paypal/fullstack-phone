fullstack-phone ☎️
======================

**fullstack-phone** provides formatting, validation, and parsing of phone numbers per-region. The system is optimized for use as two modules:

1. a metadata server providing dynamic regional metadata
2. a lightweight phone client (~25KB)

This project was extended from [Nathan Hammond's project](https://github.com/nathanhammond/libphonenumber), which itself is an adaptation of [Google's libphonenumber](https://github.com/googlei18n/libphonenumber/) library.

Contents
--------
- [Usage](#usage)
- Why
- Server API
  - loadMeta
- [Client API](#client-api)
  - createHandler
- Phone Handler API
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
- Development

## Usage

The modules are optimized for use in two environments.

On the server:

```js
// Node.js:
var phoneServer = require('fullstack-phone/server');

var metadata = phoneServer.loadMeta(['US']); // load only US metadata
// now serve the metadata via some REST API or write it to a file for bundling with client code
```

On the client:

```js
// Browser:
var phoneClient = require('fullstack-phone/client');

// fetch the metadata somehow, then pass to createHandler to instantiate a handler:
var phoneHandler = phoneClient.createHandler(metadata);
```

```js
// phone handler functions:

phoneHandler.getSupportedRegions(); // > ['US']

phoneHandler.formatPhoneNumber(
  { countryCode: '1', nationalNumber: '5101234567'},
  { style: 'national'}
); // > '(510) 123-4567'

phoneHandler.parsePhoneNumber('5101234567', 'US'); // > { countryCode: '1', nationalNumber: '5101234567' }

phoneHandler.validatePhoneNumber(
  { countryCode: '1', nationalNumber: '5101234567'},
  'US'
); // > [Error: PHONE_INVALID_FOR_COUNTRY]
```

It's also possible to use both within the same environment. Using the server module in the browser, however, 

## Why

[Google’s libphonenumber library](https://github.com/googlei18n/libphonenumber/) is the de-facto industry standard for processing international phone numbers, providing support for formatting, validating, and normalizing phone numbers in 250+ regions. However, the default phone metadata is quite heavy. Various custom JS packages have reduced the code & metadata footprint by:

- Simplifying the API and pre-compiling with Closure ([grantila/awesome-phonenumber](https://github.com/grantila/awesome-phonenumber))
- Providing individually compiled code+metadata bundles for each region ([leodido/i18n.phonenumbers.js](https://github.com/leodido/i18n.phonenumbers.js), [nathanhammond/libphonenumber](https://github.com/nathanhammond/libphonenumber))
- Rewriting the entire library without Closure and providing the option to hot load metadata for groups of regions ([halt-hammerzeit/libphonenumber-js](https://github.com/halt-hammerzeit/libphonenumber-js))

In contrast, fullstack-phone provides:
- The official libphonenumber code (not a pure JS re-write)
- A static code base that doesn’t change for different regions
- Hot loadable metadata bundles for individual regions

## Server API

```js
var phoneServer = require('fullstack-phone/server');
```

### loadMeta

#### `phoneServer.loadMeta(regionCodeArray)`

Given an array of two-letter region codes ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)), return a metadata bundle for those regions (to be passed to `phoneClient.createHandler()`).

##### regionCodeArray

##### Returns

##### Examples

## Client API

```js
var phoneClient = require('fullstack-phone/client');
```

### createHandler

#### `phoneClient.createHandler(metadata)`

Given a metadata bundle, return a phone handler instantiated for that metadata.

##### metadata

The metadata bundle from `phoneServer.loadMeta()`.

##### Returns

A phone handler instance.

## Phone Handler API

```js
var phoneHandler = phoneClient.createHandler(metadata);
```

### getSupportedRegions

#### `phoneHandler.getSupportedRegions()`

Return array of supported region codes.

### countryCodeToRegionCodeMap

#### `phoneHandler.countryCodeToRegionCodeMap()`

Return map from country calling codes to array of supported regions, e.g. `{'7': [ 'RU', 'KZ' ]}`

### getCountryCodeForRegion

#### `phoneHandler.getCountryCodeForRegion(regionCode)`

Given a `regionCode` (assuming metadata has already been loaded for that region), return its country calling code:

```javascript
libphonenumberUtil.getCountryCodeForRegion('RU'); // 7
```

### formatPhoneNumber

#### `phoneHandler.formatPhoneNumber(phoneObj, options)`

Given a `phoneObj` object (with string properties `countryCode` and `nationalNumber`), and `options` object (with string property `style`: 'national', 'international', 'E164' or 'RFC3699'), return formatted phone number.

The phone object is defined as follows:

```
{
  countryCode : {string or number} country calling code (e.g. '1'); DIGITS ONLY [required]
  nationalNumber : {string or number} phone number, (e.g. '4085551212'); DIGITS ONLY [required]
  extension : {string} phone extension (e.g. '123') [optional]
}
```

#### Example

```javascript
var phone = { countryCode: '1', nationalNumber: '5101234567' };
var options = { style: 'international' };
libphonenumberUtil.formatPhoneNumber(phone, options); // '+1 510-123-4567'

options.style = 'national';
libphonenumberUtil.formatPhoneNumber(phone, options); // '(510) 123-4567'
```

### validatePhoneNumber

#### `phoneHandler.validatePhoneNumber(phoneObj, regionCode)`

Given a `phoneObj` object (defined above) and `regionCode`, return Error object or indicating any problems with the phone object (or true if it passed validation):

```javascript
var phone = { countryCode: '1', nationalNumber: '5' };
libphonenumberUtil.validatePhoneNumber(phone, 'US'); // [Error: PHN_NUMBER_TOO_SHORT]
```

### parsePhoneNumber

#### `phoneHandler.parsePhoneNumber(phoneNumberToParse, regionCode)`

Given a string `phoneNumberToParse` and `regionCode`, return a `phoneObj` object or an Error object if the number is invalid:

```javascript
libphonenumberUtil.parsePhoneNumber('5101234567', 'US'); // { countryCode: '1', nationalNumber: '5101234567' }

libphonenumberUtil.parsePhoneNumber('ABC', 'US'); // [Error: PHN_NOT_A_NUMBER]
```

### getExampleNumberForType

#### `phoneHandler.getExampleNumberForType(regionCode, type)`

Given the string parameters `regionCode` and `type` ('GENERAL', 'MOBILE', 'FIXED_LINE', 'FIXED_LINE_OR_MOBILE', 'PREMIUM_RATE', 'VOIP', 'TOLL_FREE', etc.) return a `phoneObj` object with an example number for that type:

```javascript
libphonenumberUtil.getExampleNumberForType('US', 'MOBILE'); // { countryCode: '1', nationalNumber: '2015550123' }
```

### getAsYouTypeFormatter

#### `phoneHandler.getAsYouTypeFormatter(regionCode)`

Returns a new AsYouTypeFormatter object instantiated for the given region.

#### Exceptions

The function will throw the following exception if an invalid parameter is supplied:

- PHN_UNSUPPORTED_REGION: region code not supported/valid

#### Example

```javascript
var formatter = phoneHandler.getAsYouTypeFormatter('GB'); // returns AsYouTypeFormatter object initialized to Great Britain
```

The AsYouTypeFormatter object contains the following methods:

### inputDigit

#### `formatter.inputDigit(digit)`

Given a digit (number or string), output the phone number formatted thus far, given the history of inputted digits.

#### Parameter

- `digit`: A digit (as number or string); can include '+' and '*'

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



Development
------------

see [DEVELOPMENT.md](DEVELOPMENT.md)
