'use strict';

var assert = require('assert'),
    loadPhoneMeta = require('../dist/loadPhoneMeta'),
    phoneUtil = require('../dist/phoneUtil');

describe('Test phoneUtil exceptions', function () {

    /*
    // phoneUtil is a singleton, so this test doesn't work when it's run after others have initialized phoneUtil
    it('Should throw errors when metadata not loaded', function () {
        assert.throws(() => phoneUtil.getExampleNumberForType(), /No metadata loaded/);
    });
    */

    it('Should throw error for unsupported region', function () {

        var meta = loadPhoneMeta(['US']);
        phoneUtil.useMeta(meta);

        assert.throws(() => phoneUtil.getExampleNumberForType('GB', 'MOBILE'), /Metadata not loaded for region/);

    });

    it('Should throw error for invalid style object', function () {

        var meta = loadPhoneMeta(['US']);
        phoneUtil.useMeta(meta);

        var phoneObj = {
            countryCode: '1',
            nationalNumber: '5105261234'
        };

        var badStyleOptions = ['', 0, 1, {}, [], true, null, undefined, { style: 'INVALID' }, function () { }];

        badStyleOptions.forEach(function (options) {
            assert.throws(() => phoneUtil.formatPhoneNumber(phoneObj, options), /Invalid style/);
        });
    });

    it('Should throw error for phoneObj that fails conversion to proto format', function () {

        var meta = loadPhoneMeta(['US']);
        phoneUtil.useMeta(meta);

        var badPhoneObjects = [null, undefined];

        badPhoneObjects.forEach(function (phoneObj) {
            assert.throws(() => phoneUtil.formatPhoneNumber(phoneObj, { style: 'national' }), /Phone object conversion failed/);
            assert.throws(() => phoneUtil.validatePhoneNumber(phoneObj, 'US'), /Phone object conversion failed/);
        });

    });
});

