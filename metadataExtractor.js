#!/usr/bin/env node
'use strict';

/*
Ported from work by Marco Faustinelli (contacts@faustinelli.net)
https://gist.github.com/Muzietto/62c3fc5a1c285f091654
Adapted by dwbruhn (dwbruhn@gmail.com)
Outputs phone metadata as JSON
Note: countryCode = country calling code (e.g. 61 for AU)
      regionCode = ISO 3166- 1 alpha-2 (e.g. AU)
*/


var fs = require('fs'),
    vm = require('vm'),
    path = require('path'),
    outpath; // populated in main

function main() {

    outpath = process.argv[3];

    var metadata = fs.readFileSync(process.argv[2]),
        context = { goog: { provide: function () { } }, i18n: { phonenumbers: { metadata: {} } } };

    vm.runInNewContext(metadata, context); // provide dummy google closure wrapper around metadata.js file from libphonenumber

    var countryCodeToRegionCodeMap = context.i18n.phonenumbers.metadata.countryCodeToRegionCodeMap; // extract map from metadata
    var fullMetadata = context.i18n.phonenumbers.metadata.countryToMetadata;

    var regionCodeToCountryCodeMap = getRegionCodeToCountryCodeMap(countryCodeToRegionCodeMap); // construct simple map from territory codes ('region code') to country calling codes ('country code')
    var dependencyMap = createDependencyMap(regionCodeToCountryCodeMap, countryCodeToRegionCodeMap); // list dependencies (regions that depend on metadata of main country with shared calling code)

    // loop over each region to extract and write metadata
    Object.keys(fullMetadata).forEach(function (regionCode) {
        if (!Number.isNaN(parseInt(regionCode))) { return; } // skip 001 because it's not stored the same (keys in countryToMetadata are calling codes, not region codes)

        var regionalOutput = extractRegionalMetadata(regionCode, fullMetadata, regionCodeToCountryCodeMap, countryCodeToRegionCodeMap);
        writeRegionalFile(regionCode, regionalOutput);
    });

    // extract metadata for 001 (stored differently)
    var globalExchangeOutput = extractGlobalExchanges('001', fullMetadata, regionCodeToCountryCodeMap);
    writeRegionalFile('001', globalExchangeOutput);

    // write dependency map
    fs.writeFileSync(path.join(outpath, 'dependencyMap.json'), JSON.stringify(dependencyMap, null, 2));

    // debugging
    // fs.writeFileSync(path.join(outpath, 'countryCodeToRegionCodeMap.json'), JSON.stringify(countryCodeToRegionCodeMap, null, 2));
    // fs.writeFileSync(path.join(outpath, 'regionCodeToCountryCodeMap.json'), JSON.stringify(regionCodeToCountryCodeMap, null, 2));
    // fs.writeFileSync(path.join(outpath, 'regioncodes.properties'), 'regioncodes=' + Object.keys(regionCodeToCountryCodeMap));
}

// output regional metadata files
function writeRegionalFile(regionCode, regionalOutput) {
    fs.writeFileSync(path.join(outpath, regionCode + '.json'), JSON.stringify(regionalOutput));
}

/**
 * Extract metadata for given regionCode
 */
function extractRegionalMetadata(regionCode, fullMetadata, regionCodeToCountryCodeMap, countryCodeToRegionCodeMap) {

    var countryToMetadataLocal = {},
        countryCodeToRegionCodeMapLocal = {};

    var countryCode = regionCodeToCountryCodeMap[regionCode];

    countryCodeToRegionCodeMapLocal[countryCode] = [regionCode]; // populate country code to local region code map
    countryToMetadataLocal[regionCode] = fullMetadata[regionCode];

    var output = {
        regionCodes: [regionCode],
        countryCodeToRegionCodeMap: countryCodeToRegionCodeMapLocal,
        countryToMetadata: countryToMetadataLocal
    };

    return output;
}

// Handle the global exchanges (metadata is stored differently for 001 than for other regions)
function extractGlobalExchanges(globalRegionCode, fullMetadata, regionCodeToCountryCodeMap) {
    var countryToMetadataLocal = {},
        countryCodeToRegionCodeMapLocal = {};

    regionCodeToCountryCodeMap[globalRegionCode].forEach(function (countryCode) {
        countryToMetadataLocal[countryCode] = fullMetadata[countryCode];
        countryCodeToRegionCodeMapLocal[countryCode] = [globalRegionCode];
    });

    var output = {
        regionCodes: [globalRegionCode],
        countryCodeToRegionCodeMap: countryCodeToRegionCodeMapLocal,
        countryToMetadata: countryToMetadataLocal
    };

    return output;
}

// create dependency map (regions depend on metadata of main country for calling code)
function createDependencyMap(regionCodeToCountryCodeMap, countryCodeToRegionCodeMap) {
    var dependencyMap = {
        regionCodeToCountryCodeMap: regionCodeToCountryCodeMap,
        countryCodeToRegionCodeMap: countryCodeToRegionCodeMap
    };

    return dependencyMap;
}

// given countryCodeToRegionCodeMap (straight from metadata), reverse the map
// to map region codes to array of calling codes (e.g. 001 has 9 calling codes)
function getRegionCodeToCountryCodeMap(countryCodeToRegionCodeMap) {
    var regionCodeToCountryCodeMap = {};
    // loop over country calling codes
    Object.keys(countryCodeToRegionCodeMap).forEach(function (countryCode) {

        // loop over region codes for each calling code
        countryCodeToRegionCodeMap[countryCode].forEach(function (regionCode) {
            if (!regionCodeToCountryCodeMap[regionCode]) {
                regionCodeToCountryCodeMap[regionCode] = [];
            }
            regionCodeToCountryCodeMap[regionCode].push(countryCode);
        });
    });

    return regionCodeToCountryCodeMap;
}

module.exports = main(); // export execution of main
