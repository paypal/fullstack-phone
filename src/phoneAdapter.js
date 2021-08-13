'use strict';
// tell jshint not to complain about quoted property names
// which are necessary to prevent Closure Compiler from reducing them
/* jshint sub:true */

// tell jshint not to complain about identifiers defined elsewhere
/* globals injectMeta, i18n, goog */

// Closure directives to load dependent modules
goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
var PNFormat = i18n.phonenumbers.PhoneNumberFormat; // national, international, etc.
var PNType = i18n.phonenumbers.PhoneNumberType; // fixed line, mobile, etc.

// returned from isPossibleNumberWithReason: invalid country code, too short, too long, invalid length
var PNValidationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult;

// thrown by parse: not a number, too short after IDD, etc.
var PNError = i18n.phonenumbers.Error;

// map style strings to PhoneNumberFormat codes
var stylesMap = {
    'e164': PNFormat.E164,
    'international': PNFormat.INTERNATIONAL,
    'national': PNFormat.NATIONAL,
    'rfc3966': PNFormat.RFC3966
};

// returned from validatePhoneNumber
var validationErrors = {
    INVALID_FOR_REGION: 'PHONE_INVALID_FOR_REGION',
    INVALID_COUNTRY_CODE: 'PHONE_INVALID_COUNTRY_CODE',
    TOO_LONG: 'PHONE_NUMBER_TOO_LONG',
    TOO_SHORT: 'PHONE_NUMBER_TOO_SHORT',

    // INVALID_LENGTH: not too long, not too short, but not just right, either
    // e.g. Andorra (AD) numbers are 6, 8, or 9 digits, so a 7-digit number yields this error:
    INVALID_LENGTH: 'PHONE_NUMBER_INVALID_LENGTH'
};

// thrown
var exceptions = {
    INVALID_STYLE: 'Invalid style property: ',
    UNSUPPORTED_REGION: 'Metadata not loaded for region: ', // thrown if function called with regionCode for which no metadata loaded
    PHONE_OBJ_INVALID: 'Phone object conversion failed: ',
    METADATA_INVALID: 'Invalid metadata' // thrown by injectMeta
};

// NOTE: quote the keys so google closure compiler won't reduce them
// map number type strings to PhoneNumberType codes
var numberTypeMap = {
    'FIXED_LINE': PNType.FIXED_LINE,
    'MOBILE': PNType.MOBILE,
    'FIXED_LINE_OR_MOBILE': PNType.FIXED_LINE_OR_MOBILE,
    'TOLL_FREE': PNType.TOLL_FREE,
    'PREMIUM_RATE': PNType.PREMIUM_RATE,
    'SHARED_COST': PNType.SHARED_COST,
    'VOIP': PNType.VOIP,
    'PERSONAL_NUMBER': PNType.PERSONAL_NUMBER,
    'PAGER': PNType.PAGER,
    'UAN': PNType.UAN,
    'VOICEMAIL': PNType.VOICEMAIL
};

// create reverse map of PhoneNumberType codes to strings
// e.g., PNType.FIXED_LINE --> "FIXED_LINE"
// for use in inferPhoneNumberType
var reverseNumberTypeMap = Object.keys(numberTypeMap).reduce(function (acc, cur) {
    acc[numberTypeMap[cur]] = cur;
    return acc;
}, {});

// returned from parsePhoneNumber (coded to a particular phone module message)
var parseErrors = {};
parseErrors[PNError.INVALID_COUNTRY_CODE] = 'PHONE_INVALID_COUNTRY_CODE';
parseErrors[PNError.TOO_SHORT_NSN] = 'PHONE_NUMBER_TOO_SHORT';
parseErrors[PNError.TOO_LONG] = 'PHONE_NUMBER_TOO_LONG';
parseErrors[PNError.NOT_A_NUMBER] = 'PHONE_NOT_A_NUMBER';
parseErrors[PNError.TOO_SHORT_AFTER_IDD] = 'PHONE_TOO_SHORT_AFTER_IDD';

/**
 * Initialization function that returns a phone handler initialized for the given metadata bundle
 * @param {Object} metadata metadata object with regionCodes, countryCodeToRegionCodeMap, and countryToMetadata properties
 * @throws {Error} if metadata is invalid
 * @return {Object} phone handler for the given metadata bundle
 */
