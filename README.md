fullstack-phone ☎️
======================

| Master | Develop | npm |
|--------|---------|-----|
| [![Build Status](https://travis-ci.org/dwbruhn/fullstack-phone.svg?branch=master)](https://travis-ci.org/dwbruhn/fullstack-phone) | [![Build Status](https://travis-ci.org/dwbruhn/fullstack-phone.svg?branch=develop)](https://travis-ci.org/dwbruhn/fullstack-phone) | [![npm version](https://badge.fury.io/js/fullstack-phone.svg)](https://www.npmjs.com/package/fullstack-phone) |

**fullstack-phone** provides formatting, validation, and parsing of phone numbers per-region. The system is optimized for use as two modules:

1. a metadata server providing dynamic regional metadata
2. a lightweight, Closure-compiled phone client (~25KB)

This project was extended from [Nathan Hammond's project](https://github.com/nathanhammond/libphonenumber), which itself is an adaptation of [Google's libphonenumber](https://github.com/googlei18n/libphonenumber/) library.

Contents
--------
- [Usage](#usage)
- [Why](#why)
- [APIs](#apis)
  - [Server](#server)
  - [Client](#client)
  - [Phone Handler](#phone-handler)
- [Development](#development)

## Usage

**Demo App:** [fullstack-phone-demo](https://github.com/dwbruhn/fullstack-phone-demo)

The modules are optimized for use in two environments.

On the server (requires Node 4+):

```javascript
// Node.js:
var phoneServer = require('fullstack-phone/server');

var metadata = phoneServer.loadMeta(['US', 'RU']); // load US and RU phone metadata
// now serve the metadata via some REST API or write it to a file for bundling with client code
```

On the client (assuming a client-side bundler that provides `require`, like [webpack](https://webpack.github.io/)):

```javascript
// Browser:
var phoneClient = require('fullstack-phone/client');

// fetch the metadata somehow, then pass to createPhoneHandler to instantiate a handler:
var phoneHandler = phoneClient.createPhoneHandler(metadata);
```

Once initialized, the phone handler can be used to process phone numbers:

```javascript
// phone handler functions:

phoneHandler.getSupportedRegions(); // > ['US', 'RU']

phoneHandler.formatPhoneNumber(
  { countryCode: '1', nationalNumber: '5101234567'},
  { style: 'national'}
);
// > '(510) 123-4567'

phoneHandler.parsePhoneNumber('5101234567', 'US');
// > { countryCode: '1', nationalNumber: '5101234567' }

phoneHandler.validatePhoneNumber(
  { countryCode: '1', nationalNumber: '5101234567'},
  'US'
);
// > [Error: PHONE_INVALID_FOR_REGION]
```

It's also possible to use both within the same environment. Using the server module in the browser, however, nullifies the advantages of the per-region metadata slicing.

## Why

[Google’s libphonenumber library](https://github.com/googlei18n/libphonenumber/) is the de-facto industry standard for processing international phone numbers, providing support for formatting, validating, and normalizing phone numbers in 250+ regions. However, the default phone metadata is quite heavy. Various custom JS packages have reduced the code & metadata footprint by:

- Simplifying the API and pre-compiling with Closure ([grantila/awesome-phonenumber](https://github.com/grantila/awesome-phonenumber))
- Providing individually compiled code+metadata bundles for each region ([leodido/i18n.phonenumbers.js](https://github.com/leodido/i18n.phonenumbers.js), [nathanhammond/libphonenumber](https://github.com/nathanhammond/libphonenumber))
- Rewriting the entire library without Closure and providing the option to hot load metadata for groups of regions ([halt-hammerzeit/libphonenumber-js](https://github.com/halt-hammerzeit/libphonenumber-js))

This package fills a different niche by providing:
- The official libphonenumber code (not a pure JS re-write)
- A static code base (~25KB) that doesn’t change for different regions
- Hot loadable metadata bundles for individual regions

## APIs

### Server

```javascript
var phoneServer = require('fullstack-phone/server');
```

The phone server exposes only one function:

#### loadMeta

##### `phoneServer.loadMeta(regionCodeArray)`

Given an array of two-letter region codes ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)), return a metadata bundle for those regions, to be passed to [`phoneClient.createPhoneHandler()`](#createphonehandler).

##### Notes:

* If `regionCodeArray` is undefined, **all regional metadata** is returned.
* `loadMeta` adds support for the following regions to Google libphonenumber:
  * PN: Pitcairn Islands (copied from New Zealand metadata)
  * AN: Netherlands Antilles (copied from Bonaire, Sint Eustatius and Saba)
  * XK: Kosovo (copied from Monaco)
* Some regions depend on metadata of other regions. For example, the Bahamas (BS) shares a telephone country code (1) with the United States (US). Since the US is considered the main region for country code 1, the US metadata must be included to support processing of Bahamas phone numbers. `loadMeta` takes care of this automatically.

The full list of region codes supported is:

```javascript
['001', 'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AN', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TA', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW']
```

Note that `'001'` is used to load metadata for global numbers, such as 1-800 numbers.


##### Examples

```javascript
var meta = phoneServer.loadMeta(['DE', 'AU']);
// > metadata object for DE and AU

var meta = phoneServer.loadMeta();
// > metadata object for all regions
```

### Client

```javascript
var phoneClient = require('fullstack-phone/client');
```

The phone client exposes only one function:

#### createPhoneHandler

##### `phoneClient.createPhoneHandler(metadata)`

Given a metadata bundle from [`phoneServer.loadMeta()`](#loadmeta), return a phone handler instantiated for that metadata.

### Phone Handler

```javascript
var phoneHandler = phoneClient.createPhoneHandler(metadata);
```

The phone handler returned by `createPhoneHandler` provides the following methods:

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

#### Exceptions

Any method that takes a `regionCode` string can throw the following exception if called with a region code for which the handler has not been initialized:

```javascript
phoneHandler.getCountryCodeForRegion();
// > Error: Metadata not loaded for region: undefined

phoneHandler.getCountryCodeForRegion('XX');
// > Error: Metadata not loaded for region: XX
```

#### Note about `phoneObj`

Some of the phone number functions require a `phoneObj` object as input. This is an object with the following properties:

##### countryCode

Required. A *number* or *string* of digits representing a country phone code, e.g., `'1'`.

##### nationalNumber

Required. A *number* or *string* of digits representing a phone number, as defined by E.164 e.g., `'4085551212'`.

Note that this excludes the leading national prefix (or "trunk code"), which is 0 or 1 in most territories.

##### extension

Optional. A string representing the phone number extension, e.g., `'123'`.

##### Example:

```javascript
{
  countryCode : '1',
  nationalNumber : '5105261234',
  extension : '999'
}
```

Note that `nationalNumber` must be valid and proper (i.e., should only contain digits), otherwise exceptions will be thrown. In addition, for proper formatting and validation results, `countryCode` must be the calling code of a country for which the phone handler was initialized.

The `phoneObj` object can be created by calling [`parsePhoneNumber`](#parsephonenumber) on a phone number string.

#### getSupportedRegions

##### `phoneHandler.getSupportedRegions()`

Return array of supported region codes.

Note that if a dependent region was loaded (such as the Bahamas), the main region for the shared country code is also reported a supported region (e.g., US).

##### Example

```javascript
phoneHandler.getSupportedRegions();
// > ['US', 'RU']
```

#### countryCodeToRegionCodeMap

##### `phoneHandler.countryCodeToRegionCodeMap()`

Return map from country calling codes to array of supported regions.

##### Example

```javascript
phoneHandler.countryCodeToRegionCodeMap();
// > { '1': [ 'US', 'BS' ], '7': [ 'RU' ] }
```

#### getCountryCodeForRegion

##### `phoneHandler.getCountryCodeForRegion(regionCode)`

Given a `regionCode` (assuming metadata has already been loaded for that region), return its country calling code as a number type.

##### Example

```javascript
phoneHandler.getCountryCodeForRegion('RU');
// > 7
```

#### formatPhoneNumber

##### `phoneHandler.formatPhoneNumber(phoneObj, options)`

Given a `phoneObj` object (with string properties `countryCode` and `nationalNumber`), and `options` object (with string property `style`: 'national', 'international', 'E164' or 'RFC3699'), return a formatted phone number as a string.

The phone object is defined as follows:

```
{
  countryCode : {string or number} country calling code (e.g. '1'); DIGITS ONLY [required]
  nationalNumber : {string or number} phone number, (e.g. '4085551212'); DIGITS ONLY [required]
  extension : {string} phone extension (e.g. '123') [optional]
}
```

##### Example

```javascript
var phone = { countryCode: '1', nationalNumber: '5101234567' };
var options = { style: 'international' };
phoneHandler.formatPhoneNumber(phone, options);
// > '+1 510-123-4567'

options.style = 'national';
phoneHandler.formatPhoneNumber(phone, options);
// > '(510) 123-4567'
```

#### validatePhoneNumber

##### `phoneHandler.validatePhoneNumber(phoneObj, regionCode)`

Given a `phoneObj` object (defined above) and `regionCode` string, return an Error object indicating any problems with the phone object (or `true` if it passed validation).

The possible error messages are:

* `'PHONE_INVALID_FOR_REGION'`
* `'PHONE_INVALID_COUNTRY_CODE'`
* `'PHONE_NUMBER_TOO_LONG'`
* `'PHONE_NUMBER_TOO_SHORT'`
* `'PHONE_NUMBER_INVALID_LENGTH'`
  * Not too long, not too short, but not just right, either. For example, Andorra (AD) numbers are 6, 8, or 8 digits, so a 7-digit number yields this error.

##### Example

```javascript
var phone = { countryCode: '1', nationalNumber: '5' };
phoneHandler.validatePhoneNumber(phone, 'US');
// > [Error: PHN_NUMBER_TOO_SHORT]

phone = { countryCode: '1', nationalNumber: '5105261234'};
phoneHandler.validatePhoneNumber(phone, 'US');
// true
```

#### parsePhoneNumber

##### `phoneHandler.parsePhoneNumber(phoneNumberToParse, regionCode)`

Given string parameters `phoneNumberToParse` and `regionCode`, return a `phoneObj` object or an Error object if the number is invalid.

The possible error messages are:

* `'PHONE_INVALID_COUNTRY_CODE'`
* `'PHONE_NUMBER_TOO_SHORT'`
* `'PHONE_NUMBER_TOO_LONG'`
* `'PHONE_NOT_A_NUMBER'`
* `'PHONE_TOO_SHORT_AFTER_IDD'`

##### Example

```javascript
phoneHandler.parsePhoneNumber('5101234567', 'US');
// > { countryCode: '1', nationalNumber: '5101234567' }

phoneHandler.parsePhoneNumber('ABC', 'US');
// > [Error: PHN_NOT_A_NUMBER]
```

#### getExampleNumberForType

##### `phoneHandler.getExampleNumberForType(type, regionCode)`

Given the string parameters [`type`](https://github.com/googlei18n/libphonenumber/blob/b58ef8b8a607074845534cb2ebe19b208521747f/javascript/i18n/phonenumbers/phonenumberutil.js#L907-L941) ('FIXED_LINE', 'MOBILE', 'FIXED_LINE_OR_MOBILE', 'TOLL_FREE', 'PREMIUM_RATE', 'SHARED_COST', 'VOIP', 'PERSONAL_NUMBER', 'PAGER', 'UAN', 'VOICEMAIL', or 'UNKNOWN') and `regionCode`, return a `phoneObj` object with an example number for that type.

##### Example

```javascript
phoneHandler.getExampleNumberForType('MOBILE', 'US');
// > { countryCode: '1', nationalNumber: '2015550123' }
```

#### getAsYouTypeFormatter

##### `phoneHandler.getAsYouTypeFormatter(regionCode)`

Returns a new AsYouTypeFormatter object instantiated for the given region.

##### Example

```javascript
var formatter = phoneHandler.getAsYouTypeFormatter('GB');
// > AsYouTypeFormatter object initialized to Great Britain
```

#### AsYouTypeFormatter methods

The AsYouTypeFormatter object itself exposes the following methods:

##### inputDigit

###### `formatter.inputDigit(digit)`

Given a digit (number or string), output the phone number formatted thus far, given the history of inputted digits.

Note that `digit` can also be `'+'` or `'*'`

###### Example

```javascript
formatter.inputDigit('5'); // > '5'
formatter.inputDigit('1'); // > '51'
formatter.inputDigit('0'); // > '510'
formatter.inputDigit('1'); // > '510-1'
formatter.inputDigit('2'); // > '510-12'
formatter.inputDigit('3'); // > '510-123'
formatter.inputDigit('4'); // > '510-1234'
formatter.inputDigit('5'); // > '(510) 123-45'
formatter.inputDigit('6'); // > '(510) 123-456'
formatter.inputDigit('7'); // > '(510) 123-4567'
```

##### clear

###### `formatter.clear()`

Clears the formatter state.

###### Example

```javascript
formatter.inputDigit('5'); // > '5'
formatter.inputDigit('1'); // > '51'
formatter.inputDigit('0'); // > '510'
formatter.inputDigit('1'); // > '510-1'
formatter.inputDigit('2'); // > '510-12'
formatter.clear();
formatter.inputDigit('9'); // > '9'
formatter.inputDigit('1'); // > '91'
formatter.inputDigit('9'); // > '919'
formatter.inputDigit('4'); // > '919-4'
formatter.inputDigit('8'); // > '919-48'
...
```

Development
------------

see [DEVELOPMENT.md](DEVELOPMENT.md)
