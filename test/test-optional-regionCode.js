/**
 * Test omission of regionCode from:
 *   - validatePhoneNumber (validates using region extracted from phone number)
 *   - parsePhoneNumber (works if phone string has + with country code)
 */

'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var loadMeta = require('../server').loadMeta;
var phoneClient = require('../client');
var phoneDataPositive = require('./input/phoneDataPositive');

describe('Optional regionCode tests (unit)', function () {
    describe('parsePhoneNumber tests', function () {
        it('Should allow omission of regionCode if phone string is international format', function () {
            var meta = loadMeta(['US']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.parsePhoneNumber('+1 510-526-1234');
            assert.deepEqual(result, { countryCode: '1', nationalNumber: '5105261234' });
        });

        it('Should IGNORE wrong regionCode if phone string is international format', function () {
            // load US & GB metadata and send US phone number for parsing
            // tell parse to fall back to GB, but it's ignored since country code was found in phone string
            var meta = loadMeta(['US', 'GB']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.parsePhoneNumber('+1 510-526-1234', 'GB');
            assert.deepEqual(result, { countryCode: '1', nationalNumber: '5105261234' });
        });

        it('Should return PHONE_INVALID_COUNTRY_CODE if phone string is not international format', function () {
            var meta = loadMeta(['US']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.parsePhoneNumber('1 510-526-1234'); // missing +
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_COUNTRY_CODE')
        });

        it('Should return PHONE_INVALID_COUNTRY_CODE if phone string is valid international format but metadata is not loaded for the country code', function () {
            var meta = loadMeta(['US']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.parsePhoneNumber('+44 121 234 5678'); // valid GB international format, but only US metadata loaded
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_COUNTRY_CODE')
        });
    });

    describe('validatePhoneNumber tests', function () {
        it('Should allow omission of regionCode if metadata is loaded', function () {
            var meta = loadMeta(['US', 'GB']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' });
            assert(result === true);

            result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5105261234' });
            assert(result === true);
        });

        it('Should invalidate number if wrong regionCode is provided', function () {
            var meta = loadMeta(['US', 'GB']);
            var handler = phoneClient.createPhoneHandler(meta);

            // valid GB number, but passing regionCode as US
            var result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION')

            // valid US number, but passing regionCode as GB
            result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5105261234' }, 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION')
        });

        it('Should return PHONE_INVALID_COUNTRY_CODE if phone is valid and regionCode is omitted but metadata is not loaded for the country code', function () {
            var meta = loadMeta(['US']);
            var handler = phoneClient.createPhoneHandler(meta);

            var result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '1212345678' });
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_COUNTRY_CODE')
        });
    });
});

// loop over items in phoneDataPositive.json and call validate and parse without regionCode param
// parse works for all formats except national
describe('Optional regionCode tests (data-driven)', function () {
    Object.keys(phoneDataPositive).forEach(function (regionCode) {
        describe('Region: ' + regionCode, function () {
            var meta = loadMeta(); // load metadata for all regions
            var handler = phoneClient.createPhoneHandler(meta);

            phoneDataPositive[regionCode].forEach(function (phoneItemExpected, index) {
                describe('Item: ' + index, function () {
                    var phoneObj = phoneItemExpected.phoneObj;

                    it('Should validate phone number without regionCode param', function () {
                        var validationResult = handler.validatePhoneNumber(phoneObj);
                        assert.deepEqual(validationResult, phoneItemExpected.validationResult);
                    });

                    it('Should parse international format string without regionCode param', function () {
                        var parsedPhoneObj = handler.parsePhoneNumber(phoneItemExpected.formatted.international);
                        assert.deepEqual(parsedPhoneObj, phoneObj);
                    });

                    it('Should parse e164 format string without regionCode param', function () {
                        var parsedPhoneObj = handler.parsePhoneNumber(phoneItemExpected.formatted.e164);
                        var expectedPhoneObj = JSON.parse(JSON.stringify(phoneObj));
                        delete expectedPhoneObj.extension; // no extension in e164 format, so don't compare it in phoneObj
                        assert.deepEqual(parsedPhoneObj, expectedPhoneObj);
                    });

                    it('Should parse rfc3966 format string without regionCode param', function () {
                        var parsedPhoneObj = handler.parsePhoneNumber(phoneItemExpected.formatted.rfc3966);
                        assert.deepEqual(parsedPhoneObj, phoneObj);
                    });

                });
            }); // end loop over items for given regionCode
        });
    }); // end loop over regionCodes
});
