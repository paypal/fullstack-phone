'use strict';

var assert = require('assert'),
    loadMeta = require('../loadMeta'),
    lib = require('../dist/libphonenumber');

describe('Phone handler-exported functions test', function () {
    describe('Test formatting/validation of US phone numbers', function () {

        // setup
        before(function () {
            var meta = loadMeta(['BS']); // loading Bahamas also loads US
            lib.useMeta(meta);
        });

        it('Should show BS and US as supported regions', function () {
            assert.deepEqual(lib.getSupportedRegions(), ['BS', 'US']);
            assert.deepEqual(lib.countryCodeToRegionCodeMap(), { '1': ['US', 'BS'] });
        });

        it('Should format US phone numbers', function () {
            var phone = {
                countryCode: '1',
                nationalNumber: '9104678933'
            };

            var optionResults = [
                {
                    style: 'national',
                    result: '(910) 467-8933'
                },
                {
                    style: 'international',
                    result: '+1 910-467-8933'
                },
                {
                    style: 'e164',
                    result: '+19104678933'
                },
                {
                    style: 'rfc3966',
                    result: 'tel:+1-910-467-8933'
                }
            ];

            optionResults.forEach(function (optionObj) {
                var options = {
                    style: optionObj.style
                };
                assert.equal(lib.formatPhoneNumber(phone, options), optionObj.result);
            });
        });

        it('Should validate US phone numbers', function () {
            var numbers = [
                {
                    countryCode: '1',
                    nationalNumber: '9104678933'
                },
                {
                    countryCode: '1',
                    nationalNumber: '5103981827'
                }
            ];

            numbers.forEach(function (phone) {
                assert.equal(lib.validatePhoneNumber(phone, 'US'), true);
            });
        });

        it('Should not validate invalid US phone numbers', function () {
            // TODO add more
            var badNumbers = [
                {
                    numberObj: { countryCode: '1', nationalNumber: '5' },
                    errorMessage: 'PHN_NUMBER_TOO_SHORT'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '5103981827' },
                    errorMessage: 'PHN_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '01212345678' }, // GB number
                    errorMessage: 'PHN_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '51052618767' }, // one extra digit
                    errorMessage: 'PHN_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = lib.validatePhoneNumber(phone.numberObj, 'US');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phone.errorMessage);
            });
        });

        it('Should format US number as typed using stateful AsYouTypeFormatter', function () {
            lib.asYouType.setRegion('US');
            lib.asYouType.clear();

            assert.equal(lib.asYouType.inputDigit('9'), '9');
            assert.equal(lib.asYouType.inputDigit('1'), '91');
            assert.equal(lib.asYouType.inputDigit('9'), '919');
            assert.equal(lib.asYouType.inputDigit('2'), '919-2');
            assert.equal(lib.asYouType.inputDigit('8'), '919-28');
            assert.equal(lib.asYouType.inputDigit('2'), '919-282');
            assert.equal(lib.asYouType.inputDigit('3'), '919-2823');
            assert.equal(lib.asYouType.inputDigit('4'), '(919) 282-34');
            assert.equal(lib.asYouType.inputDigit('5'), '(919) 282-345');
            assert.equal(lib.asYouType.inputDigit('6'), '(919) 282-3456');

            // test overrun
            assert.equal(lib.asYouType.inputDigit('7'), '91928234567');

            // test that clear works
            lib.asYouType.clear();
            assert.equal(lib.asYouType.inputDigit('9'), '9');
        });

        it('Should throw errors if metadata not loaded for requested region', function () {
            assert.throws(() => lib.asYouType.setRegion('TR'), /PHN_UNSUPPORTED_REGION/);
            assert.throws(() => lib.getCountryCodeForRegion('TR'), /PHN_UNSUPPORTED_REGION/);
            assert.throws(() => lib.validatePhoneNumber({}, 'TR'), /PHN_UNSUPPORTED_REGION/);
        });
    });

    describe('Test formatting/validation of GB & RU phone numbers', function () {

        // setup
        before(function () {
            var meta = loadMeta(['KZ', 'AU', 'GG', 'GB']);
            lib.useMeta(meta);
        });

        it('Should show supported regions', function () {
            assert.deepEqual(lib.getSupportedRegions(), ['KZ', 'RU', 'AU', 'GG', 'GB']);
            assert.deepEqual(lib.countryCodeToRegionCodeMap(), {
                '7': ['RU', 'KZ'],
                '44': ['GB', 'GG'],
                '61': ['AU']
            });
        });

        it('Should format GB phone numbers', function () {
            var phone = {
                countryCode: '44',
                nationalNumber: '1212345678'
            };

            var optionResults = [
                {
                    style: 'national',
                    result: '0121 234 5678'
                },
                {
                    style: 'international',
                    result: '+44 121 234 5678'
                },
                {
                    style: 'e164',
                    result: '+441212345678'
                },
                {
                    style: 'rfc3966',
                    result: 'tel:+44-121-234-5678'
                }
            ];

            optionResults.forEach(function (optionObj) {
                var options = {
                    style: optionObj.style
                };
                assert.equal(lib.formatPhoneNumber(phone, options), optionObj.result);
            });
        });

        it('Should format RU phone numbers', function () {
            var phone = {
                countryCode: '7',
                nationalNumber: '9123456789' // mobile
            };

            var optionResults = [
                {
                    style: 'national',
                    result: '8 (912) 345-67-89'
                },
                {
                    style: 'international',
                    result: '+7 912 345-67-89'
                },
                {
                    style: 'e164',
                    result: '+79123456789'
                },
                {
                    style: 'rfc3966',
                    result: 'tel:+7-912-345-67-89'
                }
            ];

            optionResults.forEach(function (optionObj) {
                var options = {
                    style: optionObj.style
                };
                assert.equal(lib.formatPhoneNumber(phone, options), optionObj.result);
            });
        });

        it('Should validate GB phone numbers', function () {
            var numbers = [
                {
                    countryCode: '44',
                    nationalNumber: '01212345678' // fixed line
                },
                {
                    countryCode: '44',
                    nationalNumber: '07400123456' // mobile
                }
            ];

            numbers.forEach(function (phone) {
                assert.ok(lib.validatePhoneNumber(phone, 'GB'));
            });
        });

        it('Should format GB number as typed using stateful AsYouTypeFormatter', function () {
            lib.asYouType.setRegion('GB');
            lib.asYouType.clear();

            assert.equal(lib.asYouType.inputDigit('0'), '0');
            assert.equal(lib.asYouType.inputDigit('1'), '01');
            assert.equal(lib.asYouType.inputDigit('2'), '012');
            assert.equal(lib.asYouType.inputDigit('1'), '0121');
            assert.equal(lib.asYouType.inputDigit('2'), '0121 2');
            assert.equal(lib.asYouType.inputDigit('3'), '0121 23');
            assert.equal(lib.asYouType.inputDigit('4'), '0121 234');
            assert.equal(lib.asYouType.inputDigit('5'), '0121 234 5');
            assert.equal(lib.asYouType.inputDigit('6'), '0121 234 56');
            assert.equal(lib.asYouType.inputDigit('7'), '01212 34567');
            assert.equal(lib.asYouType.inputDigit('8'), '0121 234 5678');

            // test overrun
            assert.equal(lib.asYouType.inputDigit('9'), '012123456789');

            // test that clear works
            lib.asYouType.clear();
            assert.equal(lib.asYouType.inputDigit('0'), '0');
        });

        it('Should not validate invalid GB phone numbers', function () {
            // TODO add more
            var badNumbers = [
                {
                    numberObj: { countryCode: '44', nationalNumber: '5' },
                    errorMessage: 'PHN_NUMBER_TOO_SHORT'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '01212345678' },
                    errorMessage: 'PHN_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '5105261987' },
                    errorMessage: 'PHN_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '012123456789' }, // one extra digit
                    errorMessage: 'PHN_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = lib.validatePhoneNumber(phone.numberObj, 'GB');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phone.errorMessage);
            });
        });

        it('Should throw errors for certain invalid inputs', function () {
            var throwableNumbers = [
                {
                    numberObj: { countryCode: '44', nationalNumber: undefined },
                    errorRegex: /PHN_NUMBER_EMPTY/
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: 'ABCDE' },
                    errorRegex: /PHN_FORMAT_INVALID/
                },
                {
                    numberObj: { countryCode: undefined, nationalNumber: '01212345678' },
                    errorRegex: /PHN_COUNTRY_MISSING/
                },
                {
                    numberObj: { countryCode: 'ABCD', nationalNumber: '01212345678' },
                    errorRegex: /PHN_COUNTRY_CODE_INVALID/
                }
            ];

            throwableNumbers.forEach(function (phone) {
                assert.throws(() => lib.validatePhoneNumber(phone.numberObj ,'GB'), phone.errorRegex);
            });
        });
    });
});

/*
 ===================
 Debugging functions
 ===================
 */

/* jshint ignore:start */

// quick function to show output
function showMe(obj) {
    console.log(require('util').inspect(obj, false, null));
}

// quick function to show output as JSON
function showJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

/* jshint ignore:end */