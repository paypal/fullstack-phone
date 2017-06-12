'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance(),
    PNFormat = i18n.phonenumbers.PhoneNumberFormat, // national, international, etc.
    PNType = i18n.phonenumbers.PhoneNumberType, // fixed line, mobile, etc.
    PNValidationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult, // returned from isPossibleNumberWithReason: invalid country code, too short, too long, invalid length
    PNError = i18n.phonenumbers.Error, // thrown by parse: not a number, too short after IDD, etc.
    allRegionCodes; // region codes from metadata

// map style strings to PhoneNumberFormat codes
var stylesMap = {
    'e164': PNFormat.E164,
    'international': PNFormat.INTERNATIONAL,
    'national': PNFormat.NATIONAL,
    'rfc3966': PNFormat.RFC3966
},
    // returned from validatePhoneNumber (coded to a particular phone module message)
    validationErrors = {
        INVALID_FOR_REGION: 'PHONE_INVALID_FOR_COUNTRY',
        INVALID_COUNTRY_CODE: 'PHONE_INVALID_COUNTRY_CODE',
        TOO_LONG: 'PHONE_NUMBER_TOO_LONG',
        TOO_SHORT: 'PHONE_NUMBER_TOO_SHORT',
        INVALID_LENGTH: 'PHONE_NUMBER_INVALID_LENGTH' // not too long, not too short, but not just right, either
    },
    // thrown
    exceptions = {
        INVALID_STYLE: 'Invalid style property: ',
        METADATA_NOT_LOADED: 'No metadata loaded',
        UNSUPPORTED_REGION: 'Metadata not loaded for region: ', // thrown if function called with regionCode for which no metadata loaded
        PHONE_OBJ_INVALID: 'Phone object conversion failed: ',
        METADATA_INVALID: 'Invalid metadata' // thrown by useMeta
    },
    // NOTE: quote the keys so google closure compiler won't reduce them
    // map number type strings to PhoneNumberType codes
    numberTypeMap = {
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

// returned from parsePhoneNumber (coded to a particular phone module message)
var parseErrors = {};
parseErrors[PNError.INVALID_COUNTRY_CODE] = 'PHONE_INVALID_COUNTRY_CODE';
parseErrors[PNError.TOO_SHORT_NSN] = 'PHONE_NUMBER_TOO_SHORT';
parseErrors[PNError.TOO_LONG] = 'PHONE_NUMBER_TOO_LONG';
parseErrors[PNError.NOT_A_NUMBER] = 'PHONE_NOT_A_NUMBER';
parseErrors[PNError.TOO_SHORT_AFTER_IDD] = 'PHONE_TOO_SHORT_AFTER_IDD';

/**
 * @param {string} regionCode territory code
 * @return {Object} AsYouTypeFormatter object
 * Return a simple AsYouTypeFormatter object initialized to the given territory
 */
function getAsYouTypeFormatter(regionCode) {
    checkMetadataLoaded();

    checkSupportedRegion(regionCode);

    // instantiate formatter
    var formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);

    return {
        'inputDigit': function inputDigit(x) {
            return formatter.inputDigit(x);
        },
        'clear': function clear() {
            return formatter.clear();
        }
    };
}

/**
 * initialization function that calls injectMeta (provided by metadataInjector)
 * sets allRegionCodes
 * @param {Object} bundle metadata object with regionCodes, countryCodeToRegionCodeMap, and countryToMetadata properties
 * @throws {Error} if metadata is invalid
 */
function useMeta(bundle) {
    // check for missing bundle or bad regionCodes property
    // injectMeta function itself will check for countryCodeToRegionCodeMap and countryToMetadata
    // if we check for that here, it makes it harder to use libphonenumberUtil_full.js
    if (!bundle ||
        !bundle['regionCodes'] ||
        !Array.isArray(bundle['regionCodes']) ||
        !bundle['regionCodes'].length) {
        throw new Error(exceptions.METADATA_INVALID);
    }
    allRegionCodes = bundle['regionCodes']; // quote property names to prevent closure compiler from reducing them
    injectMeta(bundle['countryCodeToRegionCodeMap'], bundle['countryToMetadata']);
}

/**
 * Original functions from libphonenumber-hammond
 */

/**
 * @return {Object} map from country calling codes to arrays of regions
 * @throws {Error} if no metadata loaded yet
 */
function countryCodeToRegionCodeMap() {
    checkMetadataLoaded();
    return i18n.phonenumbers.metadata.countryCodeToRegionCodeMap;
}

/**
 * @param {string} regionCode territory code
 * @return {number} country calling code for that territory
 * @throws {Error} if metadata has not been loaded for that region
 *                 or no metadata loaded yet
 */
function getCountryCodeForRegion(regionCode) {
    checkMetadataLoaded();

    checkSupportedRegion(regionCode); // throws if region not supported

    return phoneUtil.getCountryCodeForRegion(regionCode);
}

/**
 * @return {Array} array of supported regions
 * @throws {Error} if no metadata loaded yet
 */
function getSupportedRegions() {
    checkMetadataLoaded();

    return phoneUtil.getSupportedRegions();
}


/**
 *  PHONE ADAPTER FUNCTIONS
 */


