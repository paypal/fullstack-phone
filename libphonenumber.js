'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance(),
    PNF = i18n.phonenumbers.PhoneNumberFormat,
    i18nError = i18n.phonenumbers.Error,
    allRegionCodes; // region codes from metadata

var styles = {
    E164: 'e164',
    INTERNATIONAL: 'international',
    NATIONAL: 'national',
    RFC3966: 'rfc3966'
},
    errors = {
        // returned:
        INVALID_FOR_REGION: 'PHN_INVALID_FOR_REGION',
        NOT_A_NUMBER: 'PHN_NOT_A_NUMBER',
        NOT_A_STRING: 'PHN_EXTENSION_NOT_A_STRING',
        PARSE_ERROR: 'PHN_PARSE_ERROR',
        TOO_SHORT_AFTER_IDD: 'PHN_NUMBER_TOO_SHORT_AFTER_IDD',
        TOO_SHORT_NSN: 'PHN_NUMBER_TOO_SHORT',
        TOO_LONG: 'PHN_NUMBER_TOO_LONG',
        TOO_SHORT: 'PHN_NUMBER_TOO_SHORT',
        UNKNOWN_REGION: 'PHN_UNKNOWN_REGION',
        // thrown:
        INVALID_COUNTRY_CODE: 'PHN_COUNTRY_CODE_INVALID',
        INVALID_STYLE: 'PHN_OPTIONS_INVALID',
        MISSING_COUNTRY_CODE: 'PHN_COUNTRY_MISSING',
        FORMAT_INVALID: 'PHN_FORMAT_INVALID',
        MISSING_NATIONAL_NUMBER: 'PHN_NUMBER_EMPTY',
        UNSUPPORTED_REGION: 'PHN_UNSUPPORTED_REGION' // thrown if function called with regionCode for which no metadata loaded
    };

// namespace the stateful AsYouTypeFormatter functions
var asYouType = {

    formatter: undefined, // AsYouTypeFormatter

    setRegion: function setRegion(regionCode) {
        if (allRegionCodes.indexOf(regionCode) === -1) {
            throw new Error(errors.UNSUPPORTED_REGION);
        }

        // initialize asYouType formatter for given region
        asYouType.formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);
    },

    clear: function clear() {
        // console.log('Clearing formatter');
        asYouType.formatter.clear(); // normally this.formatter.clear, but Closure Compiler thinks that refers to global this
    },

    inputDigit: function inputDigit(digit) {
        // console.log('Inputting digit', digit);
        return asYouType.formatter.inputDigit(digit);
    }
};

/**
 * initialization function that calls injectMeta (provided by metadataInjector)
 * sets allRegionCodes
 * initializes formatter to first country (necessary to prevent Closure Compiler from removing the code)
 * @param {Object} bundle metadata objet with regionCodes, countryCodeToRegionCodeMap, and countryToMetadata properties
 */
function useMeta(bundle) {
    // console.log('useMeta called for', bundle['regionCodes']);
    allRegionCodes = bundle['regionCodes']; // quote property names to prevent closure compiler from reducing them
    injectMeta(bundle['countryCodeToRegionCodeMap'], bundle['countryToMetadata']);

    // initialize AsYouType formatter to the first region code
    asYouType.setRegion(allRegionCodes[0]); // do this only AFTER injecting metadata
    // console.log('useMeta initialized AsYouTypeFormatter to', allRegionCodes[0]);
}

/**
 * Original functions from libphonenumber-hammond
 */

/**
 * @return {Object|undefined} map from country calling codes to arrays of regions
 */
function countryCodeToRegionCodeMap() {
    if (allRegionCodes) { // if initialized
        return i18n.phonenumbers.metadata.countryCodeToRegionCodeMap;
    }
}

/**
 * @param {string} regionCode territory code
 * @return {string|undefined} country calling code for that territory
 * @throws {Error} if metadata has not been loaded for that region
 */
function getCountryCodeForRegion(regionCode) {
    if (allRegionCodes) { // if initialized
        if (allRegionCodes.indexOf(regionCode) === -1) {
            throw new Error(errors.UNSUPPORTED_REGION);
        }
        return phoneUtil.getCountryCodeForRegion(regionCode);
    }
}