describe('Phone adapter functionality tests', function () {
    describe('Test mapping from legacy regions to libphonenumber-supported regions', function () {
        // setup
        before(function () {
            // AN (Netherlands Antilles) is copied from BQ (Bonaire, Sint Eustatius and Saba)
            // PN (Pitcairn Island) is copied from NZ (New Zealand)
            // XK (Kosov) is copied from MC (Monaco)
            var meta = loadPhoneMeta(['AN', 'PN', 'XK']);
            // note that CW (Curaçao) is also loaded because it's the main country for BQ's calling code (599)
            phoneUtil.useMeta(meta);
        });

        it('Should show AN, CW, PN, NZ, XK, and MC as supported regions', function () {
            assert.deepEqual(phoneUtil.getSupportedRegions().sort(), ['AN', 'CW', 'MC', 'NZ', 'PN', 'XK']);
            assert.deepEqual(phoneUtil.countryCodeToRegionCodeMap(), { '64': ['NZ', 'PN'], '377': ['MC', 'XK'], '599': ['CW', 'AN'] });
        });

        it('Should return BQ example phone number for AN', function () {
            assert.deepEqual(phoneUtil.getExampleNumberForType('AN', 'FIXED_LINE'), { countryCode: '599', nationalNumber: '7151234' });
        });

        it('Should return NZ example phone number for PN', function () {
            assert.deepEqual(phoneUtil.getExampleNumberForType('PN', 'MOBILE'), { countryCode: '64', nationalNumber: '211234567' });
        });

        it('Should return MC example phone number for XK', function () {
            assert.deepEqual(phoneUtil.getExampleNumberForType('XK', 'MOBILE'), { countryCode: '377', nationalNumber: '612345678' });
        });
    });

    describe('Test formatting/validation of US phone numbers', function () {

        // setup
        before(function () {
            var meta = loadPhoneMeta(['BS']); // loading Bahamas also loads US
            phoneUtil.useMeta(meta);
        });

        it('Should show BS and US as supported regions', function () {
            assert.deepEqual(phoneUtil.getSupportedRegions(), ['BS', 'US']);
            assert.deepEqual(phoneUtil.countryCodeToRegionCodeMap(), { '1': ['US', 'BS'] });
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
                assert.equal(phoneUtil.formatPhoneNumber(phone, options), optionObj.result);
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
                assert.equal(phoneUtil.validatePhoneNumber(phone, 'US'), true);
            });
        });

        it('Should parse US phone numbers', function () {
            var canonicalPhone = {
                countryCode: '1',
                nationalNumber: '9104678933'
            };

            var inputs = [
                '(910) 467-8933',
                '+1 910-467-8933',
                '+19104678933',
                'tel:+1-910-467-8933',
                '9104678933',
                '19104678933',
                '1-910   4678933'
            ];

            inputs.forEach(function (phone) {
                var response = phoneUtil.parsePhoneNumber(phone, 'US');
                assert.deepEqual(response, canonicalPhone);
            });
        });

        it('Should return errors with messages when parsing invalid US phone numbers', function () {

            var badNumbers = [
                {
                    phone: '5',
                    errorMessage: 'PHONE_NOT_A_NUMBER'
                },
                {
                    phone: '555555555555555555555',
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                },
                {
                    phone: 'aaa',
                    errorMessage: 'PHONE_NOT_A_NUMBER'
                },
                {
                    phone: '+44 0121',
                    errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
                }
            ];

            badNumbers.forEach(function (phoneObj) {
                var response = phoneUtil.parsePhoneNumber(phoneObj.phone, 'US');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phoneObj.errorMessage);
            });
        });

        it('Should not validate invalid US phone numbers', function () {
            // TODO add more
            var badNumbers = [
                {
                    numberObj: { countryCode: '1', nationalNumber: '5' },
                    errorMessage: 'PHONE_NUMBER_TOO_SHORT'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '5103981827' },
                    errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '01212345678' }, // GB number
                    errorMessage: 'PHONE_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '51052618767' }, // one extra digit
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = phoneUtil.validatePhoneNumber(phone.numberObj, 'US');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phone.errorMessage);
            });
        });

        it('Should format US number using AsYouTypeFormatter', function () {
            var formatter = phoneUtil.getAsYouTypeFormatter('US');

            assert.equal(formatter.inputDigit('9'), '9');
            assert.equal(formatter.inputDigit('1'), '91');
            assert.equal(formatter.inputDigit('9'), '919');
            assert.equal(formatter.inputDigit('2'), '919-2');
            assert.equal(formatter.inputDigit('8'), '919-28');
            assert.equal(formatter.inputDigit('2'), '919-282');
            assert.equal(formatter.inputDigit('3'), '919-2823');
            assert.equal(formatter.inputDigit('4'), '(919) 282-34');
            assert.equal(formatter.inputDigit('5'), '(919) 282-345');
            assert.equal(formatter.inputDigit('6'), '(919) 282-3456');

            // test overrun
            assert.equal(formatter.inputDigit('7'), '91928234567');

            // test that clear works
            formatter.clear();
            assert.equal(formatter.inputDigit('9'), '9');
        });

        it('Should throw errors if metadata not loaded for requested region', function () {
            assert.throws(() => phoneUtil.getAsYouTypeFormatter('TR'), /Metadata not loaded/);
            assert.throws(() => phoneUtil.getCountryCodeForRegion('TR'), /Metadata not loaded/);
            assert.throws(() => phoneUtil.validatePhoneNumber({}, 'TR'), /Metadata not loaded/);
        });
    });

    describe('Test formatting/validation of GB & RU phone numbers', function () {

        // setup
        before(function () {
            var meta = loadPhoneMeta(['KZ', 'AU', 'GG', 'GB']);
            phoneUtil.useMeta(meta);
        });

        it('Should show supported regions', function () {
            assert.deepEqual(phoneUtil.getSupportedRegions().sort(), ['AU', 'GB', 'GG', 'KZ', 'RU']);
            assert.deepEqual(phoneUtil.countryCodeToRegionCodeMap(), {
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
                assert.equal(phoneUtil.formatPhoneNumber(phone, options), optionObj.result);
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
                assert.equal(phoneUtil.formatPhoneNumber(phone, options), optionObj.result);
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
                assert.equal(phoneUtil.validatePhoneNumber(phone, 'GB'), true);
            });
        });

        it('Should format GB number using AsYouTypeFormatter', function () {
            var formatter = phoneUtil.getAsYouTypeFormatter('GB');
            formatter.clear();

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('1'), '01');
            assert.equal(formatter.inputDigit('2'), '012');
            assert.equal(formatter.inputDigit('1'), '0121');
            assert.equal(formatter.inputDigit('2'), '0121 2');
            assert.equal(formatter.inputDigit('3'), '0121 23');
            assert.equal(formatter.inputDigit('4'), '0121 234');
            assert.equal(formatter.inputDigit('5'), '0121 234 5');
            assert.equal(formatter.inputDigit('6'), '0121 234 56');
            assert.equal(formatter.inputDigit('7'), '01212 34567');
            assert.equal(formatter.inputDigit('8'), '0121 234 5678');

            // test overrun
            assert.equal(formatter.inputDigit('9'), '012123456789');

            // test that clear works
            formatter.clear();
            assert.equal(formatter.inputDigit('0'), '0');
        });

        it('Should not validate invalid GB phone numbers', function () {
            // TODO add more
            var badNumbers = [
                {
                    numberObj: { countryCode: '44', nationalNumber: '5' },
                    errorMessage: 'PHONE_NUMBER_TOO_SHORT'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '01212345678' },
                    errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '5105261987' },
                    errorMessage: 'PHONE_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '012123456789' }, // one extra digit
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = phoneUtil.validatePhoneNumber(phone.numberObj, 'GB');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phone.errorMessage);
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
