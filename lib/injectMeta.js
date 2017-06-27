goog.provide('i18n.phonenumbers.metadata'); // replace libphonenumber metadata module with this function

/**
 * PhoneNumberUtil is a singleton utility (unless we bypass Closure Compiler warnings to use the private constructor),
 * so metadata has to be injected for every function call
 * @param {Object} metadata the metadata object containing countryCodeToRegionCodeMap and countryToMetadata
 */
function injectMeta(metadata) {
    i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = metadata['countryCodeToRegionCodeMap'];
    i18n.phonenumbers.metadata.countryToMetadata = metadata['countryToMetadata'];
}

// unnecessary to export, since this function is called by internal code
// goog.exportSymbol('injectMeta', injectMeta);
