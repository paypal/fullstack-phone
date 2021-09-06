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
            function () { } // not a plain object
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
            function () { } // not a plain object
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

    it('Should throw error for invalid phoneObj', function () {

        var meta = loadMeta(['US']);
        var handler = phoneClient.createPhoneHandler(meta);

        var badPhoneObjects = [
            null,
            undefined,
            1,
            'a',
            new Function(),
            [],
            {},
            true,
            {
                countryCode: true
            },
            {
                countryCode: 1,
                nationalNumber: true
            },
            {
                countryCode: 1,
                nationalNumber: 2,
                extension: [] // extension is optional but it should be a number or string
            }
        ];

        badPhoneObjects.forEach(function (phoneObj) {
            const regex = /Phone object conversion failed/;
            assert.throws(() => handler.formatPhoneNumber(phoneObj, { style: 'national' }), regex);
            assert.throws(() => handler.validatePhoneNumber(phoneObj, 'US'), regex);
            assert.throws(() => handler.validateLength(phoneObj, 'US'), regex);
            assert.throws(() => handler.inferPhoneNumberRegion(phoneObj, 'US'), regex);
            assert.throws(() => handler.inferPhoneNumberType(phoneObj, 'US'), regex);
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

        it('Should throw errors if metadata not loaded for requested region', function () {
            const regex = /Metadata not loaded/;
            assert.throws(() => handler.getAsYouTypeFormatter('TR'), regex);
            assert.throws(() => handler.getCountryCodeForRegion('TR'), regex);
            assert.throws(() => handler.validatePhoneNumber({ countryCode: 1, nationalNumber: 2 }, 'TR'), regex);
        });

        it('Should infer US region from phone numbers', function () {
            var numbers = [
                {
                    countryCode: "1",
                    nationalNumber: "2012735041"
                },
                {
                    countryCode: "1",
                    nationalNumber: "2015550123"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberRegion(num);
                assert.equal(response, "US");
            });
        });

        it('Should infer null region if metadata not loaded or phone is invalid', function () {
            var numbers = [
                {
                    // GB phone
                    countryCode: "44",
                    nationalNumber: "1212345678"
                },
                {
                    // invalid phone
                    countryCode: "999999",
                    nationalNumber: "999999"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberRegion(num);
                assert.equal(response, null);
            });
        });

        it('Should infer type of US phone numbers', function () {
            var numbers = [
                {
                    phoneObj: {
                        countryCode: "1",
                        nationalNumber: "2015550123"
                    },
                    type: "FIXED_LINE_OR_MOBILE"
                },
                {
                    phoneObj: {
                        countryCode: "1",
                        nationalNumber: "2015550123"
                    },
                    type: "FIXED_LINE_OR_MOBILE"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberType(num.phoneObj);
                assert.equal(response, num.type);
            });
        });

        it('Should infer UNKNOWN type if metadata not loaded or phone is invalid', function () {
            var numbers = [
                {
                    // GB phone
                    countryCode: "44",
                    nationalNumber: "1212345678"
                },
                {
                    // invalid phone
                    countryCode: "999999",
                    nationalNumber: "999999"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberType(num);
                assert.equal(response, "UNKNOWN");
            });
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

        it('Should infer GB region from phone numbers', function () {
            var numbers = [
                {
                    countryCode: "44",
                    nationalNumber: "1212345678"
                },
                {
                    countryCode: "44",
                    nationalNumber: "7400123456"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberRegion(num);
                assert.equal(response, "GB");
            });
        });

        it('Should infer type of GB phone numbers', function () {
            var numbers = [
                {
                    phoneObj: {
                        countryCode: "44",
                        nationalNumber: "1212345678"
                    },
                    type: "FIXED_LINE"
                },
                {
                    phoneObj: {
                        countryCode: "44",
                        nationalNumber: "7400123456"
                    },
                    type: "MOBILE"
                }
            ];

            numbers.forEach(function (num) {
                var response = handler.inferPhoneNumberType(num.phoneObj);
                assert.equal(response, num.type);
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
