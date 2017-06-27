'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    loadPhoneMeta = require('../dist/loadPhoneMeta'),
    phoneUtil = require('../dist/libphonenumberUtil'),
    phoneDataExpected = require('./input/phoneDataValidation'),
    outputDir = path.join(__dirname, 'output/'),
    outputFilePath = path.join(outputDir, 'phoneDataValidation.json'),
    phoneDataActual = {};

describe('Phone Data-Driven Tests (Negative Validation)', function () {
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
                            validationErrorMessage: null
                        };

                    });

                    it('Should return validation error', function () {
                        var validationError = handler.validatePhoneNumber(phoneObj, regionCode);

                        assert(validationError instanceof Error, 'Should have failed validation: ' + regionCode + ' ' + JSON.stringify(phoneObj));

                        phoneItemActual.validationErrorMessage = validationError.message;
                        assert.equal(phoneItemActual.validationErrorMessage, phoneItemExpected.validationErrorMessage);
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