/**
 * @return {Array|undefined} array of supported regions
 */
function getSupportedRegions() {
    if (allRegionCodes) { // if initialized
        return phoneUtil.getSupportedRegions();
    }
}


/**
 *  PHONE ADAPTER FUNCTIONS
 */


/**
 * @param {Object} canonicalPhone
 * @param {Object} options - style : 'national', 'international', 'E164' or 'RFC3699'
 * @return {string} formatted phone number if valid
 * @throws {Error} if style is invalid, or input is undefined/NaN
 */
function formatPhoneNumber(canonicalPhone, options) {
    var phoneNumber;
    try {
        phoneNumber = getPBPhoneFromJSONPhone(canonicalPhone);
    } catch (e) {
        throw e;
    }

    options = options || {};
    var formatType;
    switch (options.style) {
        case styles.NATIONAL:
            formatType = PNF.NATIONAL;
            break;
        case styles.INTERNATIONAL:
            formatType = PNF.INTERNATIONAL;
            break;
        case styles.E164:
            formatType = PNF.E164;
            break;
        case styles.RFC3966:
            formatType = PNF.RFC3966;
            break;
        default:
            throw new Error(errors.INVALID_STYLE);
    }
    return phoneUtil.format(phoneNumber, formatType).toString();
}

/**
 * @param {Object} canonicalPhone
 * @param {string} region i.e. 'US'
 * @return {boolean|Error} true if phone number is valid, Error if phone number is not valid
 * @throws {Error} if conversion to protocol buffer phone format failed (getPBPhoneFromJSONPhone)
 *                 or if metadata has not been loaded for given region
 */
function validatePhoneNumber(canonicalPhone, region) {
    if (allRegionCodes.indexOf(region) === -1) {
        throw new Error(errors.UNSUPPORTED_REGION);
    }

    var phoneNumber;
    try {
        phoneNumber = getPBPhoneFromJSONPhone(canonicalPhone);
    } catch (e) {
        throw e;
    }
    var validFlag, errorCode = errors.PARSE_ERROR;
    if (region) {
        validFlag = phoneUtil.isValidNumberForRegion(phoneNumber, region);
        errorCode = errors.INVALID_FOR_REGION;
    } else {
        validFlag = phoneUtil.isValidNumber(phoneNumber);
    }
    if (validFlag) {
        return true;
    }

    // Attempt to get the cause of the error
    validFlag = phoneUtil.isPossibleNumberWithReason(phoneNumber);

    if (validFlag === i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT) {
        errorCode = errors.TOO_SHORT;
    } else if (validFlag === i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG) {
        errorCode = errors.TOO_LONG;
    }

    // Some other error
    return new Error(errorCode);
}

/**
 * @param {string} phoneNumberToParse
 * @param {string} region ie 'US'
 * @return {Object} canonicalPhone
 *         {Error} if number is invalid
 */
function parsePhoneNumber(phoneNumberToParse, region) {
    if (allRegionCodes.indexOf(region) === -1) {
        throw new Error(errors.UNSUPPORTED_REGION);
    }

    var parsedPhoneNumber;
    try {
        parsedPhoneNumber = phoneUtil.parse(phoneNumberToParse, region);
    } catch (e) {
        return new Error(errorToCode(e));
    }
    return protoToCanonicalPhone(parsedPhoneNumber);
}


/**
 * HELPER FUNCTIONS
 */

/**
 * Map i18n phonenumber errors to fixed set of errors
 * @param {string} error
 * @return {string} errorCode, values in errors object
 * @private
 */
function errorToCode(error) {
    var errorCode;
    switch (error) {
        case i18nError.INVALID_COUNTRY_CODE:
            errorCode = errors.INVALID_COUNTRY_CODE;
            break;
        case i18nError.NOT_A_NUMBER:
            errorCode = errors.NOT_A_NUMBER;
            break;
        case i18nError.TOO_SHORT_AFTER_IDD:
            errorCode = errors.TOO_SHORT_AFTER_IDD;
            break;
        case i18nError.TOO_SHORT_NSN:
            errorCode = errors.TOO_SHORT_NSN;
            break;
        case i18nError.TOO_LONG:
            errorCode = errors.TOO_LONG;
            break;
        default:
            errorCode = errors.PARSE_ERROR;
            break;
    }
    return errorCode;
}