function createPhoneHandler(metadata) {

    validateMetadata(metadata);

    // return handler
    // note that PhoneNumberUtil is a singleton, so metadata has to be re-injected in every function call
    return {

        /**
         * Original functions from libphonenumber-hammond
        */

        /**
         * @return {Array} array of supported regions
         */
        'getSupportedRegions': function getSupportedRegions() {
            injectMeta(metadata);
            return phoneUtil.getSupportedRegions();
        },

        /**
         * @param {string} regionCode territory code
         * @return {number} country calling code for that territory
         * @throws {Error} if metadata has not been loaded for that region
         */
        'getCountryCodeForRegion': function getCountryCodeForRegion(regionCode) {
            injectMeta(metadata);
            assertSupportedRegion(regionCode, metadata); // throws if region not supported

            return phoneUtil.getCountryCodeForRegion(regionCode);
        },

        /**
         * @return {Object} map from country calling codes to arrays of regions
         * @throws {Error} if no metadata loaded yet
         */
        'countryCodeToRegionCodeMap': function countryCodeToRegionCodeMap() {
            injectMeta(metadata);
            return i18n.phonenumbers.metadata.countryCodeToRegionCodeMap;
        },

        /**
         *  PHONE ADAPTER FUNCTIONS
         */

        /**
         * @param {Object} phoneObj
         * @return {string} phone number type as a string (see numberTypeMap)
         * @throws {Error} if phoneObj is invalid
         */
        'inferPhoneNumberType': function inferPhoneNumberType(phoneObj) {
            injectMeta(metadata);
            var phoneNumber;
            try {
                phoneNumber = phoneObjToProto(phoneObj); // convert phoneObj to protocol buffer format
            } catch (e) {
                throw new Error(exceptions.PHONE_OBJ_INVALID + e.message);
            }

            return reverseNumberTypeMap[phoneUtil.getNumberType(phoneNumber)] || 'UNKNOWN';
        },

        /**
         * @param {Object} phoneObj
         * @return {string|null} phone number region (e.g., "GB") or null if the region cannot be determined
         * @throws {Error} if phoneObj is invalid
         */
        'inferPhoneNumberRegion': function inferPhoneNumberRegion(phoneObj) {
            injectMeta(metadata);
            var phoneNumber;
            try {
                phoneNumber = phoneObjToProto(phoneObj); // convert phoneObj to protocol buffer format
            } catch (e) {
                throw new Error(exceptions.PHONE_OBJ_INVALID + e.message);
            }

            return phoneUtil.getRegionCodeForNumber(phoneNumber); // will return null if region cannot be determined
        },

        /**
         * @param {Object} phoneObj
         * @param {Object} options - style : 'national', 'international', 'E164' or 'RFC3699'
         * @return {string} formatted phone number if valid
         * @throws {Error} if style is invalid, or input is undefined/NaN
         */
        'formatPhoneNumber': function formatPhoneNumber(phoneObj, options) {
            injectMeta(metadata);
            var phoneNumber;
            try {
                phoneNumber = phoneObjToProto(phoneObj); // convert phoneObj to protocol buffer format
            } catch (e) {
                throw new Error(exceptions.PHONE_OBJ_INVALID + e.message);
            }

            options = options || {};

            // map style string (e.g. 'national') to PhoneNumberFormat code
            var formatType = stylesMap[options.style];
            if (formatType === undefined) {
                throw new Error(exceptions.INVALID_STYLE + options.style);
            }

            return phoneUtil.format(phoneNumber, formatType).toString();
        },

        /**
         * @param {Object} phoneObj
         * @param {string=} regionCode (optional) e.g., 'US'
         * @return {boolean|Error} true if phone number is valid, Error with details if phone number is not valid
         * @throws {Error} if metadata has not been loaded for given region or phoneObj to proto conversion failed
         */
        'validatePhoneNumber': function validatePhoneNumber(phoneObj, regionCode) {
            // TODO: assert on phoneObj
            injectMeta(metadata);
            // if regionCode is provided, verify that metadata is loaded for the region
            if (regionCode !== undefined) {
                assertSupportedRegion(regionCode, metadata);
            }

            var phoneNumber;
            try {
                phoneNumber = phoneObjToProto(phoneObj); // convert phoneObj to protocol buffer format
            } catch (e) {
                throw new Error(exceptions.PHONE_OBJ_INVALID + e.message);
            }

            var validPhone = (regionCode === undefined)
                ? phoneUtil.isValidNumber(phoneNumber) // if regionCode omitted
                : phoneUtil.isValidNumberForRegion(phoneNumber, regionCode); // if regionCode provided

            // if number is valid, simply return true
            if (validPhone) {
                return true;
            }

            // if number is not valid, attempt to get the reason
            var validFlag = phoneUtil.isPossibleNumberWithReason(phoneNumber),
                errorCode;

            // select Error to return based on validFlag code
            switch (validFlag) {
                case PNValidationResult.INVALID_COUNTRY_CODE:
                    errorCode = validationErrors.INVALID_COUNTRY_CODE;
                    break;
                case PNValidationResult.TOO_SHORT:
                    errorCode = validationErrors.TOO_SHORT;
                    break;
                case PNValidationResult.TOO_LONG:
                    errorCode = validationErrors.TOO_LONG;
                    break;
                case PNValidationResult.INVALID_LENGTH:
                    errorCode = validationErrors.INVALID_LENGTH;
                    break;
                // in this case, isPossibleNumberWithReason returned IS_POSSIBLE or IS_POSSIBLE_LOCAL_ONLY
                // but isPossibleNumberWithReason can be more lenient than isValidNumberForRegion
                // so return a default error
                default:
                    errorCode = validationErrors.INVALID_FOR_REGION;
            }

            // return the error as Error object
            return new Error(errorCode);
        },

        /**
         * @param {string} phoneNumberToParse
         * @param {string=} regionCode (optional) e.g., 'US'
         * @return {Object|Error} phoneObj or Error if number is invalid
         */
        'parsePhoneNumber': function parsePhoneNumber(phoneNumberToParse, regionCode) {
            injectMeta(metadata);
            // if regionCode is provided, verify that metadata is loaded for the region
            if (regionCode !== undefined) {
                assertSupportedRegion(regionCode, metadata);
            }

            var parsedPhoneNumber;
            try {
                parsedPhoneNumber = phoneUtil.parse(phoneNumberToParse, regionCode);
            } catch (e) {
                // libphonenumber no longer throws strings!
                // https://github.com/googlei18n/libphonenumber/commit/b702df040dcaab9fa549c1e32c06f06cce096df3#diff-2dcb77e833422ee304da348b905cde0b
                return new Error(parseErrors[e.message]); // map error message string to an error code and return a new Error object with that code
            }
            return protoToPhoneObj(parsedPhoneNumber);
        },

        /**
         * @param {string} regionCode
         * @param {string} type
         * @return {Object} phoneObj
         */
        'getExampleNumberForType': function getExampleNumberForType(type, regionCode) {
            injectMeta(metadata);
            assertSupportedRegion(regionCode, metadata);

            // convert type string (e.g. 'FIXED_LINE') to PhoneNumberType code
            var numberType = numberTypeMap[type];

            if (numberType === undefined) {
                numberType = PNType.UNKNOWN;
            }

            return protoToPhoneObj(phoneUtil.getExampleNumberForType(regionCode, numberType));
        },

        /**
         * @param {string} regionCode territory code
         * @return {Object} AsYouTypeFormatter object
         * Return a simple AsYouTypeFormatter object initialized to the given territory
         */
        'getAsYouTypeFormatter': function getAsYouTypeFormatter(regionCode) {
            injectMeta(metadata);
            assertSupportedRegion(regionCode, metadata);

            // instantiate formatter
            var formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);

            return {
                'inputDigit': function inputDigit(x) {
                    return formatter.inputDigit(x);
                },
                'clear': function clear() {
                    return formatter.clear();
                },
                'inputDigitAndRememberPosition': function inputDigitAndRememberPosition(x) {
                    return formatter.inputDigitAndRememberPosition(x);
                },
                'getRememberedPosition': function getRememberedPosition() {
                    return formatter.getRememberedPosition();
                }
            };
        }

    }; // end handler object
} // end createPhoneHandler


