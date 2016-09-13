'use strict';

goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');

var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance(),
  regionCode, // region code for loading metadata
  formatter, // AsYouTypeFormatter
  statelessFormatter; // stateless AsYouTypeFormatter

// initialize regionCode and formatter
function init(code) {
  regionCode = code || 'US';
  formatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);
  statelessFormatter = new i18n.phonenumbers.AsYouTypeFormatter(regionCode);
  console.log('initialized everything to', regionCode);
}

function clearFormatter() {
  console.log('Clearing formatter');
  formatter.clear();
}

function inputDigit(digit) {
  console.log('Inputting digit', digit);
  return formatter.inputDigit(digit);
}

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

function isPossibleNumber(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.isPossibleNumber(number);
}

function isPossibleNumberWithReason(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.isPossibleNumberWithReason(number);
}

function isValidNumber(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.isValidNumber(number);
}

function isValidNumberForRegion(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.isValidNumberForRegion(number, regionCode);
}

function getCountryCodeForRegion() {
  return phoneUtil.getCountryCodeForRegion(regionCode);
}

function getRegionCodeForNumber(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.getRegionCodeForNumber(number);
}

function getNumberType(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
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

function formatE164(phoneNumber) {
  var PNF = i18n.phonenumbers.PhoneNumberFormat;
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.format(number, PNF.E164);
}

function formatNational(phoneNumber) {
  var PNF = i18n.phonenumbers.PhoneNumberFormat;
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.format(number, PNF.NATIONAL);
}

function formatInternational(phoneNumber) {
  var PNF = i18n.phonenumbers.PhoneNumberFormat;
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.format(number, PNF.INTERNATIONAL);
}

function formatInOriginalFormat(phoneNumber) {
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.formatInOriginalFormat(number, regionCode);
}

function formatOutOfCountryCallingNumber(phoneNumber, target) {
  if (!target) { return; }
  var number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
  return phoneUtil.formatOutOfCountryCallingNumber(number, target);
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

goog.exportSymbol('init', init);

// AsYouTypeFormatter functions
goog.exportSymbol('asYouType.clear', clearFormatter);
goog.exportSymbol('asYouType.inputDigit', inputDigit);
