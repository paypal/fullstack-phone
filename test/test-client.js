'use strict';

var assert = require('assert');
var loadMeta = require('../server').loadMeta;
var phoneClient = require('../client');

describe('Test libphonenumberUtil exceptions', function () {

    it('Should throw error for invalid metadata', function () {
        var badMeta = [
            undefined,
            null,
            '',
            'string',
            0,
            1,
            false,
            true,
            new Date(),
            [],
            {},
            {
                regionCodes: ['US'],
                countryCodeToRegionCodeMap: {}
                // missing countryToMetadata
            },
            {
                regionCodes: ['US'],
                // missing countryCodeToRegionCodeMap
                countryToMetadata: {}
            },
            {
                // missing regionCodes
                countryCodeToRegionCodeMap: {},
                countryToMetadata: {}
            },
            {
                regionCodes: [], // empty regionCodes array
                countryCodeToRegionCodeMap: {},
                countryToMetadata: {}
            }
        ];

        badMeta.forEach(meta => {
            assert.throws(() => phoneClient.createPhoneHandler(meta), /Invalid metadata/);
        });
    });

    it('Should throw exception for invalid regionCodes property in metadata', function () {
        // should be non-empty array
        var badRegionCodeArrays = [
            undefined,
            null,
            0,
            1,
            false,
            true,
            '',
            'string',
            new Date(),
            {},
            [] // empty array
        ];

        badRegionCodeArrays.forEach(x => {
            var meta = {
                regionCodes: x,
                countryCodeToRegionCodeMap: {},
                countryToMetadata: {}
            };
            assert.throws(() => phoneClient.createPhoneHandler(meta));
        });
    });

    it('Should throw exception for invalid countryCodeToRegionCodeMap property in metadata', function () {
        // should be plain object
        var badCountryCodeToRegionCodeMaps = [
            undefined,
            null,
            0,
            1,
            false,
            true,
            '',
            'string',
            new Date(),
            [],
            new function () {} // not a plain object
        ];

        badCountryCodeToRegionCodeMaps.forEach(x => {
            var meta = {
                regionCodes: ['US'],
                countryCodeToRegionCodeMap: x,
                countryToMetadata: {}
            };
            assert.throws(() => phoneClient.createPhoneHandler(meta));
        });
    });

    it('Should throw exception for invalid countryToMetadata property in metadata', function () {
        // should be plain object
        var badCountryToMetadatas = [
            undefined,
            null,
            0,
            1,
            false,
            true,
            '',
            'string',
            new Date(),
            [],
            new function () {} // not a plain object
        ];

        badCountryToMetadatas.forEach(x => {
            var meta = {
                regionCodes: ['US'],
                countryCodeToRegionCodeMap: {},
                countryToMetadata: x
            };
            assert.throws(() => phoneClient.createPhoneHandler(meta));
        });
    });

    it('Should not throw exception for well-formed metadata', function () {
        var meta = {
            regionCodes: [1], // needs at least one member
            countryCodeToRegionCodeMap: {},
            countryToMetadata: {}
        };

        assert.doesNotThrow(() => phoneClient.createPhoneHandler(meta), Error, 'Should not have thrown for well-formed metadata');
    });

    it('Should throw error for unsupported region', function () {

        var meta = loadMeta(['US']);
        var handler = phoneClient.createPhoneHandler(meta);

        assert.throws(() => handler.getExampleNumberForType('MOBILE', 'GB'), /Metadata not loaded for region/);

    });

    it('Should throw error for invalid style object', function () {

        var meta = loadMeta(['US']);
        var handler = phoneClient.createPhoneHandler(meta);

        var phoneObj = {
            countryCode: '1',
            nationalNumber: '5105261234'
        };

        var badStyleOptions = ['', 0, 1, {}, [], true, null, undefined, { style: 'INVALID' }, function () { }];

        badStyleOptions.forEach(function (options) {
            assert.throws(() => handler.formatPhoneNumber(phoneObj, options), /Invalid style/);
        });
    });

    it('Should throw error for phoneObj that fails conversion to proto format', function () {

        var meta = loadMeta(['US']);
        var handler = phoneClient.createPhoneHandler(meta);

        var badPhoneObjects = [null, undefined];

        badPhoneObjects.forEach(function (phoneObj) {
            assert.throws(() => handler.formatPhoneNumber(phoneObj, { style: 'national' }), /Phone object conversion failed/);
            assert.throws(() => handler.validatePhoneNumber(phoneObj, 'US'), /Phone object conversion failed/);
        });

    });
});

