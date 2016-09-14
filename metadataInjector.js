goog.provide('i18n.phonenumbers.metadata'); // replace libphonenumber metadata module with this function

// i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = {};
// i18n.phonenumbers.metadata.countryToMetadata = {};

function injectMeta(map, meta) {
    console.log('injectMeta called');
    console.log('map:', map);
    // console.log('meta:', meta);
    i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = map;
    i18n.phonenumbers.metadata.countryToMetadata = meta;
}

 // unnecessary to export, since this function is called by internal code
// goog.exportSymbol('injectMeta', injectMeta);