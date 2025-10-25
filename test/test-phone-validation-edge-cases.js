/* Edge case tests for validating international phone numbers with invalid formats, length issues, and cross-region mismatches */

'use strict';

const { assert } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('Phone Validation Edge Cases (International Formats)', function () {

    describe('US Validation Edge Cases', function () {
        const meta = loadMeta(['US']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should validate valid US number at minimum length', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5105261568' }, 'US');
            assert.equal(result, true);
        });

        it('Should reject US number that looks valid but is not', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '0000000000' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });

        it('Should reject US number with 555 area code (reserved)', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '5555261568' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });

        it('Should reject US number starting with 1', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '1005261568' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });

        it('Should reject US number that is too short', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '510526156' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject US number that is too long', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '51052615681' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_LONG');
        });

        it('Should reject US number with 911 prefix', function () {
            const result = handler.validatePhoneNumber({ countryCode: '1', nationalNumber: '9115261568' }, 'US');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });
    });

    describe('GB Validation Edge Cases', function () {
        const meta = loadMeta(['GB']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should validate valid UK mobile number', function () {
            const result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '7700900123' }, 'GB');
            assert.equal(result, true);
        });

        it('Should reject UK number with invalid area code', function () {
            const result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '9990900123' }, 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });

        it('Should reject UK number too short', function () {
            const result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '207123456' }, 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });

        it('Should reject UK number too long', function () {
            const result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '20712345678' }, 'GB');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_LONG');
        });

        it('Should validate UK premium rate number', function () {
            const result = handler.validatePhoneNumber({ countryCode: '44', nationalNumber: '8456012345' }, 'GB');
            assert.equal(result, true);
        });
    });

    describe('DE Validation Edge Cases', function () {
        const meta = loadMeta(['DE']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should validate valid German mobile', function () {
            const result = handler.validatePhoneNumber({ countryCode: '49', nationalNumber: '1701234567' }, 'DE');
            assert.equal(result, true);
        });

        it('Should reject German number with invalid prefix', function () {
            const result = handler.validatePhoneNumber({ countryCode: '49', nationalNumber: '0001234567' }, 'DE');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });

        it('Should reject German number too short', function () {
            const result = handler.validatePhoneNumber({ countryCode: '49', nationalNumber: '301234567' }, 'DE');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });
    });

    describe('IN Validation Edge Cases', function () {
        const meta = loadMeta(['IN']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should validate valid Indian mobile', function () {
            const result = handler.validatePhoneNumber({ countryCode: '91', nationalNumber: '9876543210' }, 'IN');
            assert.equal(result, true);
        });

        it('Should reject Indian number with invalid format', function () {
            const result = handler.validatePhoneNumber({ countryCode: '91', nationalNumber: '123456789' }, 'IN');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_INVALID_FOR_REGION');
        });
    });

    describe('BR Validation Edge Cases', function () {
        const meta = loadMeta(['BR']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should validate valid Brazilian mobile', function () {
            const result = handler.validatePhoneNumber({ countryCode: '55', nationalNumber: '11999999999' }, 'BR');
            assert.equal(result, true);
        });

        it('Should reject Brazilian number too short', function () {
            const result = handler.validatePhoneNumber({ countryCode: '55', nationalNumber: '119999999' }, 'BR');
            assert(result instanceof Error);
            assert.equal(result.message, 'PHONE_NUMBER_TOO_SHORT');
        });
    });
});
