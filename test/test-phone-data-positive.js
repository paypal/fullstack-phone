'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    loadPhoneMeta = require('../dist/loadPhoneMeta'),
    phoneUtil = require('../dist/phoneUtil'),
    phoneDataExpected = require('./input/phoneDataPositive'),
    outputDir = path.join(__dirname, 'output/'),
    outputFilePath = path.join(outputDir, 'phoneDataPositive.json'),
    phoneDataActual = {};

describe('Phone Data-Driven Tests (Positive)', function () {
    Object.keys(phoneDataExpected).forEach(function (regionCode) {
        describe('Region: ' + regionCode, function () {

            // initialize with metadata for region
            before(function () {
                var meta = loadPhoneMeta([regionCode]);
                phoneUtil.useMeta(meta);

                phoneDataActual[regionCode] = []; // prepare output object
            });

            phoneDataExpected[regionCode].forEach(function (phoneItemExpected, index) {
                describe('Item: ' + index, function () {
                    var phoneObj, phoneItemActual;

                    before(function () {
                        phoneObj = phoneItemExpected.phoneObj;
                        phoneItemActual = {
                            phoneObj: phoneObj,
                            validationResult: null,
                            formatted: {}
                        };

                    });

                    it('Should validate phone number', function () {
                        phoneItemActual.validationResult = phoneUtil.validatePhoneNumber(phoneObj, regionCode);
                        assert.deepEqual(phoneItemActual.validationResult, phoneItemExpected.validationResult);
                    });

                    Object.keys(phoneItemExpected.formatted).forEach(function (format) {
                        it('Should format phone number: ' + format, function () {
                            var options = { style: format };
                            phoneItemActual.formatted[format] = phoneUtil.formatPhoneNumber(phoneObj, options);
                            assert.equal(phoneItemActual.formatted[format], phoneItemExpected.formatted[format], 'Formatting failed for ' + regionCode + ' ' + format);
                        });

                        it('Should parse formatted phone number string (from ' + format + ') to object', function () {
                            var parsedPhoneObj = phoneUtil.parsePhoneNumber(phoneItemExpected.formatted[format], regionCode);
                            assert.deepEqual(parsedPhoneObj, phoneObj);
                        });
                    });

                    after(function () {
                        phoneDataActual[regionCode].push(phoneItemActual);
                    });

                });
            }); // end loop over items for given regionCode
        });
    }); // end loop over regionCodes

    after(function () {
        mkdirSync(outputDir);
        fs.writeFileSync(outputFilePath, JSON.stringify(phoneDataActual, null, 4));
    });
});

// helper function
function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
}