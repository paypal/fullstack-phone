'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

// TODO add checking on regionCodes param

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance(),
    allRegionCodes, // region codes from metadata
    regionCode, // one region code to use for all functions
    formatter, // AsYouTypeFormatter
    statelessFormatter; // stateless AsYouTypeFormatter

// initialization function that calls injectMeta (provided by metadataInjector)
// sets allRegionCodes
// initializes formatter to first country (necessary to prevent Closure Compiler from removing the code)
function useMeta(bundle) {
    console.log('useMeta called for', bundle['regionCodes']);
    allRegionCodes = bundle['regionCodes']; // quote property names to prevent closure compiler from reducing them
    injectMeta(bundle['countryCodeToRegionCodeMap'], bundle['countryToMetadata']);

    // initialize formatters to the first region code just to prevent closure compiler from removing the code
    setRegion(allRegionCodes[0]); // do this only AFTER injecting metadata
    console.log('useMeta initialized everything to', allRegionCodes);
}

// initialize default region and asYouType formatters
function setRegion(regionCodeParam) {
    if (allRegionCodes.indexOf(regionCodeParam) === -1) {
        throw new Error('Unsupported region: ' + regionCodeParam);
    }

    regionCode = regionCodeParam; // set default region for all function

    // initialize asYouType formatters for default region
    formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);
    statelessFormatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);

}

// namespace the stateful AsYouTypeFormatter functions
var asYouType = {
    clear: function clear() {
        console.log('Clearing formatter');
        formatter.clear();
    },

    inputDigit: function inputDigit(digit) {
        console.log('Inputting digit', digit);
        return formatter.inputDigit(digit);
    }
};

// stateless AsYouTypeFormatter (pass full string to it each time)
// designed as stateless to work with ADVANCED_OPTIMIZATIONS
function formatAsTyped(phoneNumber) {

    console.log('Clearing AsYouTypeFormatter for', regionCode);
    statelessFormatter.clear();

    var output;

    // loop over phone number and input digits one by one, then return final output
    if (phoneNumber && typeof phoneNumber === 'string') {
        for (var i = 0; i < phoneNumber.length; i++) {
            output = statelessFormatter.inputDigit(phoneNumber.charAt(i));
            console.log('char:', phoneNumber.charAt(i), 'output:', output);
        }
    }

    return output;
}

function countryCodeToRegionCodeMap() {
    return i18n.phonenumbers.metadata.countryCodeToRegionCodeMap;
}

function isPossibleNumber(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.isPossibleNumber(number);
}

function isPossibleNumberWithReason(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.isPossibleNumberWithReason(number);
}

function isValidNumber(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.isValidNumber(number);
}

function isValidNumberForRegion(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.isValidNumberForRegion(number, regionCodeParam || regionCode);
}

function getCountryCodeForRegion(regionCodeParam) {
    return phoneUtil.getCountryCodeForRegion(regionCodeParam || regionCode);
}

function getRegionCodeForNumber(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.getRegionCodeForNumber(number);
}

function getNumberType(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    var output;
    var PNT = i18n.phonenumbers.PhoneNumberType;
    switch (phoneUtil.getNumberType(number)) {
        case PNT.FIXED_LINE:
            output = 'FIXED_LINE';
            break;
        case PNT.MOBILE:
            output = 'MOBILE';
            break;
        case PNT.FIXED_LINE_OR_MOBILE:
            output = 'FIXED_LINE_OR_MOBILE';
            break;
        case PNT.TOLL_FREE:
            output = 'TOLL_FREE';
            break;
        case PNT.PREMIUM_RATE:
            output = 'PREMIUM_RATE';
            break;
        case PNT.SHARED_COST:
            output = 'SHARED_COST';
            break;
        case PNT.VOIP:
            output = 'VOIP';
            break;
        case PNT.PERSONAL_NUMBER:
            output = 'PERSONAL_NUMBER';
            break;
        case PNT.PAGER:
            output = 'PAGER';
            break;
        case PNT.UAN:
            output = 'UAN';
            break;
        case PNT.UNKNOWN:
            output = 'UNKNOWN';
            break;
    }
    return output;
}

