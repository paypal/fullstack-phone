/* Edge case tests for parsing international phone number formats with various separators, extensions, and malformed inputs */

'use strict';

const { assert } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('Phone Parsing Edge Cases (International Formats)', function () {

    describe('US Parsing Edge Cases', function () {
        const meta = loadMeta(['US']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should parse phone number with various separators and spaces', function () {
            const result = handler.parsePhoneNumber('+1 (510) 526-1568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should parse phone number with dots as separators', function () {
            const result = handler.parsePhoneNumber('+1.510.526.1568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should parse phone number with mixed separators', function () {
            const result = handler.parsePhoneNumber('+1-510.526.1568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should parse phone number with multiple spaces', function () {
            const result = handler.parsePhoneNumber('+1  510  526  1568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should parse phone number starting with country code without +', function () {
            const result = handler.parsePhoneNumber('15105261568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should parse phone number with extension', function () {
            const result = handler.parsePhoneNumber('+1 510 526 1568 ext. 123', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
            assert.equal(result.extension, '123');
        });

        it('Should parse phone number with x extension notation', function () {
            const result = handler.parsePhoneNumber('+1 510 526 1568 x123', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
            assert.equal(result.extension, '123');
        });

        it('Should parse phone number with # for extension', function () {
            const result = handler.parsePhoneNumber('+1 510 526 1568 #123', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
            assert.equal(result.extension, '123');
        });

        it('Should parse international format with dashes', function () {
            const result = handler.parsePhoneNumber('1-510-526-1568', 'US');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '1');
            assert.equal(result.nationalNumber, '5105261568');
        });

        it('Should reject phone number with parentheses but missing area code digit', function () {
            const result = handler.parsePhoneNumber('+1 (510) 526-156', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject phone number with too many digits', function () {
            const result = handler.parsePhoneNumber('+1 510 526 156 812 345', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_LONG');
        });

        it('Should reject phone number with letters mixed in', function () {
            const result = handler.parsePhoneNumber('+1 510-ABC-1568', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NOT_A_NUMBER');
        });

        it('Should reject empty string after country code', function () {
            const result = handler.parsePhoneNumber('+1 ', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NOT_A_NUMBER');
        });

        it('Should reject only country code', function () {
            const result = handler.parsePhoneNumber('+1', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject phone number with special characters', function () {
            const result = handler.parsePhoneNumber('+1-510-526-15@8', 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NOT_A_NUMBER');
        });
    });

    describe('GB Parsing Edge Cases', function () {
        const meta = loadMeta(['GB']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should parse UK mobile number with spaces', function () {
            const result = handler.parsePhoneNumber('+44 7700 900123', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '7700900123');
        });

        it('Should parse UK landline with parentheses', function () {
            const result = handler.parsePhoneNumber('+44 (20) 7123 4567', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '2071234567');
        });

        it('Should parse UK number starting with 0', function () {
            const result = handler.parsePhoneNumber('020 7123 4567', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '2071234567');
        });

        it('Should parse UK mobile starting with 07', function () {
            const result = handler.parsePhoneNumber('07700 900123', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '7700900123');
        });

        it('Should parse UK number with dashes', function () {
            const result = handler.parsePhoneNumber('020-7123-4567', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '2071234567');
        });

        it('Should parse UK number with dots', function () {
            const result = handler.parsePhoneNumber('020.7123.4567', 'GB');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '44');
            assert.equal(result.nationalNumber, '2071234567');
        });

        it('Should reject international format without +', function () {
            const result = handler.parsePhoneNumber('44 7700 900123', 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_COUNTRY_CODE');
        });

        it('Should reject UK number too short', function () {
            const result = handler.parsePhoneNumber('+44 7700 9001', 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject UK number too long', function () {
            const result = handler.parsePhoneNumber('+44 7700 90012345', 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_LONG');
        });
    });

    describe('DE Parsing Edge Cases', function () {
        const meta = loadMeta(['DE']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should parse German mobile with spaces', function () {
            const result = handler.parsePhoneNumber('+49 170 1234567', 'DE');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '49');
            assert.equal(result.nationalNumber, '1701234567');
        });

        it('Should parse German landline with area code', function () {
            const result = handler.parsePhoneNumber('+49 30 12345678', 'DE');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '49');
            assert.equal(result.nationalNumber, '3012345678');
        });

        it('Should parse German number starting with 0', function () {
            const result = handler.parsePhoneNumber('030 12345678', 'DE');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '49');
            assert.equal(result.nationalNumber, '3012345678');
        });

        it('Should parse German number with double zeros', function () {
            const result = handler.parsePhoneNumber('0049 30 12345678', 'DE');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '49');
            assert.equal(result.nationalNumber, '3012345678');
        });

        it('Should parse German number with slashes', function () {
            const result = handler.parsePhoneNumber('+49 30/12345678', 'DE');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '49');
            assert.equal(result.nationalNumber, '3012345678');
        });

        it('Should reject German number too short', function () {
            const result = handler.parsePhoneNumber('+49 30 123456', 'DE');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject invalid German number with letters', function () {
            const result = handler.parsePhoneNumber('+49 30 12A45678', 'DE');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NOT_A_NUMBER');
        });
    });

    describe('IN Parsing Edge Cases', function () {
        const meta = loadMeta(['IN']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should parse Indian mobile number', function () {
            const result = handler.parsePhoneNumber('+91 98765 43210', 'IN');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '91');
            assert.equal(result.nationalNumber, '9876543210');
        });

        it('Should parse Indian landline with STD code', function () {
            const result = handler.parsePhoneNumber('+91 11 1234 5678', 'IN');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '91');
            assert.equal(result.nationalNumber, '1112345678');
        });

        it('Should parse Indian number starting with 0', function () {
            const result = handler.parsePhoneNumber('011 1234 5678', 'IN');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '91');
            assert.equal(result.nationalNumber, '1112345678');
        });

        it('Should parse Indian mobile starting with 0', function () {
            const result = handler.parsePhoneNumber('098765 43210', 'IN');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '91');
            assert.equal(result.nationalNumber, '9876543210');
        });

        it('Should reject Indian number with dashes', function () {
            const result = handler.parsePhoneNumber('91-11-1234-5678', 'IN');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_COUNTRY_CODE');
        });

        it('Should reject Indian number too long', function () {
            const result = handler.parsePhoneNumber('+91 98765 432 100', 'IN');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_LONG');
        });
    });

    describe('BR Parsing Edge Cases', function () {
        const meta = loadMeta(['BR']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should parse Brazilian mobile with parentheses', function () {
            const result = handler.parsePhoneNumber('+55 (11) 99999-9999', 'BR');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '55');
            assert.equal(result.nationalNumber, '11999999999');
        });

        it('Should parse Brazilian number with spaces', function () {
            const result = handler.parsePhoneNumber('+55 11 99999 9999', 'BR');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '55');
            assert.equal(result.nationalNumber, '11999999999');
        });

        it('Should parse Brazilian number starting with 0', function () {
            const result = handler.parsePhoneNumber('011 99999 9999', 'BR');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '55');
            assert.equal(result.nationalNumber, '11999999999');
        });

        it('Should parse Brazilian number with dots', function () {
            const result = handler.parsePhoneNumber('+55.11.99999.9999', 'BR');
            assert(result && typeof result === 'object');
            assert.equal(result.countryCode, '55');
            assert.equal(result.nationalNumber, '11999999999');
        });

        it('Should reject Brazilian number too short', function () {
            const result = handler.parsePhoneNumber('+55 11 99999', 'BR');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });
    });
});
