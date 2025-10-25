/* Edge case tests for formatting international phone numbers across different styles (national, international, E164, RFC3966) */

'use strict';

const { assert } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('Phone Formatting Edge Cases (International Formats)', function () {

    describe('US Formatting Edge Cases', function () {
        const meta = loadMeta(['US']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format US number with various formatting styles', function () {
            const phoneObj = {
                countryCode: '1',
                nationalNumber: '5105261568'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });
            const e164 = handler.formatPhoneNumber(phoneObj, { style: 'e164' });
            const rfc3966 = handler.formatPhoneNumber(phoneObj, { style: 'rfc3966' });

            assert.equal(national, '(510) 526-1568');
            assert.equal(international, '+1 510-526-1568');
            assert.equal(e164, '+15105261568');
            assert.equal(rfc3966, 'tel:+1-510-526-1568');
        });

        it('Should format US toll-free number', function () {
            const phoneObj = {
                countryCode: '1',
                nationalNumber: '8005261568'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '1-800-526-1568');
            assert.equal(international, '+1 800-526-1568');
        });

        it('Should format US number with extension', function () {
            const phoneObj = {
                countryCode: '1',
                nationalNumber: '5105261568',
                extension: '123'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });
            const rfc3966 = handler.formatPhoneNumber(phoneObj, { style: 'rfc3966' });

            assert.equal(national, '(510) 526-1568 ext. 123');
            assert.equal(international, '+1 510-526-1568 ext. 123');
            assert.equal(rfc3966, 'tel:+1-510-526-1568;ext=123');
        });
    });

    describe('GB Formatting Edge Cases', function () {
        const meta = loadMeta(['GB']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format UK mobile number formatting', function () {
            const phoneObj = {
                countryCode: '44',
                nationalNumber: '7700900123'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '07700 900123');
            assert.equal(international, '+44 7700 900123');
        });

        it('Should format UK landline formatting', function () {
            const phoneObj = {
                countryCode: '44',
                nationalNumber: '2071234567'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '020 7123 4567');
            assert.equal(international, '+44 20 7123 4567');
        });

        it('Should format UK premium rate number', function () {
            const phoneObj = {
                countryCode: '44',
                nationalNumber: '8456012345'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '0845 601 2345');
            assert.equal(international, '+44 845 601 2345');
        });
    });

    describe('DE Formatting Edge Cases', function () {
        const meta = loadMeta(['DE']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format German mobile formatting', function () {
            const phoneObj = {
                countryCode: '49',
                nationalNumber: '1701234567'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '0170 1234567');
            assert.equal(international, '+49 170 1234567');
        });

        it('Should format German landline formatting', function () {
            const phoneObj = {
                countryCode: '49',
                nationalNumber: '3012345678'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '030 12345678');
            assert.equal(international, '+49 30 12345678');
        });
    });

    describe('IN Formatting Edge Cases', function () {
        const meta = loadMeta(['IN']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format Indian mobile formatting', function () {
            const phoneObj = {
                countryCode: '91',
                nationalNumber: '9876543210'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '098765 43210');
            assert.equal(international, '+91 98765 43210');
        });

        it('Should format Indian landline formatting', function () {
            const phoneObj = {
                countryCode: '91',
                nationalNumber: '1112345678'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '011 1234 5678');
            assert.equal(international, '+91 11 1234 5678');
        });
    });

    describe('BR Formatting Edge Cases', function () {
        const meta = loadMeta(['BR']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format Brazilian mobile formatting', function () {
            const phoneObj = {
                countryCode: '55',
                nationalNumber: '11999999999'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '(11) 99999-9999');
            assert.equal(international, '+55 11 99999-9999');
        });

        it('Should format Brazilian landline formatting', function () {
            const phoneObj = {
                countryCode: '55',
                nationalNumber: '1122223333'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '(11) 2222-3333');
            assert.equal(international, '+55 11 2222-3333');
        });
    });

    describe('JP Formatting Edge Cases', function () {
        const meta = loadMeta(['JP']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format Japanese mobile formatting', function () {
            const phoneObj = {
                countryCode: '81',
                nationalNumber: '9012345678'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '090-1234-5678');
            assert.equal(international, '+81 90-1234-5678');
        });

        it('Should format Japanese landline formatting', function () {
            const phoneObj = {
                countryCode: '81',
                nationalNumber: '357123456'
            };

            const national = handler.formatPhoneNumber(phoneObj, { style: 'national' });
            const international = handler.formatPhoneNumber(phoneObj, { style: 'international' });

            assert.equal(national, '03-5712-3456');
            assert.equal(international, '+81 3-5712-3456');
        });
    });
});