/**
 * HELPER FUNCTIONS
 */

function validateMetadata(metadata) {
    // check for valid metadata
    if (!isPlainObject(metadata)) {
        throw new Error(exceptions.METADATA_INVALID);
    }
    var regionCodesArray = metadata['regionCodes'];

    if (!regionCodesArray || !Array.isArray(regionCodesArray) || !regionCodesArray.length) {
        throw new Error(exceptions.METADATA_INVALID);
    }

    if (!isPlainObject(metadata['countryCodeToRegionCodeMap']) || !isPlainObject(metadata['countryToMetadata'])) {
        throw new Error(exceptions.METADATA_INVALID);
    }

}

/**
 * @param {Object} object parameter to test
 * @return {boolean} true if parameter is a plain object
 * @private
 */
function isPlainObject(object) {
    return object !== null &&
        '' + object === '[object Object]' &&
        object.constructor === Object;
}

/**
 * @param {string} regionCode regionCode string to check
 * @param {Object} metadata the metadata bundle with 'regionCodes' property
 * @return {undefined} if regionCode is supported
 * @throws {Error} if regionCode is not supported
 * @private
 */
function assertSupportedRegion(regionCode, metadata) {
    if (metadata['regionCodes'].indexOf(regionCode) === -1) {
        throw new Error(exceptions.UNSUPPORTED_REGION + regionCode);
    }
}