/**
 * @param {Object} phoneNumber phone number in protocol buffer format
 * @return {Object} canonicalPhone
 * @private
 */
function protoToCanonicalPhone(phoneNumber) {

    if (phoneNumber === null) {
        return null;
    }

    var canonicalPhone = {
        'countryCode': phoneNumber.values_[1].toString(),
        'nationalNumber': phoneNumber.values_[2].toString()
    };

    if (phoneNumber.values_[4] && phoneUtil.isLeadingZeroPossible(phoneNumber.values_[1])) {
        canonicalPhone['nationalNumber'] = '0' + canonicalPhone['nationalNumber'];
    }

    if (phoneNumber.values_[3] !== undefined) {
        canonicalPhone['extension'] = phoneNumber.values_[3]; // quote property names to prevent closure compiler reduction
    }
    return canonicalPhone;
}

/**
 * @param {Object} canonicalPhone, where countryCode and nationalNumber are required
 * @return {i18n.phonenumbers.PhoneNumber} phoneNumber
 * @throws if countryCode or nationalNumber is undefined or NaN
 * @private
 */
function getPBPhoneFromJSONPhone(canonicalPhone) {
    var phoneNumber = new i18n.phonenumbers.PhoneNumber();
    //make a copy of countryCode/nationalNumber, don't change canonicalPhone
    var countryCode = canonicalPhone['countryCode'],
        nationalNumber = canonicalPhone['nationalNumber'],
        extension = canonicalPhone['extension']; // use string literals to prevent closure compiler from reducing

    // check well-formedness of countryCode
    if (countryCode === undefined) {
        throw new Error(errors.MISSING_COUNTRY_CODE);
    } else {
        if (typeof countryCode === 'string') {
            if (isNaN(Number(countryCode))) {
                throw new Error(errors.INVALID_COUNTRY_CODE);
            }
            countryCode = Number(countryCode);
        }
        phoneNumber.setCountryCode(countryCode);
    }

    // check well-formedness of nationalNumber
    if (nationalNumber === undefined) {
        throw new Error(errors.MISSING_NATIONAL_NUMBER);
    } else {
        if (typeof nationalNumber === 'string') {
            if (isNaN(Number(nationalNumber))) {
                throw new Error(errors.FORMAT_INVALID);
            }
            // setItalianLeadingZero = true if
            // nationalNumber is a string and starts with '0'
            // and leading zero is possible for that country
            phoneNumber.setItalianLeadingZero(nationalNumber.charAt(0) === '0' && phoneUtil.isLeadingZeroPossible(countryCode));

            nationalNumber = Number(nationalNumber);
        }
        phoneNumber.setNationalNumber(nationalNumber);
    }

    // extension should be a string, if it is a number, convert to string
    if (extension !== undefined) {
        if (typeof extension === 'number') {
            phoneNumber.setExtension(extension.toString());
        } else {
            phoneNumber.setExtension(extension);
        }
    }
    return phoneNumber;
}

// original functions
goog.exportSymbol('countryCodeToRegionCodeMap', countryCodeToRegionCodeMap);
goog.exportSymbol('getCountryCodeForRegion', getCountryCodeForRegion);
goog.exportSymbol('getSupportedRegions', getSupportedRegions);

// phone adapter functions
goog.exportSymbol('formatPhoneNumber', formatPhoneNumber);
goog.exportSymbol('validatePhoneNumber', validatePhoneNumber);
goog.exportSymbol('parsePhoneNumber', parsePhoneNumber);

// initialization function
goog.exportSymbol('useMeta', useMeta);

// AsYouTypeFormatter functions
goog.exportSymbol('asYouType.clear', asYouType.clear);
goog.exportSymbol('asYouType.inputDigit', asYouType.inputDigit);
goog.exportSymbol('asYouType.setRegion', asYouType.setRegion);
