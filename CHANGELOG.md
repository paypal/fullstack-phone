# Changelog

## 1.93.0

* Metadata:
  * Updated to libphonenumber v8.12.35

## 1.92.0

* Metadata:
  * Updated to libphonenumber v8.12.34

## 1.91.0

* Metadata:
  * Updated to libphonenumber v8.12.33

## 1.90.0

* Metadata:
  * Updated to libphonenumber v8.12.32

## 1.89.0

* API:
  * Updated [`validatePhoneNumber`](./README.md#validatephonenumber) and [`parsePhoneNumber`](./README.md#parsephonenumber) to make `regionCode` parameter optional
    * `validatePhoneNumber`: If `regionCode` is omitted, the phone number is validated based on the region inferred from the phone number itself
    * `parsePhoneNumber`: The `regionCode` can be safely omitted if the phone number string contains "+" followed by the country code (e.g., international, E.164, or RFC3966 formats)
    * Note that the handler needs to have already been instantiated with metadata for the expected region(s)
  * Added [`inferPhoneNumberType`](./README.md#inferphonenumbertype) and [`inferPhoneNumberRegion`](./README.md#inferphonenumberregion) methods
  * Added [`validateLength`](./README.md#validatelength) method to perform length-only validations
  * Added [`inputDigitAndRememberPosition`](./README.md#inputdigitandrememberposition) and [`getRememberedPosition`](./README.md#getrememberedposition) methods to the AsYouTypeFormatter

## 1.88.0

* Metadata:
  * Updated to libphonenumber v8.12.31

## 1.87.0

* Metadata:
  * Updated to libphonenumber v8.12.30

## 1.86.0

* Metadata:
  * Updated to libphonenumber v8.12.28

## 1.85.0

* Metadata:
  * Updated to libphonenumber v8.12.27

## 1.84.0

* Metadata:
  * Updated to libphonenumber v8.12.26

## 1.83.0

* Metadata:
  * Updated to libphonenumber v8.12.25

## 1.82.0

* Metadata:
  * Updated to libphonenumber v8.12.24

## 1.80.0

* Metadata:
  * Updated to libphonenumber v8.12.23

## 1.79.0

* Metadata:
  * Updated to libphonenumber v8.12.22

## 1.78.0

* Metadata:
  * Updated to libphonenumber v8.12.21

## 1.77.0

* Metadata:
  * Updated to libphonenumber v8.12.18

## 1.76.0

* Metadata:
  * Updated to libphonenumber v8.12.17

## 1.75.0

* Metadata:
  * Updated to libphonenumber v8.12.16

## 1.74.0

* Switched build from Google Closure Compiler Service to [google-closure-compiler npm package](https://www.npmjs.com/package/google-closure-compiler)

## 1.73.0

* Metadata:
  * Updated to libphonenumber v8.12.15

## 1.72.0

* Metadata:
  * Updated to libphonenumber v8.12.14

## 1.71.0

* Metadata:
  * Updated to libphonenumber v8.12.13

## 1.70.0

* Metadata:
  * Updated to libphonenumber v8.12.12

## 1.69.0

* Metadata:
  * Updated to libphonenumber v8.12.11

## 1.68.0

* Metadata:
  * Updated to libphonenumber v8.12.10

## 1.67.0

* Metadata:
  * Updated to libphonenumber v8.12.9

## 1.66.0

* Metadata:
  * Updated to libphonenumber v8.12.8

## 1.65.0

* Metadata:
  * Updated to libphonenumber v8.12.7

## 1.64.0

* Metadata:
  * Updated to libphonenumber v8.12.6

## 1.63.0

* Metadata:
  * Updated to libphonenumber v8.12.5

## 1.62.0

* Metadata:
  * Updated to libphonenumber v8.12.4

## 1.61.0

* Metadata:
  * Updated to libphonenumber v8.12.3

## 1.60.0

* Metadata:
  * Updated to libphonenumber v8.12.2

## 1.59.0

* Metadata:
  * Updated to libphonenumber v8.12.1

## 1.58.0

* Metadata:
  * Updated to libphonenumber v8.11.5

## 1.57.0

* Metadata:
  * Updated to libphonenumber v8.11.4

## 1.56.0

* Metadata:
  * Updated to libphonenumber v8.11.3

## 1.55.0

* Metadata:
  * Updated to libphonenumber v8.11.2

## 1.54.0

* Metadata:
  * Updated to libphonenumber v8.11.1

## 1.53.0

* Metadata:
  * Updated to libphonenumber v8.11.0

## 1.52.0

* Metadata:
  * Updated to libphonenumber v8.10.23

## 1.51.0

* Client: Expanded support for finding global scope ([@rxaviers](https://github.com/rxaviers), [#11](https://github.com/paypal/fullstack-phone/pull/11))

## 1.50.0

* Metadata:
  * Updated to libphonenumber v8.10.22

## 1.49.0

* Metadata:
  * Updated to libphonenumber v8.10.21

## 1.48.0

* Metadata:
  * Updated to libphonenumber v8.10.20

## 1.47.0

* Metadata:
  * Updated to libphonenumber v8.10.19

## 1.46.0

* Metadata:
  * Updated to libphonenumber v8.10.18

## 1.45.0

* Metadata:
  * Updated to libphonenumber v8.10.16

## 1.44.0

* Metadata:
  * Updated to libphonenumber v8.10.15

## 1.43.0

* Metadata:
  * Updated to libphonenumber v8.10.14

## 1.42.0

* Metadata:
  * Updated to libphonenumber v8.10.13

## 1.41.0

* Metadata:
  * Updated to libphonenumber v8.10.12

## 1.40.0

* Metadata:
  * Updated to libphonenumber v8.10.11

## 1.39.0

* Metadata:
  * Updated to libphonenumber v8.10.10

## 1.38.0

* Metadata:
  * Updated to libphonenumber v8.10.9
* Development:
  * Add `publishConfig` for public registry

## 1.37.0

* Metadata:
  * Updated to libphonenumber v8.10.8

## 1.36.0

* Metadata:
  * Updated to libphonenumber v8.10.7

## 1.35.0

* Metadata:
  * Updated to libphonenumber v8.10.6

## 1.34.0

* Metadata:
  * Updated to libphonenumber v8.10.5

## 1.33.0

* Metadata:
  * Updated to libphonenumber v8.10.4

## 1.32.0

* Metadata:
  * Updated to libphonenumber v8.10.3

## 1.31.0

* Metadata:
  * Updated to libphonenumber v8.10.2

## 1.30.0

* Metadata:
  * Updated to libphonenumber v8.10.1

## 1.29.0

* Metadata:
  * Updated to libphonenumber v8.10.0

## 1.28.0

* Metadata:
  * Updated to libphonenumber v8.9.16

## 1.27.0

* Metadata:
  * Updated to libphonenumber v8.9.15

## 1.26.0

* Metadata:
  * Updated to libphonenumber v8.9.14

## 1.25.0

* Metadata:
  * Updated to libphonenumber v8.9.13

## 1.24.0

* Metadata:
  * Updated to libphonenumber v8.9.12

## 1.23.0

* Metadata:
  * Updated to libphonenumber v8.9.10

## 1.22.0

* Recompiled with [Google Closure Compiler Service](https://developers.google.com/closure/compiler/docs/api-ref)

## 1.21.0

* Metadata:
  * Updated to libphonenumber v8.9.9

## 1.20.0

* Metadata:
  * Updated to libphonenumber v8.9.8

## 1.19.0

* Metadata:
  * Updated to libphonenumber v8.9.7

## 1.18.0

* Metadata:
  * Updated to libphonenumber v8.9.6

## 1.17.0

* Metadata:
  * Updated to libphonenumber v8.9.5

## 1.16.0

* Metadata:
  * Updated to libphonenumber v8.9.4

## 1.15.0

* Metadata:
  * Updated to libphonenumber v8.9.3

## 1.14.0

* Metadata:
  * Updated to libphonenumber v8.9.2
  * Updated to Closure library v20180204

## 1.13.0

* Metadata:
  * Updated to libphonenumber v8.9.1

## 1.12.0

* Metadata:
  * Updated to libphonenumber v8.8.11
  * Includes new metadata for XK with country code +383 (no longer copied from MC +377)

## 1.11.0

* Metadata:
  * Updated to libphonenumber v8.8.10
  * Updated to Closure library v20171203

## 1.10.0

* Metadata:
  * Updated to libphonenumber v8.8.9

## 1.9.0

* Metadata:
  * Updated to libphonenumber v8.8.8

## 1.8.0

* Metadata:
  * Updated to libphonenumber v8.8.7

## 1.7.0

* Metadata:
  * Updated to libphonenumber v8.8.6

## 1.6.0

* Metadata:
  * Updated to libphonenumber v8.8.5

## 1.5.0

* Metadata:
  * Updated to libphonenumber v8.8.4

## 1.4.0

* Metadata:
  * Updated to libphonenumber v8.8.3

## 1.3.0

* Metadata:
  * Updated to libphonenumber v8.8.2

## 1.2.0

* Metadata:
  * Updated to libphonenumber v8.8.1

## 1.1.0

* Metadata:
  * Updated to libphonenumber v8.8.0

## 1.0.0

* API:
  * Fixed truncation of phone numbers with multiple leading zeros (e.g., KR `00798 123 4567` and JP `0077-7012`)
  * Tightened handling of `phoneObj` with improper leading zeros in `nationalNumber` property
    * A `phoneObj` with a leading zero in the `nationalNumber` property is technically an invalid `phoneObj` (unless it's an [Italian leading zero](https://github.com/googlei18n/libphonenumber/blob/6ce5ca99bb86b040e74267adcbbac48b19908776/resources/phonenumber.proto#L57-L73)). In previous versions of fullstack-phone, such phone objects were handled leniently by using the `isLeadingZeroPossible` API of libphonenumber during conversion to protocol buffer format. Due to the [removal of isLeadingZeroPossible](https://github.com/googlei18n/libphonenumber/blob/b58ef8b8a607074845534cb2ebe19b208521747f/release_notes.txt#L56-L63), it is no longer possible to maintain this leniency. All leading zeros are thus passed to libphonenumber as-is.
    * For example, GB `{ countryCode: '44', nationalNumber: '01212345678' }` should not have the leading 0 (national prefix) in `nationalNumber`, and will no longer format properly or pass validation.
    * To convert phone objects with invalid leading zeros to the proper format, convert them to strings as follows and pass them through `parsePhoneNumber` (with any `regionCode`). This should have no effect on valid phone objects:

    ```javascript
    var invalidPhoneObj = {
        countryCode: '44',
        nationalNumber: '01212345678', // GB number improperly including national prefix 0
        extension: '123'
    };

    var phoneString = '+' +
      invalidPhoneObj.countryCode +
      invalidPhoneObj.nationalNumber +
      (invalidPhoneObj.extension ? ';' + invalidPhoneObj.extension : ''); // add extension if it exists

    var validPhoneObj = phoneHandler.parsePhoneNumber(phoneString, 'US'); // regionCode is irrelevant if string starts with '+'
    // > { countryCode: '44', nationalNumber: '1212345678', extension: '123' } // valid GB phoneObj without leading 0
    ```
* Metadata:
  * Updated to libphonenumber v8.7.1

## 0.1.0

* API:
    * Refactored into server & client modules for easy inclusion
    * Made handler instantiable instead of a singleton
    * Changed `loadMeta` to return full metadata when called with no arguments
    * Switched parameter order of `getExampleNumberForType` to match other APIs (`regionCode` last)
    * Changed `PHONE_INVALID_FOR_COUNTRY` error message to `PHONE_INVALID_FOR_REGION` (for clarity)
    * Renamed `createHandler` to `createPhoneHandler` to make it more distinct in case anyone uses a `<script>` tag to load `client/index.js` and it gets added to the `window` object
* Metadata:
    * Updated to libphonenumber v8.5.2
    * Updated to Closure library v20170626

## 0.0.2

* Backported API changes from 0.1.0 but based on libphonenumber v7.7.5
* Metadata:
    * libphonenumber v7.7.5
    * Closure library v20170626

## 0.0.1 (Unpublished)

* Initial version that requires copying generated files and modifying paths
