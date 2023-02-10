fullstack-phone ☎️
======================

| npm                                                          | Libphonenumber version                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [![npm version](https://badge.fury.io/js/fullstack-phone.svg)](https://www.npmjs.com/package/fullstack-phone) | [v8.13.6](https://github.com/googlei18n/libphonenumber/blob/master/release_notes.txt) |

**fullstack-phone** provides formatting, validation, and parsing of phone numbers per-region. The system is optimized for use as two modules:

1. a metadata server providing dynamic regional metadata
2. a lightweight, Closure-compiled phone client (27KB, 10KB gzipped)

This project was extended from [Nathan Hammond's project](https://github.com/nathanhammond/libphonenumber), which itself is an adaptation of [Google's libphonenumber](https://github.com/googlei18n/libphonenumber/) library.

Contents
--------
- [Installation](#installation)
- [Usage](#usage)
- [Why](#why)
- [Canonical Phone Object](#canonical-phone-object)
- [APIs](#apis)
  - [Server](#server)
  - [Client](#client)
  - [Phone Handler](#phone-handler)
- [Development](#development)

## Installation

```bash
npm install fullstack-phone
```

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
- Rewriting the entire library without Closure and providing the option to dynamically load metadata for groups of regions ([catamphetamine/libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js))

This package fills a different niche by providing:
- The official libphonenumber code (not a pure JS re-write)
- A small, static code base that doesn’t change for different regions
- Pluggable metadata bundles for individual regions

## Canonical Phone Object

When using Google libphonenumber directly, processing a phone number requires [parsing a string](https://github.com/googlei18n/libphonenumber/blob/11ad0018a9940ec60ea2c8287d5d0ebc0bd0c188/javascript/i18n/phonenumbers/phonenumberutil_test.js#L1334) or [initializing a protocol buffer phone number object and calling setters for its various properties](https://github.com/googlei18n/libphonenumber/blob/11ad0018a9940ec60ea2c8287d5d0ebc0bd0c188/javascript/i18n/phonenumbers/phonenumberutil_test.js#L521-L525).

In contrast, fullstack-phone provides a more idiomatic JavaScript phone object, removing the need to call multiple setters. Most of the phone number functions here operate on a canonical `phoneObj`, as follows:

```javascript
{
  countryCode : '1',
  nationalNumber : '5105551234',
  extension : '999'
}
```

* `countryCode`
  * **Required**. A *number* or *string* of digits representing a country phone code, e.g., `'1'`.


* `nationalNumber`
  * **Required**. A *number* or *string* of digits representing a phone number, as defined by [E.164](https://en.wikipedia.org/wiki/E.164), e.g., `'4085551212'`.
  * Note that this excludes the leading national prefix (or "trunk code"), which is 0 or 1 in most territories.
  * [Italian leading zeros](https://github.com/googlei18n/libphonenumber/blob/11ad0018a9940ec60ea2c8287d5d0ebc0bd0c188/resources/phonenumber.proto#L57-L74) **should** be included here.


* `extension`
  * **Optional**. A string representing the phone number extension, e.g., `'123'`.

### Notes

For proper formatting and validation results, `nationalNumber` and `countryCode` must only contain digits. In addition, `countryCode` must be the calling code of a country for which the phone handler was initialized. (For example, if a `phoneObj` is passed with `countryCode: 44`, the phone handler must have been loaded with [GB](https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Kingdom) metadata for proper results.)

The `phoneObj` object can be created by calling [`parsePhoneNumber`](#parsephonenumber) on a phone number string.

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
- [validateLength](#validatelength)
- [parsePhoneNumber](#parsephonenumber)
- [getExampleNumberForType](#getexamplenumberfortype)
- [inferPhoneNumberRegion](#inferphonenumberregion)
- [inferPhoneNumberType](#inferphonenumbertype)
- [getAsYouTypeFormatter](#getasyoutypeformatter)
  - [inputDigit](#inputdigit)
  - [clear](#clear)
  - [inputDigitAndRememberPosition](#inputdigitandrememberposition)
  - [getRememberedPosition](#getrememberedposition)

#### Exceptions

Any method that takes a `phoneObj` parameter can throw the following exception if called with an invalid [canonical phone object](#canonical-phone-object):

```javascript
phoneHandler.inferPhoneNumberType(123);
// Uncaught Error: Phone object conversion failed

phoneHandler.inferPhoneNumberType({ countryCode: 1, nationalNumber: false });
// Uncaught Error: Phone object conversion failed
```

Any method that takes a `regionCode` string can throw the following exception if called with a region code for which the handler has not been initialized:

```javascript
phoneHandler.getCountryCodeForRegion();
// Uncaught Error: Metadata not loaded for region: undefined

phoneHandler.getCountryCodeForRegion('XX');
// Uncaught Error: Metadata not loaded for region: XX
```

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

Return a country calling code as a number, given a `regionCode` string (assuming metadata has already been loaded for that region).

##### Example

```javascript
phoneHandler.getCountryCodeForRegion('RU');
// > 7
```

#### formatPhoneNumber

##### `phoneHandler.formatPhoneNumber(phoneObj, options)`

Return a formatted phone number as a string, given a [`phoneObj` object](#canonical-phone-object) and `options` object with a valid `style` property (`'national'`, `'international'`, `'e164'`, or `'rfc3966'`).

The `options` object has a single string property to indicate the formatting style desired:

```javascript
{
    style: 'national' // or 'international', 'e164', 'rfc3966'
}
```

##### Examples

```javascript
var phone = { countryCode: '1', nationalNumber: '5101234567' };

phoneHandler.formatPhoneNumber(phone, { style: 'international' });
// > '+1 510-123-4567'

phoneHandler.formatPhoneNumber(phone, { style: 'national' });
// > '(510) 123-4567'

phoneHandler.formatPhoneNumber(phone, { style: 'e164' });
// > '+15101234567'

phoneHandler.formatPhoneNumber(phone, { style: 'rfc3966' })
// > 'tel:+1-510-123-4567'
```

#### validatePhoneNumber

##### `phoneHandler.validatePhoneNumber(phoneObj, ?regionCode)`

Perform **full** validation on a phone number: Given a [`phoneObj` object](#canonical-phone-object) and optional `regionCode` string, return an Error object indicating any problems with the phone object (or `true` if it passed validation).

If `regionCode` is provided, the phone number is validated for the given region. If it is omitted, the phone number is validated for the region inferred from the number itself. In both cases, the handler needs to have already been instantiated with metadata for the expected region(s).

The possible error messages are:

* `'PHONE_INVALID_FOR_REGION'`
  * Phone number is not valid for some reason. (See the examples below.)
* `'PHONE_INVALID_COUNTRY_CODE'`
  * The `phoneObj.countryCode` is not recognized for one of these reasons:
    * It's completely invalid (like '9999'),
    * Metadata has not been loaded for the region corresponding to `phoneObj.countryCode`, or
    * It does not correspond to to the `regionCode` passed.
* `'PHONE_NUMBER_TOO_LONG'`
* `'PHONE_NUMBER_TOO_SHORT'`
* `'PHONE_NUMBER_INVALID_LENGTH'`
  * Phone number is not too long, not too short, but not just right, either. For example, Andorra (AD) numbers are 6, 8, or 9 digits, so a 7-digit number yields this error.

##### Examples

```javascript
// valid US phone number
phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5105261234' }, 'US');
// > true

// regionCode is optional
phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5105261234' });
// > true

phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5' }, 'US');
// > [Error: PHONE_NUMBER_TOO_SHORT]

phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '51052612341' }, 'US');
// > [Error: PHONE_NUMBER_TOO_LONG]

// 10 digits (like a US phone number), but not an actual valid number
phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '1234567890' }, 'US');
// > [Error: PHONE_INVALID_FOR_REGION]
phoneHandler.validatePhoneNumber({ countryCode: '1', nationalNumber: '1234567890' });
// > [Error: PHONE_INVALID_FOR_REGION]

// completely invalid countryCode
phoneHandler.validatePhoneNumber({ countryCode: '999', nationalNumber: '5105261234' }, 'US');
// > [Error: PHONE_INVALID_COUNTRY_CODE]

// countryCode 44 is for GB, but US regionCode was passed
phoneHandler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' }, 'US');
// > [Error: PHONE_INVALID_COUNTRY_CODE]

// valid GB number
phoneHandler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' }, 'GB');
// > true
phoneHandler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' });
// > true
```

#### validateLength

##### `phoneHandler.validateLength(phoneObj, ?regionCode)`

Perform minimal validation (**length check only**) on a phone number: Given a [`phoneObj` object](#canonical-phone-object) and optional `regionCode` string, return an Error object indicating any length problems with the phone object (or `true` if it passed the length validation).

If `regionCode` is provided, the phone number is validated for the given region. If it is omitted, the phone number is validated for the region inferred from the number itself. In both cases, the handler needs to have already been instantiated with metadata for the expected region(s).

The possible error messages are:

* `'PHONE_INVALID_COUNTRY_CODE'`
  * The `phoneObj.countryCode` is not recognized for one of these reasons:
    * It's completely invalid (like '9999'),
    * Metadata has not been loaded for the region corresponding to `phoneObj.countryCode`, or
    * It does not correspond to to the `regionCode` passed.
* `'PHONE_NUMBER_TOO_LONG'`
* `'PHONE_NUMBER_TOO_SHORT'`
* `'PHONE_NUMBER_INVALID_LENGTH'`
  * The phone number is not too long, not too short, but not just right, either. For example, Andorra (AD) numbers are 6, 8, or 9 digits, so a 7-digit number yields this error.
* `'PHONE_NUMBER_POSSIBLE_LOCAL_ONLY'`
  * The phone number could be dialed within a local area (e.g., US numbers without the area code) but is not long enough to be a full phone number dialable from anywhere.
* `'PHONE_INVALID_FOR_REGION`'
  * Fallback error: This error would only be returned if libphonenumber adds a new enum member to ValidationResult.

##### Examples

```javascript
// any 10-digit phone number in the US passes validateLength
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '1234567890' }, 'US');
// > true

// regionCode is optional
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '1234567890' });
// > true

// 7-digit numbers are only possible locally in the US
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '1234567' }, 'US');
// > [Error: PHONE_NUMBER_POSSIBLE_LOCAL_ONLY]

// 6-digit numbers are too short in the US
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '123456' }, 'US');
// > [Error: PHONE_NUMBER_TOO_SHORT]

// 11-digit numbers are too long in the US
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '12345678901' }, 'US');
// > [Error: PHONE_NUMBER_TOO_LONG]

// wrong regionCode yields PHONE_INVALID_COUNTRY_CODE (regionCode AD does not match countryCode 1)
phoneHandler.validateLength({ countryCode: '1', nationalNumber: '1234567890' }, 'AD');
// > [Error: PHONE_INVALID_COUNTRY_CODE]

// a completely invalid countryCode (999) also yields PHONE_INVALID_COUNTRY_CODE
phoneHandler.validateLength({ countryCode: '999', nationalNumber: '1234567890' });
// > [Error: PHONE_INVALID_COUNTRY_CODE]

// 7-digit number in Andorra (regionCode AD, countryCode 376) is in between valid number lengths
phoneHandler.validateLength({ countryCode: '376', nationalNumber: '1234567' }, 'AD');
// > [Error: PHONE_NUMBER_INVALID_LENGTH]
```

#### parsePhoneNumber

##### `phoneHandler.parsePhoneNumber(phoneNumberToParse, ?regionCode)`

Parse a string and return a [`phoneObj` object](#canonical-phone-object) (or an Error object if parsing failed), given the string parameters `phoneNumberToParse` and optional `regionCode`.

The optional `regionCode` parameter provides a fallback if the country code cannot be extracted from the `phoneNumberToParse` string. If the string contains `+` followed by the country code, then `regionCode` can be safely omitted. In both cases, however, the handler needs to have already been instantiated with metadata for the expected region(s).

The possible error messages are:

* `'PHONE_INVALID_COUNTRY_CODE'`
* `'PHONE_NUMBER_TOO_SHORT'`
* `'PHONE_NUMBER_TOO_LONG'`
* `'PHONE_NOT_A_NUMBER'`
* `'PHONE_TOO_SHORT_AFTER_IDD'`

##### Examples

```javascript
phoneHandler.parsePhoneNumber('5101234567', 'US');
// > { countryCode: '1', nationalNumber: '5101234567' }

phoneHandler.parsePhoneNumber('ABC', 'US');
// > [Error: PHONE_NOT_A_NUMBER]

// regionCode is optional if string has '+' followed by country code
phoneHandler.parsePhoneNumber('+1 510-123-4567'); // international format
phoneHandler.parsePhoneNumber('+15101234567'); // E.164 format
phoneHandler.parsePhoneNumber('tel:+1-510-123-4567'); // RFC 3966 format
// > { countryCode: '1', nationalNumber: '5101234567' }

// Do not omit regionCode if phoneNumberString is missing '+'
phoneHandler.parsePhoneNumber('15101234567');
// > [Error: PHONE_INVALID_COUNTRY_CODE]
h.parsePhoneNumber("15101234567", "US");
// > { countryCode: '1', nationalNumber: '5101234567' }
```

#### getExampleNumberForType

##### `phoneHandler.getExampleNumberForType(type, regionCode)`

Return an example [`phoneObj` object](#canonical-phone-object), given the string parameters `type` and `regionCode`.

The `type` parameter is an enum based on libphonenumber [i18n.phonenumbers.PhoneNumberType](https://github.com/googlei18n/libphonenumber/blob/b58ef8b8a607074845534cb2ebe19b208521747f/javascript/i18n/phonenumbers/phonenumberutil.js#L907-L941) and can be any of the following strings:

* `'FIXED_LINE'`
* `'MOBILE'`
* `'FIXED_LINE_OR_MOBILE'`
* `'TOLL_FREE'`
* `'PREMIUM_RATE'`
* `'SHARED_COST'`
* `'VOIP'`
* `'PERSONAL_NUMBER'`
* `'PAGER'`
* `'UAN'`
* `'VOICEMAIL'`
* `'UNKNOWN'`

##### Example

```javascript
phoneHandler.getExampleNumberForType('MOBILE', 'US');
// > { countryCode: '1', nationalNumber: '2015550123' }
```

#### inferPhoneNumberType

##### `phoneHandler.inferPhoneNumberType(phoneObj)`

Return a string indicating the phone number type (see [`getExampleNumberForType`](#getexamplenumberfortype)), given a valid `phoneobj`. Returns `'UNKNOWN'` if metadata has not been loaded for the region of the phone number or the number type otherwise cannot be inferred.

##### Examples

```js
phoneHandler.inferPhoneNumberType({ countryCode: '1', nationalNumber: '5105261568' });
// > 'FIXED_LINE_OR_MOBILE'

// GB landline
phoneHandler.inferPhoneNumberType({ countryCode: '44', nationalNumber: '1212345678' });
// > 'FIXED_LINE'

// GB mobile number
phoneHandler.inferPhoneNumberType({ countryCode: '44', nationalNumber: '7400123456' })
// > 'MOBILE'

// invalid GB phone number
phoneHandler.inferPhoneNumberType({ countryCode: '44', nationalNumber: '999999' });
// > 'UNKNOWN'
```

#### inferPhoneNumberRegion

##### `phoneHandler.inferPhoneNumberRegion(phoneObj)`

Return the two letter region code associated with a valid `phoneObj`.

Returns `null` if the region cannot be determined. (This can happen if metadata has not been loaded for the region associated with the `phoneObj.countryCode`.)

**Important:** This method only guarantees correct results for **valid** phone numbers. ([See the libphonenumber source code.](https://github.com/google/libphonenumber/blob/5c309c56a945ffdf74f69aa4166b1ec5d7f233ff/javascript/i18n/phonenumbers/phonenumberutil.js#L3104-L3107))

```javascript
phoneHandler.inferPhoneNumberRegion({ countryCode: '44', nationalNumber: '1212345678' });
// > 'GB'

phoneHandler.inferPhoneNumberRegion({ countryCode: '99', nationalNumber: '1212345678' });
// > null
```

#### getAsYouTypeFormatter

##### `phoneHandler.getAsYouTypeFormatter(regionCode)`

Return a new AsYouTypeFormatter object instantiated for the given `regionCode`.

##### Example

```javascript
var formatter = phoneHandler.getAsYouTypeFormatter('GB');
// > AsYouTypeFormatter object initialized to Great Britain
```

#### AsYouTypeFormatter methods

The initialized AsYouTypeFormatter object itself exposes the following methods:

##### inputDigit

###### `formatter.inputDigit(digit)`

Given a digit (number or string), output the phone number formatted thus far (given the history of inputted digits).

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

Clear the formatter state.

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

##### inputDigitAndRememberPosition

###### `formatter.inputDigitAndRememberPosition(digit)`

Same as [inputDigit](#inputdigit), but remembers the (1-indexed) position where the digit was entered, to be retrieved later by [getRememberedPosition](#getrememberedposition). This position can update as formatting characters are inserted by the AsYouTypeFormatter.

##### getRememberedPosition

###### `formatter.getRememberedPosition()`

Returns the (1-indexed) position (as a number) of the digit previously passed to [inputDigitAndRememberPosition](#inputdigitandrememberposition).

###### Example

```javascript
// getRememberedPosition starts out as 0
formatter.getRememberedPosition(); // > 0

formatter.inputDigitAndRememberPosition(5); // > '5'

// the 5 was inputted at position 1
formatter.getRememberedPosition(); // > 1

// input additional digits until parens are inserted
formatter.inputDigit(1); // > '51'
formatter.inputDigit(0); // > '510'
formatter.inputDigit(1); // > '510-1'
formatter.inputDigit(2); // > '510-12'
formatter.inputDigit(3); // > '510-123'
formatter.inputDigit(4); // > '510-1234'
formatter.inputDigit(5); // > '(510) 123-45'

// now the original 5 is at position 2, since an open paren was inserted before it
formatter.getRememberedPosition(); // 2
```

Development
------------

see [DEVELOPMENT.md](./reference/DEVELOPMENT.md)
