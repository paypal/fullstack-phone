'use strict';

var assert = require('assert'),
    loadMeta = require('../loadMeta'),
    bare = require('../dist/libphonenumber_bare');

describe('Phone handler-exported functions test', function () {
    describe('Test formatting/validation of US phone numbers', function () {

        // setup
        var meta = loadMeta(['BS']); // loading Bahamas also loads US
        bare.useMeta(meta);
        bare.setRegion('US');

        it('Should show BS and US as supported regions', function () {
            assert.deepEqual(bare.getSupportedRegions(), ['BS', 'US']);
            assert.deepEqual(bare.countryCodeToRegionCodeMap(), { '1': ['US', 'BS'] });
        });

        it('Should format valid US phone numbers', function () {
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
                assert.equal(bare.formatPhoneNumber(phone, options), optionObj.result);
            });
        });

        it('Should validate valid US phone numbers', function () {
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
                assert.ok(bare.validatePhoneNumber(phone));
            });
        });

    });
});
