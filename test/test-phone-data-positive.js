'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    loadPhoneMeta = require('../dist/loadPhoneMeta'),
    phoneUtil = require('../dist/libphonenumberUtil'),
    phoneDataExpected = require('./input/phoneDataPositive'),
    outputDir = path.join(__dirname, 'output/'),
    outputFilePath = path.join(outputDir, 'phoneDataPositive.json'),
    phoneDataActual = {};

describe('Phone Data-Driven Tests (Positive)', function () {
    Object.keys(phoneDataExpected).forEach(function (regionCode) {
        describe('Region: ' + regionCode, function () {
            var handler;

            // initialize with metadata for region
            before(function () {
                var meta = loadPhoneMeta([regionCode]);
                handler = phoneUtil.createHandler(meta);

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
                        phoneItemActual.validationResult = handler.validatePhoneNumber(phoneObj, regionCode);
                        assert.deepEqual(phoneItemActual.validationResult, phoneItemExpected.validationResult);
                    });

                    Object.keys(phoneItemExpected.formatted).forEach(function (format) {
                        it('Should format phone number: ' + format, function () {
                            var options = { style: format };
                            phoneItemActual.formatted[format] = handler.formatPhoneNumber(phoneObj, options);
                            assert.equal(phoneItemActual.formatted[format], phoneItemExpected.formatted[format], 'Formatting failed for ' + regionCode + ' ' + format);
                        });

                        it('Should parse formatted phone number string (from ' + format + ') to object', function () {
                            var expectedPhoneObj = JSON.parse(JSON.stringify(phoneObj));
                            var parsedPhoneObj = handler.parsePhoneNumber(phoneItemExpected.formatted[format], regionCode);

                            if (format === 'e164') {
                                delete expectedPhoneObj.extension; // no extension in e164 format, so don't compare it in phoneObj
                            }

                            assert.deepEqual(parsedPhoneObj, expectedPhoneObj);
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
