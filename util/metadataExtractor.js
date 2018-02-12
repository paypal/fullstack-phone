#!/usr/bin/env node
'use strict';

/*
Ported from work by Marco Faustinelli (contacts@faustinelli.net)
https://gist.github.com/Muzietto/62c3fc5a1c285f091654
Adapted by dwbruhn (dwbruhn@gmail.com)
Outputs phone metadata as JSON
Note: countryCode = country calling code (e.g. 61 for AU)
      regionCode = ISO 3166-1 alpha-2 (e.g. AU)
*/


var fs = require('fs');
var vm = require('vm');
var path = require('path');
var outpath; // populated in main
var finalMetadata = {};

// some systems support these region codes, but libphonenumber does not
// for unsupported region codes, "fake" the metadata by copying from supported regions
var augmentations = {
    PN: 'NZ', // Pitcairn Islands - copy NZ metadata
    AN: 'BQ' // Netherlands Antilles - copy Bonaire, Sint Eustatius and Saba
};

function main() {

    outpath = process.argv[3];

    var metadata = fs.readFileSync(process.argv[2], 'utf8'),
        context = { goog: { provide: function () { } }, i18n: { phonenumbers: { metadata: {} } } };

    vm.runInNewContext(metadata, context); // provide dummy google closure wrapper around metadata.js file from libphonenumber

    var countryCodeToRegionCodeMap = context.i18n.phonenumbers.metadata.countryCodeToRegionCodeMap; // extract map from metadata
    var fullMetadata = context.i18n.phonenumbers.metadata.countryToMetadata;

    var regionCodeToCountryCodeMap = getRegionCodeToCountryCodeMap(countryCodeToRegionCodeMap); // construct simple map from territory codes ('region code') to country calling codes ('country code')

    applyAugmentations(countryCodeToRegionCodeMap, regionCodeToCountryCodeMap, fullMetadata); // non-pure function (modifies parameters)

    var dependencyMap = createDependencyMap(regionCodeToCountryCodeMap, countryCodeToRegionCodeMap); // list dependencies (regions that depend on metadata of main country with shared calling code)

    // loop over each region to extract and write metadata
    Object.keys(fullMetadata).forEach(function (regionCode) {
        if (!Number.isNaN(parseInt(regionCode))) { return; } // skip 001 because it's not stored the same (keys in countryToMetadata are calling codes, not region codes)

        var regionalOutput = extractRegionalMetadata(regionCode, fullMetadata, regionCodeToCountryCodeMap, countryCodeToRegionCodeMap);
        finalMetadata[regionCode] = regionalOutput; // save region in final metadata
    });

    // extract metadata for 001 (stored differently)
    var globalExchangeOutput = extractGlobalExchanges('001', fullMetadata, regionCodeToCountryCodeMap);
    finalMetadata['001'] = globalExchangeOutput; // save in final metadata

    // write dependency map
    fs.writeFileSync(path.join(outpath, 'dependencyMap.json'), JSON.stringify(dependencyMap, null, 2));

    // write final metadata
    fs.writeFileSync(path.join(outpath, 'metadata.json'), JSON.stringify(finalMetadata, null, 2));

    // debugging
    // fs.writeFileSync(path.join(outpath, 'countryCodeToRegionCodeMap.json'), JSON.stringify(countryCodeToRegionCodeMap, null, 2));
    // fs.writeFileSync(path.join(outpath, 'regionCodeToCountryCodeMap.json'), JSON.stringify(regionCodeToCountryCodeMap, null, 2));
    // fs.writeFileSync(path.join(outpath, 'regioncodes.properties'), 'regioncodes=' + Object.keys(regionCodeToCountryCodeMap));
}

// augment metadata for unsupported regions
function applyAugmentations(countryCodeToRegionCodeMap, regionCodeToCountryCodeMap, fullMetadata) {
    Object.keys(augmentations).forEach(function (newRegionCode) {
        if (fullMetadata[newRegionCode]) {
            throw new Error('Libphonenumber already has metadata for this "unsupported" region; check and update augmentations: ' + newRegionCode);
        }

        var sourceRegion = augmentations[newRegionCode], // get source region to copy
            // get list of country calling codes for source region (note that only 001 currently has multiple country codes)
            countryCodeArray = regionCodeToCountryCodeMap[sourceRegion];

        // augment countryCodeToRegionCodeMap
        countryCodeArray.forEach(function (countryCode) {
            countryCodeToRegionCodeMap[countryCode].push(newRegionCode);
        });

        // augment regionCodeToCountryCodeMap
        regionCodeToCountryCodeMap[newRegionCode] = countryCodeArray;

        // augment metadata: stringify source region metadata to JSON, replace regionCode, parse back to object
        var newRegionMeta = JSON.parse(
            JSON.stringify(fullMetadata[sourceRegion]).replace('"' + sourceRegion + '"', '"' + newRegionCode + '"')
        );
        fullMetadata[newRegionCode] = newRegionMeta;
    });
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