/**
 * @param {Object} phoneObj
 * @param {Object} options - style : 'national', 'international', 'E164' or 'RFC3699'
 * @return {string} formatted phone number if valid
 * @throws {Error} if style is invalid, or input is undefined/NaN
 */
function formatPhoneNumber(phoneObj, options) {
    checkMetadataLoaded();

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
}

/**
 * @param {Object} phoneObj
 * @param {string} regionCode i.e. 'US'
 * @return {boolean|Error} true if phone number is valid, Error with details if phone number is not valid
 * @throws {Error} if metadata has not been loaded for given region or phoneObj to proto conversion failed
 */
function validatePhoneNumber(phoneObj, regionCode) {
    checkMetadataLoaded();

    checkSupportedRegion(regionCode);

    var phoneNumber;
    try {
        phoneNumber = phoneObjToProto(phoneObj); // convert phoneObj to protocol buffer format
    } catch (e) {
        throw new Error(exceptions.PHONE_OBJ_INVALID + e.message);
    }

    // if number is valid for the region, simply return true
    if (phoneUtil.isValidNumberForRegion(phoneNumber, regionCode)) {
        return true;
    }

    // if number was not valid, attempt to get the reason
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
        // TODO: Identity test cases that trigger this error from isPossibleNumberWithReason()
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
}

/**
 * @param {string} phoneNumberToParse
 * @param {string} regionCode ie 'US'
 * @return {Object} phoneObj
 *         {Error} if number is invalid
 */
function parsePhoneNumber(phoneNumberToParse, regionCode) {
    checkMetadataLoaded();

    checkSupportedRegion(regionCode);

    var parsedPhoneNumber;
    try {
        parsedPhoneNumber = phoneUtil.parse(phoneNumberToParse, regionCode);
    } catch (e) {
        // libphonenumber no longer throws strings!
        // https://github.com/googlei18n/libphonenumber/commit/b702df040dcaab9fa549c1e32c06f06cce096df3#diff-2dcb77e833422ee304da348b905cde0b
        return new Error(parseErrors[e.message]); // map error message string to an error code and return a new Error object with that code
    }
    return protoToPhoneObj(parsedPhoneNumber);
}

/**
 * @param {string} regionCode
 * @param {string} type
 * @return {Object} phoneObj
 */
function getExampleNumberForType(regionCode, type) {
    checkMetadataLoaded();

    checkSupportedRegion(regionCode);

    // convert type string (e.g. 'FIXED_LINE') to PhoneNumberType code
    var numberType = numberTypeMap[type];

    if (numberType === undefined) {
        numberType = PNType.UNKNOWN;
    }

    return protoToPhoneObj(phoneUtil.getExampleNumberForType(regionCode, numberType));
}


/**
 * HELPER FUNCTIONS
 */

/**
 * @return {undefined} if metadata is loaded
 * @throws {Error} if no metadata loaded
 * @private
 */
function checkMetadataLoaded() {
    if (!allRegionCodes || !allRegionCodes.length) {
        throw new Error(exceptions.METADATA_NOT_LOADED);
    }
}

/**
 * @param {string} regionCode regionCode string to check
 * @return {undefined} if regionCode is supported
 * @throws {Error} if regionCode is not supported
 * @private
 */
function checkSupportedRegion(regionCode) {
    if (allRegionCodes.indexOf(regionCode) === -1) {
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

    var phoneObj = {
        'countryCode': phoneNumber.values_[1].toString(),
        'nationalNumber': phoneNumber.values_[2].toString()
    };

    if (phoneNumber.values_[4] && phoneUtil.isLeadingZeroPossible(phoneNumber.values_[1])) {
        phoneObj['nationalNumber'] = '0' + phoneObj['nationalNumber'];
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
 */
function phoneObjToProto(phoneObj) {
    var phoneNumber = new i18n.phonenumbers.PhoneNumber();

    var countryCode, nationalNumber, extension;

    // note: use string literals when referencing object properties to prevent closure compiler from reducing

    // deal with countryCode
    countryCode = Number(phoneObj['countryCode']); // convert to number
    phoneNumber.setCountryCode(countryCode);

    // deal with nationalNumber
    nationalNumber = phoneObj['nationalNumber'];
    if (typeof nationalNumber === 'string') { // special handling for nationalNumber string type (could have leading 0)

        // setItalianLeadingZero = true if
        // nationalNumber is a string and starts with '0'
        // and leading zero is possible for that country
        phoneNumber.setItalianLeadingZero(nationalNumber.charAt(0) === '0' && phoneUtil.isLeadingZeroPossible(countryCode));

        nationalNumber = Number(nationalNumber); // now convert to number (removes leading 0 if it exists)
    }
    phoneNumber.setNationalNumber(nationalNumber);

    // deal with extension
    if (phoneObj['extension'] !== undefined && phoneObj['extension'] !== null) { // if extension exists

        extension = phoneObj['extension'].toString(); // convert to string

        phoneNumber.setExtension(extension);
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
goog.exportSymbol('getExampleNumberForType', getExampleNumberForType);

// initialization function
goog.exportSymbol('useMeta', useMeta);

// AsYouTypeFormatter constructor
goog.exportSymbol('getAsYouTypeFormatter', getAsYouTypeFormatter);
