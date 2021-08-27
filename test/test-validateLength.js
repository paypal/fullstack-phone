'use strict';

const { assert, expect } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('validateLength Tests', function () {

    it('Should minimally validate US phone number lengths', function () {
        const meta = loadMeta(['US', 'AD']);
        const handler = phoneClient.createPhoneHandler(meta);

        const numbers = [
            {
                countryCode: '1',
                nationalNumber: '1234567890' // 10 digits
            },
            {
                countryCode: '1',
                nationalNumber: '5555555555' // 10 digits
            }
        ];

        numbers.forEach(phone => assert.equal(handler.validateLength(phone, 'US'), true));

        // should return the same results without regionCode (since US metadata is loaded)
        numbers.forEach(phone => assert.equal(handler.validateLength(phone), true));
    });

    it('Should invalidate US phone numbers of wrong length', function () {
        const meta = loadMeta(['US', 'AD']);
        const handler = phoneClient.createPhoneHandler(meta);

        const badNumbers = [
            {
                numberObj: { countryCode: '1', nationalNumber: '1' },
                errorMessage: 'PHONE_NUMBER_TOO_SHORT'
            },
            {
                // 44 is valid for GB, but it will not be recognized if:
                // - we're calling validateLength with regionCode 'US' or
                // - we haven't loaded GB metadata
                numberObj: { countryCode: '44', nationalNumber: '1234567890' },
                errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
            },
            {
                numberObj: { countryCode: '999999', nationalNumber: '1234567890' },
                errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
            },
            {
                numberObj: { countryCode: '1', nationalNumber: '12345678901' }, // 11 digits
                errorMessage: 'PHONE_NUMBER_TOO_LONG'
            },
            {
                numberObj: { countryCode: '1', nationalNumber: '1234567' }, // 7 digits (local only)
                errorMessage: 'PHONE_NUMBER_POSSIBLE_LOCAL_ONLY'
            }
        ];

        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj, 'US');
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should be invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
        });

        // should return the same results without regionCode (since US metadata is loaded)
        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj);
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should be invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
        });
    });

    // Andorra (AD) numbers are 6, 8, or 9 digits
    it('Should minimally validate AD phone number lengths', function () {
        const meta = loadMeta(['US', 'AD']);
        const handler = phoneClient.createPhoneHandler(meta);

        const numbers = [
            {
                countryCode: '376',
                nationalNumber: '555555' // 6 digits
            },
            {
                countryCode: '376',
                nationalNumber: '55555555' // 8 digits
            },
            {
                countryCode: '376',
                nationalNumber: '555555555' // 9 digits
            }
        ];

        numbers.forEach(phone => assert.equal(handler.validateLength(phone, 'AD'), true));

        // should return the same results without regionCode (since AD metadata is loaded)
        numbers.forEach(phone => assert.equal(handler.validateLength(phone), true));
    });

    // Andorra (AD) numbers are 6, 8, or 9 digits
    it('Should invalidate AD phone numbers of wrong length', function () {
        const meta = loadMeta(['US', 'AD']);
        const handler = phoneClient.createPhoneHandler(meta);

        const badNumbers = [
            {
                numberObj: { countryCode: '999', nationalNumber: '123456' },
                errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
            },
            {
                numberObj: { countryCode: '376', nationalNumber: '1' }, // 1 digit
                errorMessage: 'PHONE_NUMBER_TOO_SHORT'
            },
            {
                numberObj: { countryCode: '376', nationalNumber: '12345' }, // 5 digits
                errorMessage: 'PHONE_NUMBER_TOO_SHORT'
            },
            {
                numberObj: { countryCode: '376', nationalNumber: '1234567' }, // 7 digits
                errorMessage: 'PHONE_NUMBER_INVALID_LENGTH'
            },
            {
                numberObj: { countryCode: '376', nationalNumber: '1234567890' }, // 10 digits
                errorMessage: 'PHONE_NUMBER_TOO_LONG'
            }
        ];

        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj, 'AD');
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should in invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
        });

        // should return the same results without regionCode (since AD metadata is loaded)
        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj);
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should in invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
        });
    });

    it('Should invalidate phone numbers when called with wrong regionCode', function () {
        // should expect PHONE_INVALID_COUNTRY_CODE if validateLength is called with the wrong regionCode
        // even if the phone is the correct length

        const meta = loadMeta(); // load ALL metadata
        const handler = phoneClient.createPhoneHandler(meta);

        const badNumbers = [
            {
                numberObj: { countryCode: '44', nationalNumber: '1212345678' }, // valid GB number
                wrongRegion: 'US'
            },
            {
                numberObj: { countryCode: '1', nationalNumber: '5105261568' }, // valid US number
                wrongRegion: 'GB'
            },
            {
                numberObj: { countryCode: '999999', nationalNumber: '5105261568' }, // non-existent countryCode
                wrongRegion: 'US'
            },
            {
                numberObj: { countryCode: '376', nationalNumber: '712345' }, // valid AD number
                wrongRegion: 'GB'
            }
        ];

        badNumbers.forEach(function ({ numberObj, wrongRegion }) {
            const result = handler.validateLength(numberObj, wrongRegion);
            expect(result instanceof Error, `${JSON.stringify(numberObj)} should be invalidated when called with regionCode ${wrongRegion}`).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });
    });

    it('Should invalidate phone numbers when metadata is not loaded', function () {
        // should expect PHONE_INVALID_COUNTRY_CODE if validateLength is called without regionCode
        // if metadata is not loaded for that region
        // even if the phone is the correct length

        const meta = loadMeta(['RU']); // load metadata for Russia
        const handler = phoneClient.createPhoneHandler(meta);

        const unSupportedNumbers = [
            { countryCode: '44', nationalNumber: '1212345678' }, // valid GB number
            { countryCode: '1', nationalNumber: '5105261568' }, // valid US number
            { countryCode: '376', nationalNumber: '712345' } // valid AD number
        ];

        unSupportedNumbers.forEach(function (numberObj) {
            const result = handler.validateLength(numberObj);
            expect(result instanceof Error, `${JSON.stringify(numberObj)} should be invalidated when metadata not loaded`).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });
    });

    // test a region that depends on a main country
    // in this case PR shares countryCode, lengths, and formatting with the US
    it('Should invalidate PR phone numbers of wrong length', function () {
        const meta = loadMeta(['PR']);
        const handler = phoneClient.createPhoneHandler(meta);

        const badNumbers = [
            {
                numberObj: { countryCode: '1', nationalNumber: '1' },
                errorMessage: 'PHONE_NUMBER_TOO_SHORT'
            },
            {
                // 44 is valid for GB, but it will not be recognized if:
                // - we're calling validateLength with regionCode 'PR' or
                // - we haven't loaded GB metadata
                numberObj: { countryCode: '44', nationalNumber: '1234567890' },
                errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
            },
            {
                numberObj: { countryCode: '999999', nationalNumber: '1234567890' },
                errorMessage: 'PHONE_INVALID_COUNTRY_CODE'
            },
            {
                numberObj: { countryCode: '1', nationalNumber: '12345678901' }, // 11 digits
                errorMessage: 'PHONE_NUMBER_TOO_LONG'
            },
            {
                numberObj: { countryCode: '1', nationalNumber: '1234567' }, // 7 digits (local only)
                errorMessage: 'PHONE_NUMBER_POSSIBLE_LOCAL_ONLY'
            }
        ];

        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj, 'PR');
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should be invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
        });

        // should return the same results without regionCode (since PR metadata is loaded)
        badNumbers.forEach(function (phone) {
            const result = handler.validateLength(phone.numberObj);
            expect(result instanceof Error, `${JSON.stringify(phone.numberObj)} should be invalidated`).to.be.true;
            expect(result.message).to.equal(phone.errorMessage);
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
