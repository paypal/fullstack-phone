/**
 * Module that returns appropriate set of libphonenumber metadata, given array of region codes
 * e.g. CA, US, KZ, and RU metadata given input array: ['CA', 'KZ']
 */

'use strict';

var dependencyMap = require('./metadata/dependencyMap');
var fullMetadata = require('./metadata/metadata');

var exceptions = {
    REGIONCODE_ARRAY_INVALID: 'Invalid region code array parameter',
    METADATA_NOT_FOUND: 'No phone metadata found for region: '
};

/**
 * Given array of region codes whose metadata is desired
 * Return libphonenumber metadata for those regions, including the necessary metadata for the main countries for each country calling code
 * E.g. if the array includes CA (country calling code 1), then the metadata must also include the US, which is the main country for calling code 1
 */
module.exports = function loadMeta(regionCodeArray) {
    // if regionCodeArray is undefined, load all regions
    if (regionCodeArray === undefined) {
        regionCodeArray = Object.keys(fullMetadata);
    }
    if (!Array.isArray(regionCodeArray) || !regionCodeArray.length) {
        throw new Error(exceptions.REGIONCODE_ARRAY_INVALID);
    }

    var metadata = {
        regionCodes: [], // full list of region codes
        countryCodeToRegionCodeMap: {},
        countryToMetadata: {}
    },
        allRegionCodes = [],
        allCountryCodes = [];

    // populate full list of region codes to add (regions and their main country dependencies)
    // and populate full list of country calling codes
    regionCodeArray.forEach(function (regionCode) {
        allRegionCodes.push(regionCode);

        var countryCodes = dependencyMap.regionCodeToCountryCodeMap[regionCode];

        if (!countryCodes) {
            throw new Error(exceptions.METADATA_NOT_FOUND + regionCode);
        }
        allCountryCodes = allCountryCodes.concat(countryCodes);

        // one-liner, but hard to read:
        // allRegionCodes.concat(countryCodes.map(countryCode => dependencyMap.countryCodeToRegionCodeMap[countryCode][0]));

        // loop over country calling codes associated with this region code to get main region
        countryCodes.forEach(function (countryCode) {
            // main country is first in countryCodeToRegionCodeMap array for this country calling code
            var mainCountryforCode = dependencyMap.countryCodeToRegionCodeMap[countryCode][0];

            // add the dependent region code to allRegionCodes (will dedupe array later)
            allRegionCodes.push(mainCountryforCode);
        });
    });

    allRegionCodes = removeDuplicates(allRegionCodes); // dedupe arrays
    allCountryCodes = removeDuplicates(allCountryCodes);

    // now prepare metadata object

    metadata.regionCodes = allRegionCodes;

    // populate countryToMetadata for each region code
    allRegionCodes.forEach(function (regionCode) {
        var regionalMeta = fullMetadata[regionCode];
        // for countryToMetadata, just add keys
        // Object.keys(regionalMeta.countryToMetadata).forEach(function (cty) {
        // metadata.countryToMetadata[cty] = regionalMeta.countryToMetadata[cty];
        // });
        Object.assign(metadata.countryToMetadata, regionalMeta.countryToMetadata); // ES6
    });

    // construct countryCodeToRegionCodeMap based on included regions
    // make sure main country is first in array for each country calling code
    allCountryCodes.forEach(function (countryCode) {
        // pull countryCodeToRegionCodeMap from master map (in dependencyMap), filtering out regions not present
        metadata.countryCodeToRegionCodeMap[countryCode] = dependencyMap
            .countryCodeToRegionCodeMap[countryCode]
            .filter(function (regionCode) {
                return allRegionCodes.indexOf(regionCode) !== -1;
            });
    });

    return metadata;
};


function removeDuplicates(array) {
    var seen = {};
    return array.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