/**
 * @param {Object} phoneNumber phone number in protocol buffer format
 * @return {Object} phone object
 * @private
 */
function protoToPhoneObj(phoneNumber) {

    if (phoneNumber === null) {
        return null;
    }

    // extract countryCode and nationalNumber from proto buffer phone
    var phoneObj = {
        'countryCode': phoneNumber.values_[1].toString(),
        'nationalNumber': phoneNumber.values_[2].toString()
    };

    // set leading zeros if they exist
    if (phoneNumber.hasItalianLeadingZero()) {
        var numberOfLeadingZeros = phoneNumber.getNumberOfLeadingZerosOrDefault(); // don't use getNumberOfLeadingZeros because that returns null if it's only 1 (so use getNumberOfLeadingZerosOrDefault instead)
        for (var i = 0; i < numberOfLeadingZeros; i++) {
            phoneObj['nationalNumber'] = '0' + phoneObj['nationalNumber']; // TODO: use ES6 String.prototype.repeat
        }
    }

    if (phoneNumber.values_[3] !== undefined) {
        phoneObj['extension'] = phoneNumber.values_[3]; // quote property names to prevent closure compiler reduction
    }
    return phoneObj;
}

/**
 * @param {Object} phoneObj, where countryCode and nationalNumber are required
 * @return {i18n.phonenumbers.PhoneNumber} phoneNumber in protocol buffer format
 * @private
 *
 * Note: assumes phoneObj is already in correct format:
 *      countryCode: integer or string of integer
 *      nationalNumber: integer or string of integer
 *      extension: string or number
 *
 * For phoneNumber protocol buffer methods, countryCode and nationalNumber are converted to number, and extension is converted to string
 *
 * NOTE: Could perform this conversion by simply passing countryCode + nationalNumber + ';' + extension to parse, if region were known
 */
function phoneObjToProto(phoneObj) {
    var phoneNumber = new i18n.phonenumbers.PhoneNumber();

    var countryCode, nationalNumber, extension;
    var hasLeadingZero = false;

    // note: use string literals when referencing object properties to prevent closure compiler from reducing

    // deal with countryCode
    countryCode = Number(phoneObj['countryCode']); // convert to number
    phoneNumber.setCountryCode(countryCode);

    // deal with nationalNumber
    nationalNumber = phoneObj['nationalNumber'];
    if (typeof nationalNumber === 'string') { // special handling for nationalNumber string type (could have leading 0's)

        // loop over digits to determine how many leading zeros there might be
        var i = 0;
        while (nationalNumber.charAt(i) === '0') {
            hasLeadingZero = true;
            i++;
        }

        // if one or more leading zeros, call the appropriate proto buffer phone setters
        if (hasLeadingZero) {
            phoneNumber.setItalianLeadingZero(true);
            phoneNumber.setNumberOfLeadingZeros(i);
        }

        nationalNumber = Number(nationalNumber); // now convert to number (removes leading 0's if they exist)
    }
    phoneNumber.setNationalNumber(nationalNumber);

    // deal with extension
    if (phoneObj['extension'] !== undefined && phoneObj['extension'] !== null) { // if extension exists

        extension = phoneObj['extension'].toString(); // convert to string

        phoneNumber.setExtension(extension);
    }

    return phoneNumber;
}

// initialization function
goog.exportSymbol('createPhoneHandler', createPhoneHandler);