describe('Phone adapter functionality tests', function () {
    describe('Test mapping from legacy/new regions to libphonenumber-supported regions', function () {
        var handler;
        // setup
        before(function () {
            // AN (Netherlands Antilles) is copied from BQ (Bonaire, Sint Eustatius and Saba)
            // PN (Pitcairn Island) is copied from NZ (New Zealand)
            var meta = loadMeta(['AN', 'PN']);
            // note that CW (Curaçao) is also loaded because it's the main country for BQ's calling code (599)
            handler = phoneClient.createPhoneHandler(meta);
        });

        it('Should show AN, CW, PN, and NZ as supported regions', function () {
            assert.deepEqual(handler.getSupportedRegions().sort(), ['AN', 'CW', 'NZ', 'PN']);
            assert.deepEqual(handler.countryCodeToRegionCodeMap(), { '64': ['NZ', 'PN'], '599': ['CW', 'AN'] });
        });

        it('Should return BQ example phone number for AN', function () {
            assert.deepEqual(handler.getExampleNumberForType('FIXED_LINE', 'AN'), { countryCode: '599', nationalNumber: '7151234' });
        });

        it('Should return NZ example phone number for PN', function () {
            assert.deepEqual(handler.getExampleNumberForType('MOBILE', 'PN'), { countryCode: '64', nationalNumber: '211234567' });
        });
    });

    describe('Test formatting/validation of US phone numbers', function () {
        var handler;

        // setup
        before(function () {
            var meta = loadMeta(['BS']); // loading Bahamas also loads US
            handler = phoneClient.createPhoneHandler(meta);
        });

        it('Should show BS and US as supported regions', function () {
            assert.deepEqual(handler.getSupportedRegions(), ['BS', 'US']);
            assert.deepEqual(handler.countryCodeToRegionCodeMap(), { '1': ['US', 'BS'] });
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
                assert.equal(handler.formatPhoneNumber(phone, options), optionObj.result);
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
                assert.equal(handler.validatePhoneNumber(phone, 'US'), true);
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
                var response = handler.parsePhoneNumber(phone, 'US');
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
                var response = handler.parsePhoneNumber(phoneObj.phone, 'US');
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
                    numberObj: { countryCode: '1', nationalNumber: '1212345678' }, // GB number
                    errorMessage: 'PHONE_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '1', nationalNumber: '51052618767' }, // one extra digit
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = handler.validatePhoneNumber(phone.numberObj, 'US');
                assert.ok(response instanceof Error);
                assert.equal(response.message, phone.errorMessage);
            });
        });

        it('Should format US number using AsYouTypeFormatter', function () {
            var formatter = handler.getAsYouTypeFormatter('US');

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
            assert.throws(() => handler.getAsYouTypeFormatter('TR'), /Metadata not loaded/);
            assert.throws(() => handler.getCountryCodeForRegion('TR'), /Metadata not loaded/);
            assert.throws(() => handler.validatePhoneNumber({}, 'TR'), /Metadata not loaded/);
        });
    });

    describe('Test formatting/validation of GB & RU phone numbers', function () {
        var handler;

        // setup
        before(function () {
            var meta = loadMeta(['KZ', 'AU', 'GG', 'GB']);
            handler = phoneClient.createPhoneHandler(meta);
        });

        it('Should show supported regions', function () {
            assert.deepEqual(handler.getSupportedRegions().sort(), ['AU', 'GB', 'GG', 'KZ', 'RU']);
            assert.deepEqual(handler.countryCodeToRegionCodeMap(), {
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
                assert.equal(handler.formatPhoneNumber(phone, options), optionObj.result);
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
                assert.equal(handler.formatPhoneNumber(phone, options), optionObj.result);
            });
        });

        it('Should validate GB phone numbers', function () {
            var numbers = [
                {
                    countryCode: '44',
                    nationalNumber: '1212345678' // fixed line
                },
                {
                    countryCode: '44',
                    nationalNumber: '7400123456' // mobile
                }
            ];

            numbers.forEach(function (phone) {
                assert.equal(handler.validatePhoneNumber(phone, 'GB'), true);
            });
        });

        it('Should format GB number using AsYouTypeFormatter', function () {
            var formatter = handler.getAsYouTypeFormatter('GB');
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
                    numberObj: { countryCode: '1', nationalNumber: '1212345678' },
                    errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '01212345678' }, // leading 0 not allowed in nationalNumber property unless it's an Italian leading zero
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '5105261987' },
                    errorMessage: 'PHONE_INVALID_FOR_REGION'
                },
                {
                    numberObj: { countryCode: '44', nationalNumber: '12123456789' }, // one extra digit
                    errorMessage: 'PHONE_NUMBER_TOO_LONG'
                }
            ];

            badNumbers.forEach(function (phone) {
                var response = handler.validatePhoneNumber(phone.numberObj, 'GB');
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