function getSupportedRegions() {
    return phoneUtil.getSupportedRegions();
}

function formatE164(phoneNumber, regionCodeParam) {
    var PNF = i18n.phonenumbers.PhoneNumberFormat;
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.format(number, PNF.E164);
}

function formatNational(phoneNumber, regionCodeParam) {
    var PNF = i18n.phonenumbers.PhoneNumberFormat;
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.format(number, PNF.NATIONAL);
}

function formatInternational(phoneNumber, regionCodeParam) {
    var PNF = i18n.phonenumbers.PhoneNumberFormat;
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.format(number, PNF.INTERNATIONAL);
}

function formatInOriginalFormat(phoneNumber, regionCodeParam) {
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.formatInOriginalFormat(number, regionCodeParam || regionCode);
}

function formatOutOfCountryCallingNumber(phoneNumber, regionCodeParam, target) {
    if (!target) { return; }
    var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCodeParam || regionCode);
    return phoneUtil.formatOutOfCountryCallingNumber(number, target);
}

function getExampleNumber(regionCodeParam) {
    return phoneUtil.getExampleNumber(regionCodeParam || regionCode);
}

function getMetadataForRegion(regionCodeParam) {
    return phoneUtil.getMetadataForRegion(regionCodeParam || regionCode);
}

function parsePhoneNumber(phoneNumberToParse, regionCodeParam) {
    return protoToCanonicalPhone(phoneUtil.parse(phoneNumberToParse, regionCodeParam || regionCode));
}

function protoToCanonicalPhone(phoneNumber) {

    if (phoneNumber === null) {
        return null;
    }

    var canonicalPhone = {};

    canonicalPhone['countryCode'] = phoneNumber.values_[1].toString();
    canonicalPhone['nationalNumber'] = phoneNumber.values_[2].toString(); // use string literals to prevent Closure optimization

    if (phoneNumber.values_[4] && phoneUtil.isLeadingZeroPossible(phoneNumber.values_[1])) {
        canonicalPhone['nationalNumber'] = '0' + canonicalPhone['nationalNumber'];
    }

    if (phoneNumber.values_[3] !== undefined) {
        canonicalPhone['extension'] = phoneNumber.values_[3];
    }
    return canonicalPhone;
}

goog.exportSymbol('countryCodeToRegionCodeMap', countryCodeToRegionCodeMap);
goog.exportSymbol('isPossibleNumber', isPossibleNumber);
goog.exportSymbol('isPossibleNumberWithReason', isPossibleNumberWithReason);
goog.exportSymbol('isValidNumber', isValidNumber);
goog.exportSymbol('isValidNumberForRegion', isValidNumberForRegion);
goog.exportSymbol('getCountryCodeForRegion', getCountryCodeForRegion);
goog.exportSymbol('getRegionCodeForNumber', getRegionCodeForNumber);
goog.exportSymbol('getNumberType', getNumberType);
goog.exportSymbol('getSupportedRegions', getSupportedRegions);
goog.exportSymbol('formatE164', formatE164);
goog.exportSymbol('formatNational', formatNational);
goog.exportSymbol('formatInternational', formatInternational);
goog.exportSymbol('formatInOriginalFormat', formatInOriginalFormat);
goog.exportSymbol('formatOutOfCountryCallingNumber', formatOutOfCountryCallingNumber);
goog.exportSymbol('formatAsTyped', formatAsTyped);
goog.exportSymbol('getExampleNumber', getExampleNumber);
goog.exportSymbol('getMetadataForRegion', getMetadataForRegion);
goog.exportSymbol('parsePhoneNumber', parsePhoneNumber);

goog.exportSymbol('useMeta', useMeta);
goog.exportSymbol('setRegion', setRegion);

// AsYouTypeFormatter functions
goog.exportSymbol('asYouType.clear', asYouType.clear);
goog.exportSymbol('asYouType.inputDigit', asYouType.inputDigit);
