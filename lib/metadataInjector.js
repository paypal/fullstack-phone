goog.provide('i18n.phonenumbers.metadata'); // replace libphonenumber metadata module with this function

/**
 * @param {Object} map the countryCodeToRegionCodeMap object
 * @param {Object} meta the countryToMetadata object
 */
function injectMeta(map, meta) {
    // check if proper map and meta provided (both objects)
    if (!map || !meta || !isPlainObject(map) || !isPlainObject(meta)) {
        throw new Error(exceptions.METADATA_INVALID); // exceptions object defined in phoneAdapter.js
    }
    i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = map;
    i18n.phonenumbers.metadata.countryToMetadata = meta;
}

/**
 * @param {Object} object parameter to test
 * @return {boolean} true if parameter is a plain object
 * @private
 */
function isPlainObject(object) {
    return object !== null && '' + object === '[object Object]';
}

// unnecessary to export, since this function is called by internal code
// goog.exportSymbol('injectMeta', injectMeta);
