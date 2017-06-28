'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    loadMeta = require('../server').loadMeta,
    phoneClient = require('../client'),
    phoneDataExpected = require('./input/phoneDataParsing'),
    outputDir = path.join(__dirname, 'output/'),
    outputFilePath = path.join(outputDir, 'phoneDataParsing.json'),
    phoneDataActual = {};

describe('Phone Data-Driven Tests (Negative Parsing)', function () {
    Object.keys(phoneDataExpected).forEach(function (regionCode) {
        describe('Region: ' + regionCode, function () {
            var handler;

            // initialize with metadata for region
            before(function () {
                var meta = loadMeta([regionCode]);
                handler = phoneClient.createHandler(meta);

                phoneDataActual[regionCode] = []; // prepare output object
            });

            phoneDataExpected[regionCode].forEach(function (phoneItemExpected, index) {
                describe('Item: ' + index, function () {
                    var phoneString, phoneItemActual;

                    before(function () {
                        phoneString = phoneItemExpected.phoneString;
                        phoneItemActual = {
                            phoneString: phoneString,
                            parseError: null
                        };

                    });

                    it('Should return parse error', function () {
                        var parseResult = handler.parsePhoneNumber(phoneString, regionCode);

                        assert(parseResult instanceof Error, 'Should have failed parsing (' + regionCode + ' ' + phoneString + ') but instead returned: ' + JSON.stringify(parseResult));

                        phoneItemActual.parseError = parseResult.message;
                        assert.equal(phoneItemActual.parseError, phoneItemExpected.parseError, 'Unexpected parsing result for ' + regionCode + ' ' + phoneString);
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
